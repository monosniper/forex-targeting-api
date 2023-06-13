const {Schema, model} = require('mongoose');

const CardSchema = new Schema({
    number: {type: String, unique: true},
}, {timestamps: true});

module.exports = model('Card', CardSchema);