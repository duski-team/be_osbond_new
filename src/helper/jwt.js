import jwt from 'jsonwebtoken'
const salt = process.env.SALT

export function generateToken(payload) {
    return jwt.sign(payload, salt)
}

export function verifyToken(token) {
    return jwt.verify(token, salt)
}

