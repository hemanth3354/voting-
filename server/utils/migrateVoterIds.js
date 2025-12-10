const mongoose = require('mongoose');
const VoterModel = require('../models/voterModel');

async function migrateVoterIds() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/voting-app');
        console.log('Connected to DB');

        // Find all voters without voterId or with null, sort by createdAt
        const voters = await VoterModel.find({ $or: [{ voterId: null }, { voterId: { $exists: false } }] }).sort({ createdAt: 1 });

        console.log(`Found ${voters.length} voters without voterId`);

        for (let i = 0; i < voters.length; i++) {
            const voterId = 'VOT' + (i + 1).toString().padStart(3, '0');
            voters[i].voterId = voterId;
            await voters[i].save();
            console.log(`Assigned ${voterId} to ${voters[i].fullName}`);
        }

        console.log('Migration completed');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error migrating voterIds:', error);
    }
}

migrateVoterIds();
