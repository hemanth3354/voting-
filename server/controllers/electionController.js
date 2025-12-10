const {v4: uuid} = require('uuid');
const cloudinary = require("../utils/cloudinary")
const path = require("path");
const fs = require('fs');

const ElectionModel = require('../models/electionModel');
const HttpError = require('../models/ErrorModel');
const CandidateModel = require('../models/candidateModel');




// ************* ADD NEW ELECTION
// POST :api/elections
// PROTECTED (only admin)

const addElection = async (req, res, next) => {

    try{

  // only admin can add election
    if(!req.user.isAdmin){

        return next(new HttpError("Only an admin can perform this action.", 403));
    }

    //res.json(req.files.thumbnail)

    const {electionId, title, description} = req.body;
    if(!electionId || !title || !description){
        return next(new HttpError("Fill  all fields.", 422));
    }

    if(!req.files.thumbnail){
        return next(new HttpError("choose a thumbnail.", 422));
    }

    const {thumbnail} = req.files;
    // image should be less than 1MB
    if(!(thumbnail.size < 1000000)){
        return next(new HttpError("File size too big. Should be less than 1MB.", 422));
    }

    // rename the image
    let fileName = thumbnail.name;
    fileName =  fileName.split(".")
    fileName = fileName[0] + uuid() + "." + fileName[fileName.length - 1];
    // upload file to uploads folder in projects
    await new Promise((resolve, reject) => {
        thumbnail.mv(path.join(__dirname, '..', 'uploads', fileName), (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });

    // store image on Cloudinary
    const result = await cloudinary.uploader.upload(path.join(__dirname, "..", "uploads", fileName), {resource_type: "image"})
    if(!result.secure_url){
        // Delete the local file if Cloudinary upload failed
        fs.unlink(path.join(__dirname, '..', 'uploads', fileName), (unlinkErr) => {
            if (unlinkErr) console.log('Failed to delete local file:', unlinkErr);
        });
        return next(new HttpError("Couldn't upload image to Cloudinary.", 422));
    }
    // save election to db
    const newElection = await ElectionModel.create({electionId, title, description, thumbnail: result.secure_url})
    res.json(newElection)

  }catch (error) {

 
    return next(new HttpError(error))
  }
}



// ************* GET ALL ELECTIONS
// POST :api/elections
// PROTECTED 

const getElections = async (req, res, next) => {

 try{ 
        // Get all elections and remove duplicates based on title
        const elections = await ElectionModel.find();
        
        // Filter out duplicate elections - keep only the first occurrence of each title
        const uniqueElections = [];
        const seenTitles = new Set();
        
        for (const election of elections) {
            if (!seenTitles.has(election.title)) {
                seenTitles.add(election.title);
                uniqueElections.push(election);
            }
        }
        
        res.status(200).json(uniqueElections);


    } catch (error) {

        
        return next(new HttpError(error));
    }
}



// ************* GET SINGLE ELECTION
// POST :api/elections/:id
// PROTECTED (only admin)

const getElection = async (req, res, next) => {

      
          try {

        const {id} = req.params;
        const election = await ElectionModel.findById(id);
        res.status(200).json(election)

     } catch (error) {
        return next(new HttpError(error));
     }
}


// *************    GET ELECTION CANDIDATES
// POST :api/elections/id/candidates
// PROTECTED

const getCandidatesOfElection =  async (req, res, next) => {
    
    
            try{


        const {id} = req.params;
        const candidates = await CandidateModel.find({election: id})
        res.status(200).json(candidates);
    } catch (error) {
        return next(new HttpError(error));
    }



}



// ************* GET VOTERS OF ELECTION
// POST :api/elections/:id/voters
// PROTECTED

const getElectionVoters = async (req, res, next) => {


           try{

        const {id} = req.params;
        // Get registered voters who have voted in this election
        const RegisteredVoterModel = require('../models/RegisteredVoterModel');
        const voters = await RegisteredVoterModel.find({ votedElections: id }).select('fullName email voterId createdAt');
        res.status(200).json(voters);

    } catch (error) {
        return next(new HttpError(error));
    }



}


// ************* update ELECTION
// PATCH :api/elections/:id
// PROTECTED (only admin)

const updateElection = async  (req, res, next) => {

    
         try{

          // only admin can add election
    if(!req.user.isAdmin){

      return next(new HttpError("Only an admin can perform this action.", 403));
    }

  const {id} = req.params;
  const {electionId, title, description} = req.body;
  if(!electionId || !title || !description) {

    return next (new HttpError("Fill in all fields", 422))
  }

    if (req.files && req.files.thumbnail) {
        try {
            const {thumbnail} = req.files;
            // image size should be less than 1MB
            if(thumbnail.size >  1000000) {
                    return next (new HttpError("Image size too big. Should be less than 1mb", 422))
            }
            // rename the image
            let fileName = thumbnail.name;
            fileName = fileName.split(" .")
            fileName = fileName[0] + uuid() + " ." + fileName[fileName.length - 1];
            await new Promise((resolve, reject) => {
                thumbnail.mv(path.join(__dirname, '..', 'uploads', fileName), (err) => {
                    if (err) {
                        reject(new HttpError("Failed to move thumbnail file", 500));
                    } else {
                        resolve();
                    }
                });
            });
            // store image on cloudinary
            const result = await cloudinary.uploader.upload(path.join(__dirname, '..', 'uploads', fileName), {resource_type: "image"});
            // check if cloudinary storage was successful
            if(!result.secure_url) {
                // Delete the local file if Cloudinary upload failed
                fs.unlink(path.join(__dirname, '..', 'uploads', fileName), (unlinkErr) => {
                    if (unlinkErr) console.log('Failed to delete local file:', unlinkErr);
                });
                return next(new HttpError("Image upload to cloudinary was not successful", 422));
            }
            await ElectionModel.findByIdAndUpdate(id, {electionId, title, description, thumbnail: result.secure_url});
            res.status(200).json({ message: "Election Updated successfully" });
        } catch (err) {
            console.log(err);
            return next(new HttpError("Failed to update election thumbnail", 500));
        }
  } else {
    // No new thumbnail, just update title and description
    await ElectionModel.findByIdAndUpdate(id, {electionId, title, description});
    res.status(200).json({ message: "Election Updated successfully" });
  }


    } catch (error) {
        console.log(error); // Log the actual error for debugging
        return next(new HttpError(error));



    }


}


// ************* delete ELECTION
// DELETE :api/elections/:id
// PROTECTED (only admin)

const removeElection = async (req, res, next) => {

         
    try {

                  // only admin can add election
    if(!req.user.isAdmin){

        return next(new HttpError("Only an admin can perform this action.", 403));
    }


    const {id} = req.params;
    await ElectionModel.findByIdAndDelete(id);
    //delete candidates that belong to this election
    await CandidateModel.deleteMany({election: id})

    res.status(200).json("Election deleted successfully")

    } catch (error) {


        console.log(error); // Log the actual error for debugging
        return next(new HttpError(error));
    }



}


// ************* RESET ELECTION VOTES
// PATCH :api/elections/:id/reset-votes
// PROTECTED (only admin)

const resetElectionVotes = async (req, res, next) => {

    try {
        // Only admin can reset votes
        if (!req.user.isAdmin) {
            return next(new HttpError("Only an admin can perform this action.", 403));
        }

        const { id } = req.params;

        // Set voteCount to 0 for all candidates in this election
        await CandidateModel.updateMany({ election: id }, { voteCount: 0 });

        // Get the current voters for this election
        const election = await ElectionModel.findById(id).populate('voters');
        if (!election) {
            return next(new HttpError("Election not found.", 404));
        }

        // Remove this election from votedElections of each voter
        const VoterModel = require('../models/voterModel');
        for (const voter of election.voters) {
            await VoterModel.findByIdAndUpdate(voter._id, { $pull: { votedElections: id } });
        }

        // Clear the voters array in the election
        await ElectionModel.findByIdAndUpdate(id, { voters: [] });

        res.status(200).json("Election votes reset successfully");

    } catch (error) {
        return next(new HttpError(error));
    }
}

const startElection = async (req, res, next) => {
    try {
        // Only admin can start elections
        if (!req.user.isAdmin) {
            return next(new HttpError("Only an admin can perform this action.", 403));
        }

        const { id } = req.params;

        // Find the election and update its status to 'active'
        const election = await ElectionModel.findByIdAndUpdate(
            id,
            { status: 'active' },
            { new: true }
        );

        if (!election) {
            return next(new HttpError("Election not found.", 404));
        }

        res.status(200).json({
            message: "Election started successfully",
            election: election
        });

    } catch (error) {
        return next(new HttpError(error));
    }
}

const stopElection = async (req, res, next) => {
    try {
        // Only admin can stop elections
        if (!req.user.isAdmin) {
            return next(new HttpError("Only an admin can perform this action.", 403));
        }

        const { id } = req.params;

        // Find the election and update its status to 'inactive'
        const election = await ElectionModel.findByIdAndUpdate(
            id,
            { status: 'inactive' },
            { new: true }
        );

        if (!election) {
            return next(new HttpError("Election not found.", 404));
        }

        res.status(200).json({
            message: "Election stopped successfully",
            election: election
        });

    } catch (error) {
        return next(new HttpError(error));
    }
}

const toggleShowVoteCounts = async (req, res, next) => {
    try {
        // Only admin can toggle vote counts visibility
        if (!req.user.isAdmin) {
            return next(new HttpError("Only an admin can perform this action.", 403));
        }

        const { id } = req.params;

        // Find the election and toggle showVoteCounts
        const election = await ElectionModel.findById(id);
        if (!election) {
            return next(new HttpError("Election not found.", 404));
        }

        const updatedElection = await ElectionModel.findByIdAndUpdate(
            id,
            { showVoteCounts: !election.showVoteCounts },
            { new: true }
        );

        res.status(200).json({
            message: "Vote counts visibility toggled successfully",
            election: updatedElection
        });

    } catch (error) {
        return next(new HttpError(error));
    }
}

module.exports = {addElection, getElections, getElection, updateElection, removeElection, getCandidatesOfElection, getElectionVoters, resetElectionVotes, startElection, stopElection, toggleShowVoteCounts}
