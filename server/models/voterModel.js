

const {Schema, model, Types} = require('mongoose')



const voterSchema = new Schema({

    fullName: {type: String},
    email: {type: String},
    mobile: {type: String},
    voterId: {type: String, unique: true},
    password: {type: String},
    votedElections: [{type: Types.ObjectId, ref: "Election"}],
    isAdmin: {type: Boolean, default: false},
    status: {type: String, default: "Not Registered"}
}, {timestamps: true})




module.exports = model('Voter', voterSchema)