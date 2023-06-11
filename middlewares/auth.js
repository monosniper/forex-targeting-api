const UserModel = require('../models/user-model')

const API_TOKEN = "pX7ApnhjC6WPv3WqNKx/DVwozio6bTv5ZH9arWD1P-ho=u=eVrSKRhW618CghlXF"

async function authMiddleware(req, res, next) {
    const token = req.headers.authorization
    const match = token?.split(' ')[1] === API_TOKEN

    const _id = req.headers.userid

    if(_id) {
        req.user = await UserModel.findOne({_id})
    }

    if(!token || !match) {
        res.status(401).send({success: false, error: 'Not auth'})
    } else next()
}

module.exports = authMiddleware