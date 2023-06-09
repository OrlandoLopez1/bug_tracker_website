const jwt = require('jsonwebtoken')
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    console.log("Initial token", authHeader)
    const token = authHeader.split(' ')[1]
    console.log('Token:', token)

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            console.log('Decoded:', decoded)
            if (err) {
                console.log('JWT verification error:', err)
                return res.status(403).json({ message: 'Forbidden' })
            }
            req.user = decoded.UserInfo.username
            req.role = decoded.UserInfo.role
            next()
        }
    )
}


module.exports = verifyJWT