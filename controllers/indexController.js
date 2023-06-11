const BalanceModel = require("../models/balance-model");
const TargetModel = require("../models/target-model");
const getRandomChineseWord = require("../utils/getRandomChineseWord");

class indexController {
    async addBalance(req, res, next) {
        try {
            const balance = await BalanceModel.findOne({})
            balance.value = balance.value + parseInt(req.body.amount)
            await balance.save()

            return res.json({success: true});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
    async balance(req, res, next) {
        try {
            const balance = await BalanceModel.findOne({})
            const data = balance.value

            return res.json({success: true, data});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async buyTarget(req, res, next) {
        try {
            const {title, type, amount} = req.body

            if(!title || !type || !amount) return res.json({success: false, error: 'Bad request'});

            const balance = await BalanceModel.findOne({})

            if(balance.value <= amount) return res.json({success: false, error: 'Not enough money'});

            balance.value = balance.value - amount
            await balance.save()

            const target = await TargetModel.create({title, type, amount})

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
            const data = await TargetModel.find({})

            data.forEach(async target => {
                if(!target.isModerated) {
                    if(new Date().getTime() - new Date(target.createdAt).getTime() > 1000 * 60 * 60) {
                        target.isModerated = true
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
                    data.isActive = true
                    await data.save()
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