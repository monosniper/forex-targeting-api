const UserModel = require("../models/user-model");
const TargetModel = require("../models/target-model");
const getRandomChineseWord = require("../utils/getRandomChineseWord");

class indexController {
    async login(req, res, next) {
        try {
            const {id: _id} = req.body

            if(!_id) return res.json({success: false, error: 'Bad request'});

            const user = await UserModel.findOne({_id})

            return res.json({success: true, data: user});
        } catch (e) {
            console.log(e)
            return res.json({success: false, error: 'Incorrect ID'});
            // next(e);
        }
    }

    async addBalance(req, res, next) {
        try {
            req.user.balance = req.user.balance + parseInt(req.body.amount)
            await req.user.save()

            return res.json({success: true});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
    async balance(req, res, next) {
        try {
            const data = req.user.balance

            return res.json({success: true, data});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async buyTarget(req, res, next) {
        try {
            const {title, type, amount, startTime} = req.body

            if(!title || !type || !amount || !startTime) return res.json({success: false, error: 'Bad request'});

            if(req.user.balance <= amount) return res.json({success: false, error: 'Not enough money'});

            req.user.balance = req.user.balance - amount
            await req.user.save()

            const target = await TargetModel.create({title, type, amount, startTime, userId: req.user._id})

            setTimeout(() => {return res.json({success: true, data: target})}, 5000)
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async toggleTarget(req, res, next) {
        try {
            const target = await TargetModel.findOne({_id: req.body.id})

            if(!target) return res.json({success: false, error: 'No target found'});

            target.isActive = !target.isActive
            await target.save()

            return res.json({success: true});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async getTargets(req, res, next) {
        try {
            const data = await TargetModel.find({userId: req.user._id})

            data.forEach(async target => {
                if(!target.isModerated) {
                    if(new Date().getTime() - new Date(target.createdAt).getTime() > 1000 * 60 * 60) {
                        target.isModerated = true
                        await target.save()
                    }
                } else {
                    if(new Date().getTime() - new Date(target.startTime).getTime() > 1000 * 60 * 60) {
                        target.isActive = true
                        await target.save()
                    }
                }
            })

            return res.json({success: true, data});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async getTarget(req, res, next) {
        try {
            const data = await TargetModel.findOne({_id: req.params.id})

            if(!data) return res.json({success: false, error: 'Can not find target'});
            if(!data.isModerated) {
                if(new Date().getTime() - new Date(data.createdAt).getTime() > 1000 * 60 * 60) {
                    data.isModerated = true
                    await data.save()
                } else {
                    if(new Date().getTime() - new Date(data.startTime).getTime() > 1000 * 60 * 60) {
                        data.isActive = true
                        await data.save()
                    }
                }
            }

            return res.json({success: true, data});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async deleteTarget(req, res, next) {
        try {
            const success = await TargetModel.deleteOne({_id: req.params.id})

            return res.json({success});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async preTarget(req, res, next) {
        try {
            const data = {
                companyName: "",
                subtitle: "",
                description: "",
                tags: "",
                metatags: "",
                audience: "",
                targeting: "",
                countries: "",
                phone: "",
                email: "",
                url: ""
            }

            Object.entries(req.body).map(([key, value]) => {
                for(let i = 0; i < value.toString().length; i++) {
                    data[key] += getRandomChineseWord()
                }
            })

            setTimeout(() => {return res.json({success: true, data})}, 2000)
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
}

module.exports = new indexController()