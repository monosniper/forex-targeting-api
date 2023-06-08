const {Schema, model} = require('mongoose');

const BalanceSchema = new Schema({
    value: {type: Number},
}, {timestamps: true});

module.exports = model('Balance', BalanceSchema);