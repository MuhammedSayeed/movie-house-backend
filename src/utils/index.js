import jwt from 'jsonwebtoken'
import {AppError} from "./AppError.js"
const sendError = (next, message, statusCode) => {
    return next(new AppError(message, statusCode))
}

const generateToken = (payload, time) => {
    if (time) {
        return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: `${time}m` });
    }
    return jwt.sign(payload, process.env.JWT_KEY);
}

const getUserInfo = (user) => {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage : user.profileImage,
        authType : user.authType
    }
}
const sendUserResponse = (res, userInfo, token, statusCode = 200) => {
    res.status(statusCode).json({
        message: 'Success',
        user: userInfo,
        token: token
    })
}

export {
    sendError,
    generateToken,
    getUserInfo,
    sendUserResponse
}