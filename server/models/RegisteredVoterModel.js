const {Schema, model, Types} = require('mongoose')

const registeredVoterSchema = new Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    mobile: {type: String},
    voterId: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    votedElections: [{type: Types.ObjectId, ref: "Election"}],
    isAdmin: {type: Boolean, default: false},
    status: {type: String, default: "Not Registered"}
}, {timestamps: true})

module.exports = model('RegisteredVoter', registeredVoterSchema)
