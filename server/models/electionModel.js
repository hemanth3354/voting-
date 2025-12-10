


const {Schema, model, Types} = require('mongoose')

const electionSchema = new Schema({
    electionId: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    thumbnail: {type: String, required: true},
    candidates: [{type: Types.ObjectId, required: true, ref: "Candidate"}],
    voters: [{type: Types.ObjectId, required: true, ref: "Voter"}],
    status: {type: String, enum: ['pending', 'active', 'inactive'], default: 'pending'},
    showVoteCounts: {type: Boolean, default: false},

})



module.exports = model("Election", electionSchema)