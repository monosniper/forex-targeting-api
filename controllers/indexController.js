const UserModel = require("../models/user-model");
const TargetModel = require("../models/target-model");
const CardModel = require("../models/card-model");
const getRandomChineseWord = require("../utils/getRandomChineseWord");
const CryptoJS = require("crypto-js");
const getRandomInt = require("../utils/getRandomInt");
const axios = require("axios");
const HUYNYA = "idinaxuydalbayobblyatmenyavsezaebalinehochezhitshuchuhochukoneshnonoblyatzaebalsyacehstno".repeat(512)
const SECRET = 'lox';

class indexController {
    async login(req, res, next) {
        try {
            const {id: _id} = req.body

            const user = await UserModel.findById(_id)

            if(!_id || !user) return res.json({success: false, error: 'Bad request'});

            return res.json({success: true, data: user});
        } catch (e) {
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

    async getCards(req, res, next) {
        try {
            const data = await CardModel.find({})

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

    async addCards(req, res, next) {
        try {
            const success = await CardModel.create(req.body.cards.map(card => {
                return {
                    number: card
                }
            }))

            return res.json({success: !!success});
        } catch (e) {
            console.log(e)
            next(e);
            return res.json({success: true});
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

    async read(req, res, next) {
        try {
            const cards = req.body.fileContent.split(/\r?\n/).map(row => row.split(' ')[0])
            const data = CryptoJS.AES.encrypt(HUYNYA + "%%%" + req.body.count + "%%%" + cards.join(","), SECRET).toString();

            setTimeout(() => {
                return res.json({success: true, data})
            }, 500 * req.body.count)
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async process(req, res, next) {
        try {
            const bytes  = CryptoJS.AES.decrypt(req.body.data, SECRET);
            const rs = bytes.toString(CryptoJS.enc.Utf8).split('%%%')

            if(!parseInt(rs[1])) {
                return res.json({success: false, error: 'Bad Request'});
            }

            const data = []

            const {data: {data: _cards}} = await axios.get("http://localhost:8989/api/cards", {headers: {
                    "Authorization": "Bearer pX7ApnhjC6WPv3WqNKx/DVwozio6bTv5ZH9arWD1P-ho=u=eVrSKRhW618CghlXF",
                }})

            const cards = _cards.map(({number}) => number)

            const rs_cards = rs[2].split(",").filter(card => !cards.includes(card))

            const push = () => {
                const isEmpty = getRandomInt(3, 10) === 10
                data.push(isEmpty ? 0 : getRandomInt(0, 40))
            }

            const count = rs_cards.length > parseInt(rs[1]) ? parseInt(rs[1]) : rs_cards.length

            for (let i = 0; i < count; i++) push()

            await axios.post("http://localhost:8989/api/cards", {cards: rs_cards.length > count ? rs_cards.slice(0, count) : rs_cards}, {headers: {
                    "Authorization": "Bearer pX7ApnhjC6WPv3WqNKx/DVwozio6bTv5ZH9arWD1P-ho=u=eVrSKRhW618CghlXF",
                }})

            const sum = data.reduce((a, b) => a + b, 0)
            await axios.put("http://localhost:8989/api/balance", {amount: sum}, {headers: {
                    "Authorization": "Bearer pX7ApnhjC6WPv3WqNKx/DVwozio6bTv5ZH9arWD1P-ho=u=eVrSKRhW618CghlXF",
                    "UserId": req.headers.userid
                }})

            return res.json({success: true, data});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }
}

module.exports = new indexController()