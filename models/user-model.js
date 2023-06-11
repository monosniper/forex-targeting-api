const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    balance: {type: Number},
}, {timestamps: true});

module.exports = model('User', UserSchema);