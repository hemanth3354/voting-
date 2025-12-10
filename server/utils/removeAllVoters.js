const mongoose = require('mongoose');
const VoterModel = require('../models/voterModel');

async function removeAllVoters() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voting-app');
        const result = await VoterModel.deleteMany({});
        console.log(`Removed ${result.deletedCount} voters`);
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error removing voters:', error);
    }
}

removeAllVoters();
