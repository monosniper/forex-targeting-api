const API_TOKEN = "pX7ApnhjC6WPv3WqNKx/DVwozio6bTv5ZH9arWD1P-ho=u=eVrSKRhW618CghlXF"

function authMiddleware(req, res, next) {
    const token = req.headers.authorization
    const match = token?.split(' ')[1] === API_TOKEN

    if(!token || !match) {
        res.status(401).send({success: false, error: 'Not auth'})
    } else next()
}

module.exports = authMiddleware