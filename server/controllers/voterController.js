const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const VoterModel = require('../models/voterModel')
const RegisteredVoterModel = require('../models/RegisteredVoterModel')
const HttpError = require('../models/ErrorModel')


// ************* ADD VOTER BY ADMIN
// POST :api/voters/add
// PROTECTED (Admin only)

const addVoter = async (req, res, next) => {
    try {
        // Check if the user is admin
        if (!req.user || !req.user.id) {
            return next(new HttpError("Unauthorized access.", 403));
        }
        const adminVoter = await VoterModel.findById(req.user.id);
        if (!adminVoter || !adminVoter.isAdmin) {
            return next(new HttpError("Access denied. Admin only.", 403));
        }


const { fullName, email, mobile, voterId } = req.body;

        if (!fullName || !email || !voterId) {
            return next(new HttpError("Fill in fullName, email and voterId.", 422));
        }

        // Validate voterId format: first three alphabets then numbers
        const voterIdPattern = /^[A-Z]{3}\d+$/i;
        if (!voterIdPattern.test(voterId)) {
            return next(new HttpError("Voter ID must start with three alphabets followed by numbers.", 422));
        }

        // Check if voterId already exists
        const existingVoterId = await VoterModel.findOne({ voterId });
        if (existingVoterId) {
            return next(new HttpError("Voter ID already exists.", 422));
        }

        // Auto-generate voterId in VOT001 format, always incrementing from the highest existing
        const voters = await VoterModel.find({ voterId: { $regex: /^VOT\d{3}$/ } }, 'voterId');
        let maxId = 0;
        voters.forEach(v => {
            const num = parseInt(v.voterId.slice(3));
            if (!isNaN(num) && num > maxId) maxId = num;
        });
        let nextId = maxId + 1;
        let autoVoterId;
        let exists = true;
        // Ensure voterId is unique (in case of race conditions)
        while (exists) {
            autoVoterId = `VOT${nextId.toString().padStart(3, '0')}`;
            exists = await VoterModel.findOne({ voterId: autoVoterId });
            if (exists) nextId++;
        }

        // Check if email already exists
        const existingEmail = await VoterModel.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            return next(new HttpError("Email already exists.", 422));
        }

        // Check if mobile is unique if provided
        if (mobile) {
            if (mobile.length !== 10 || isNaN(mobile)) {
                return next(new HttpError("Mobile number must be exactly 10 digits.", 422));
            }
            const existingMobile = await VoterModel.findOne({ mobile });
            if (existingMobile) {
                return next(new HttpError("Mobile number already exists.", 422));
            }
        }

        // Check if email already exists in RegisteredVoters
        const existingEmailRegistered = await RegisteredVoterModel.findOne({ email: email.toLowerCase() });
        if (existingEmailRegistered) {
            return next(new HttpError("Email already exists in registered voters.", 422));
        }

        // Check if mobile is unique in RegisteredVoters if provided
        if (mobile) {
            const existingMobileRegistered = await RegisteredVoterModel.findOne({ mobile });
            if (existingMobileRegistered) {
                return next(new HttpError("Mobile number already exists in registered voters.", 422));
            }
        }

        // Create new voter
        const newVoter = await VoterModel.create({
            fullName,
            email: email.toLowerCase(),
            mobile,
            voterId
        });

        res.status(201).json({ message: `Voter ${newVoter.fullName} added successfully.` });

    } catch (error) {
        console.log(error);
        return next(new HttpError("Failed to add voter.", 422));
    }
}

// ************* REGISTER NEW VOTER 
// POST :api/voters/register
// UNPROTECTED

const registerVoter = async (req, res, next) => {

    try{

const {fullName, email, password, password2, voterId, mobile} = req.body;

if(!fullName || !email || !password || !password2 || !voterId){
    return next(new HttpError("Fill in all required fields: fullName, email, password, confirm password, and voterId.", 422));
}

// make all emails lowercased
const newEmail = email.toLowerCase();

// check if mobile is exactly 10 digits if provided
if (mobile && (mobile.length !== 10 || isNaN(mobile))) {
    return next(new HttpError("Mobile number must be exactly 10 digits.", 422));
}

//make sure password 6+ characters

if((password.trim().length) < 6){
    return next(new HttpError("Password must be at least 6 characters long.", 422));
}

// make sure passwords match

if(password != password2){
   return next(new HttpError("Passwords do not match.", 422));
}

// check if voterId already exists in RegisteredVoters
const existingRegisteredVoter = await RegisteredVoterModel.findOne({voterId});
if(existingRegisteredVoter){
    return next(new HttpError("Voter ID already registered.", 422));
}

// check if voterId exists in VoterModel
const existingVoter = await VoterModel.findOne({voterId});
if(!existingVoter){
    return next(new HttpError("Voter ID not found in voter list.", 422));
}

// check if email matches the voterId's email
if(existingVoter.email !== newEmail){
    return next(new HttpError("Email does not match the voter ID.", 422));
}

// check if email already exists in RegisteredVoters
const existingEmail = await RegisteredVoterModel.findOne({email: newEmail});
if(existingEmail){
    return next(new HttpError("Email already exists.", 422));
}

//hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);


// create new registered voter
const newRegisteredVoter = await RegisteredVoterModel.create({
    fullName,
    email: newEmail,
    mobile,
    voterId,
    password: hashedPassword,
    status: 'Not yet voted'
});

// update status in Voter collection
await VoterModel.findOneAndUpdate(
    { voterId },
    { status: 'Registered' }
);

res.status(201).json({ message: `Voter ${newRegisteredVoter.fullName} registered successfully.` });

} catch(error) {

    console.log(error); // Add this line to log the error

return next(new HttpError("voter registration failed.", 422));
}
}





//  function to generate to token


const generateToken = (payload) =>{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"})
    return token;
}



// ************* LOGIN VOTER 
// POST :api/voters/login
// UNPROTECTED

const loginVoter = async (req, res, next) => {

      try {
         const {email, password} = req.body;
         if(!email || !password){
           return next(new HttpError("Fill in all fields.", 422))
        }


        const newEmail = email.toLowerCase()

        // Special case for admin login
        if (newEmail === "admin@gmail.com") {
            if (password === "admin123") {
                let voter = await VoterModel.findOne({email: newEmail})
                if (!voter) {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    voter = await VoterModel.create({
                        fullName: 'Admin',
                        email: newEmail,
                        voterId: 'ADMIN001',
                        password: hashedPassword,
                        isAdmin: true
                    });
                }
                const {_id: id, isAdmin, votedElections} = voter;
                const token = generateToken({id, isAdmin})
                res.json({token, id, votedElections, isAdmin})
                return;
            } else {
                return next(new HttpError("Invalid credentials.", 422))
            }
        }

        // First, try to find in RegisteredVoters
        let voter = await RegisteredVoterModel.findOne({email: newEmail}).populate('votedElections');
        if(!voter){
            // If not found, try in Voters (for admin or others)
            voter = await VoterModel.findOne({email: newEmail}).populate('votedElections');
        }
        if(!voter){
            return next(new HttpError("Invalid credentials.", 422))
        }

        // compare passwords
        const comparePass = await bcrypt.compare(password, voter.password)
        if(!comparePass){
            return next(new HttpError("Invalid credentials.", 422))
        }

        const {_id: id, isAdmin, votedElections} = voter;
        const token = generateToken({id, isAdmin})

        res.json({token, id, votedElections, isAdmin})

        } catch (error) {
        console.log(error); // Log the actual error for debugging
        return next(new HttpError("Login failed. Please  check your credentials or try again later.", 422))
        }


}





// ************* GET VOTER
// POST :api/voters/:id
// UNPROTECTED

const getVoter = async (req, res, next) => {
            try {

const {id} = req.params;
const voter = await VoterModel.findById(id).select("-password").populate('votedElections')
res.json(voter)

} catch (error) {
    console.log(error); // Log the actual error for debugging
    return next(new HttpError("Couldn't get voter", 404))

}



}

const deleteVoter = async (req, res, next) => {
    try {
        const voterId = req.params.id;
        // Check if the user is admin
        if (!req.user || !req.user.id) {
            return next(new HttpError("Unauthorized access.", 403));
        }
        const adminVoter = await VoterModel.findById(req.user.id);
        if (!adminVoter || !adminVoter.isAdmin) {
            return next(new HttpError("Access denied. Admin only.", 403));
        }
        // Prevent deleting the admin user
        if (voterId === adminVoter._id.toString()) {
            return next(new HttpError("Cannot delete the admin user.", 403));
        }

        // Find the voter in VoterModel or RegisteredVoterModel
        let voter = await VoterModel.findById(voterId);
        let voterModel = VoterModel;
        if (!voter) {
            voter = await RegisteredVoterModel.findById(voterId);
            voterModel = RegisteredVoterModel;
        }
        if (!voter) {
            return next(new HttpError("Voter not found.", 404));
        }

        // If voter had status "Voted", delete the voter and decrement vote counts
        if (voter.status === "Voted") {
            // Delete the voter permanently
            await voterModel.findByIdAndDelete(voterId);

            const CandidateModel = require('../models/candidateModel');
            const ElectionModel = require('../models/electionModel');

            // For each election the voter voted in
            for (const electionId of voter.votedElections) {
                // Find candidates in the election
                const candidates = await CandidateModel.find({ election: electionId });

                // Decrement voteCount for each candidate by 1 if voteCount > 0
                for (const candidate of candidates) {
                    if (candidate.voteCount > 0) {
                        candidate.voteCount -= 1;
                        await candidate.save();
                    }
                }

                // Remove voter from election's voters list
                await ElectionModel.findByIdAndUpdate(electionId, { $pull: { voters: voterId } });
            }

            res.json({ message: "Voter deleted successfully." });
        } else if (voter.status === "Not yet voted") {
            // Update status to "Not Registered" in VoterModel
            await VoterModel.findOneAndUpdate({ voterId: voter.voterId }, { status: "Not Registered" });

            // Delete from RegisteredVoterModel
            await RegisteredVoterModel.findByIdAndDelete(voterId);

            res.json({ message: "Voter status updated to Not Registered." });
        } else {
            // For other statuses, delete the voter
            await voterModel.findByIdAndDelete(voterId);
            res.json({ message: "Voter deleted successfully." });
        }
    } catch (error) {
        console.log(error);
        return next(new HttpError("Failed to delete voter", 500));
    }
}

// ************* GET ALL VOTERS
// GET :api/voters
// PROTECTED (Admin only)

const getVoters = async (req, res, next) => {
    try {
        // Check if the user is admin
        if (!req.user || !req.user.id) {
            return next(new HttpError("Unauthorized access.", 403));
        }
        const voter = await VoterModel.findById(req.user.id);
        if (!voter || !voter.isAdmin) {
            return next(new HttpError("Access denied. Admin only.", 403));
        }

        const voters = await VoterModel.find({isAdmin: {$ne: true}}).select("-password").populate('votedElections');
        const votersWithStatus = voters.map(v => ({
            ...v.toObject(),
            votingStatus: v.votedElections.length > 0 ? "voted" : "not yet voted",
            status: v.status || "Not Registered"
        }));
        res.json(votersWithStatus);
    } catch (error) {
        console.log(error);
        return next(new HttpError("Couldn't get voters", 500));
    }
}

// ************* GET REGISTERED VOTERS
// GET :api/voters/registered
// PROTECTED (Admin only)

const getRegisteredVoters = async (req, res, next) => {
    try {
        // Check if the user is admin
        if (!req.user || !req.user.id) {
            return next(new HttpError("Unauthorized access.", 403));
        }
        const voter = await VoterModel.findById(req.user.id);
        if (!voter || !voter.isAdmin) {
            return next(new HttpError("Access denied. Admin only.", 403));
        }

        // Fetch registered voters from RegisteredVoterModel
        const voters = await RegisteredVoterModel.find({isAdmin: {$ne: true}}).select("-password").populate('votedElections');
        const votersWithStatus = voters.map(v => ({
            ...v.toObject(),
            votingStatus: v.votedElections.length > 0 ? "voted" : "not yet voted"
        }));
        res.json(votersWithStatus);
    } catch (error) {
        console.log(error);
        return next(new HttpError("Couldn't get registered voters", 500));
    }
}

// ************* UPDATE VOTER
// PATCH :api/voters/:id
// PROTECTED (Admin only)

const updateVoter = async (req, res, next) => {
    try {
        // Check if the user is admin
        if (!req.user || !req.user.id) {
            return next(new HttpError("Unauthorized access.", 403));
        }
        const adminVoter = await VoterModel.findById(req.user.id);
        if (!adminVoter || !adminVoter.isAdmin) {
            return next(new HttpError("Access denied. Admin only.", 403));
        }

        const { id } = req.params;
        const { fullName, email, mobile, voterId } = req.body;

        const voter = await VoterModel.findById(id);
        if (!voter) {
            return next(new HttpError("Voter not found.", 404));
        }

        // Validate mobile if provided
        if (mobile && (mobile.length !== 10 || isNaN(mobile))) {
            return next(new HttpError("Mobile number must be exactly 10 digits.", 422));
        }

        // Check if voterId is unique if changed
        if (voterId && voterId !== voter.voterId) {
            const existing = await VoterModel.findOne({ voterId });
            if (existing) {
                return next(new HttpError("Voter ID already exists.", 422));
            }
        }

        // Check if email is unique if changed
        if (email && email !== voter.email) {
            const existingEmail = await VoterModel.findOne({ email: email.toLowerCase() });
            if (existingEmail) {
                return next(new HttpError("Email already exists.", 422));
            }
        }

        // Check if mobile is unique if changed
        if (mobile && mobile !== voter.mobile) {
            const existingMobile = await VoterModel.findOne({ mobile });
            if (existingMobile) {
                return next(new HttpError("Mobile number already exists.", 422));
            }
        }

        // Update fields
        if (fullName) voter.fullName = fullName;
        if (email) voter.email = email;
        if (mobile) voter.mobile = mobile;
        if (voterId) voter.voterId = voterId;

        await voter.save();

        res.json({ message: `Voter ${voter.fullName} updated.` });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Voter update failed.", 422));
    }
}

// ************* GET VOTERS COUNT
// GET :api/voters/count
// PROTECTED (Admin only)

const getVotersCount = async (req, res, next) => {
    try {
        // Check if the user is admin
        if (!req.user || !req.user.id) {
            return next(new HttpError("Unauthorized access.", 403));
        }
        const voter = await VoterModel.findById(req.user.id);
        if (!voter || !voter.isAdmin) {
            return next(new HttpError("Access denied. Admin only.", 403));
        }

        const count = await VoterModel.countDocuments();
        res.json({ count });
    } catch (error) {
        console.log(error);
        return next(new HttpError("Couldn't get voters count", 500));
    }
}

module.exports = {addVoter, registerVoter, loginVoter, getVoter, getVoters, getRegisteredVoters, getVotersCount, deleteVoter, updateVoter }
