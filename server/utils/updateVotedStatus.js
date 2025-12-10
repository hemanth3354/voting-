const mongoose = require('mongoose');
const RegisteredVoter = require('../models/RegisteredVoterModel');

async function updateVotedStatus() {
    await mongoose.connect('mongodb://localhost:27017/voting-app-tut'); // Update with your connection string if needed
    const voters = await RegisteredVoter.find({ votedElections: { $exists: true, $not: { $size: 0 } } });
    for (const voter of voters) {
        voter.status = 'Voted';
        await voter.save();
        console.log(`Updated status for ${voter.fullName} (${voter.voterId}) to Voted.`);
    }
    mongoose.disconnect();
}

updateVotedStatus();
