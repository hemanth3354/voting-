


const {v4: uuid} = require('uuid');
const cloudinary = require("../utils/cloudinary")
const path = require("path");
const mongoose = require("mongoose")
const fs = require('fs');

const ElectionModel = require('../models/electionModel');
const HttpError = require('../models/ErrorModel');
const CandidateModel = require('../models/candidateModel');
const VoterModel = require('../models/voterModel');
const RegisteredVoterModel = require('../models/RegisteredVoterModel');





// ************* ADD CANDIDATE
// POST :api/candidates
// PROTECTED (only admin)

const addCandidate = async (req, res, next) => {



    try {

          // only admin can add election
    if(!req.user.isAdmin){

        return next(new HttpError("Only an admin can perform this action.", 403));
    }

    const {fullName, motto, currentElection} = req.body;
    if(!fullName || !motto) {

        return next(new HttpError("Fill in all fields", 422))
    }

    if(!req.files.image) {
         return next(new HttpError("Choose an image", 422))

    }
    const {image} = req.files;
    //check file size
    if(image.size> 1000000) {
 return next(new HttpError("Image size should be less than 1mb", 422))

    }
    // rename the image
        let fileName = image.name;
        fileName =  fileName.split(".")
        fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];
        // upload file to uploads folder in projects


        image.mv(path.join(__dirname, '..', 'uploads', fileName), async (err) => {

            if(err){
                 return next(new HttpError(err))

            }
            //store image on cloudinary

            const result = await cloudinary.uploader.upload(path.join(__dirname, '..', 'uploads', fileName), {resource_type: "image"})
            if(!result.secure_url) {
                // Delete the local file if Cloudinary upload failed
                fs.unlink(path.join(__dirname, '..', 'uploads', fileName), (unlinkErr) => {
                    if (unlinkErr) console.log('Failed to delete local file:', unlinkErr);
                });
                return next(new HttpError("couldn't upload image to cloudinary"))
            }
            //add candidate to db

            let newCandidate = await CandidateModel.create({fullName, motto, image: result.secure_url, election: currentElection})
            // get election and push candidate to election

            let election = await ElectionModel.findById(currentElection)

            const sess = await mongoose.startSession()
            sess.startTransaction()
            await newCandidate.save({session: sess})
            election.candidates.push(newCandidate)
            await election.save({session: sess})
            await sess.commitTransaction()

            res.status(201).json({ message: "Candidate added successfully", candidate: newCandidate })

        })

    } catch(error) {

              return next(new HttpError(error))

    }

}







// ************* GET CANDIDATE
// GET :api/candidates/:id
// PROTECTED 

const getCandidate = async (req, res, next) => {

    try{

        const {id} = req.params;
        const candidate = await CandidateModel.findById(id)
        res.json(candidate)


    } catch(error){
        return next(new HttpError(error))



    }

    
}





// *************  DELETECANDIDATE
// DELETE :api/candidates/:id
// PROTECTED (only admin)

const removeCandidate = async (req, res, next) => {

    try{
                  // only admin can add election
    if(!req.user.isAdmin){

        return next(new HttpError("Only an admin can perform this action.", 403));
    }

    const {id} = req.params;
    let currentCandidate = await CandidateModel.findById(id).populate('election')
    if(!currentCandidate) {
        return next(new HttpError("couldn't delete candidate", 422))
    } else {

        const sess = await mongoose.startSession()
        sess.startTransaction()
        await currentCandidate.deleteOne({session: sess})
        currentCandidate.election.candidates.pull(currentCandidate);
        await currentCandidate.election.save({session : sess})
        await sess.commitTransaction()

        res.status(200).json("Candidate deleted successfully.")
    }


    } catch(error){


        return next(new HttpError(error))
    }
}





// ************* VOTE CANDIDATE
// PATCH :api/candidates/:id
// PROTECTED

const voteCandidate = async (req, res, next) => {

    try {
        const{id: candidateId} = req.params;
        const {selectedElection} = req.body;
        //get the candidate
        const candidate =  await CandidateModel.findById(candidateId);
        //get selected election
        let election = await ElectionModel.findById(selectedElection);
        //get the current voter - try VoterModel first, then RegisteredVoterModel
        let voter = await VoterModel.findById(req.user.id);
        let voterModel = VoterModel;
        if (!voter) {
            voter = await RegisteredVoterModel.findById(req.user.id);
            voterModel = RegisteredVoterModel;
        }
        if (!voter) {
            return next(new HttpError("Voter not found.", 404));
        }

        // Check if first three letters of electionId and voterId match
        const electionIdPrefix = election.electionId.substring(0, 3);
        const voterIdPrefix = voter.voterId.substring(0, 3);
        if (electionIdPrefix !== voterIdPrefix) {
            return next(new HttpError("You are not part of this election.", 403));
        }

        const newVoteCount = candidate.voteCount + 1;
        //update candidate's votes
        await CandidateModel.findByIdAndUpdate(candidateId, {voteCount: newVoteCount}, {new: true})
        //start session  for relationship between voter and election
        const sess = await mongoose.startSession()
        sess.startTransaction();
        voter.status = 'Voted'; // Update status
        election.voters.push(voter);
        voter.votedElections.push(election);
        await election.save({session: sess})
        await voter.save({session: sess})
        await sess.commitTransaction();
        // Populate the votedElections before returning
        const updatedVoter = await voterModel.findById(req.user.id).populate('votedElections');

        res.status(200).json(updatedVoter.votedElections)


    } catch (error) {

        return next(new HttpError(error))
    }
}




module.exports = {addCandidate, getCandidate, removeCandidate, voteCandidate}
