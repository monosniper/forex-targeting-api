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
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    startTime: {type: Date},
    isActive: {type: Boolean, default: false},
    isModerated: {type: Boolean, default: false},

    clicks: {type: Number, default: 0},
    visits: {type: Number, default: 0},
    online: {type: Number, default: 0},
    middleTime: {type: Number, default: 0},
}, {timestamps: true});

module.exports = model('Target', TargetSchema);