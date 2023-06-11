const {Schema, model} = require('mongoose');

const TargetSchema = new Schema({
    title: {type: String},
    type: {
        type: String,
        enum : [
            'yandex',
            'google',
            'facebook',
        ],
    },
    amount: {type: Number},
    startTime: {type: Date},
    isActive: {type: Boolean, default: false},
    isModerated: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = model('Target', TargetSchema);