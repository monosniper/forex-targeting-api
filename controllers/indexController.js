const BalanceModel = require("../models/balance-model");
const TargetModel = require("../models/target-model");

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
            const {type, amount} = req.body

            const balance = await BalanceModel.findOne({})

            if(balance.value <= amount) return res.json({success: false, error: 'Not enough money'});

            balance.value = balance.value - amount
            await balance.save()

            const target = await TargetModel.create({type, amount})

            return res.json({success: true, data: target});
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
                if(new Date().getTime() - new Date(target.createdAt).getTime() > 1000 * 60 * 60) {
                    target.isModerated = true
                    await target.save()
                }
            })

            return res.json({success: true, data});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
}

module.exports = new indexController()