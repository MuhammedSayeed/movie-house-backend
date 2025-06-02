import { UserModel } from "../../../databases/models/user.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js"
import { generateToken, getUserInfo, sendError } from "../../utils/index.js"
import bcrypt from 'bcrypt'
import axios from 'axios';
import jwt from 'jsonwebtoken';

const signup = catchAsyncError(
    async (req, res, next) => {
        const { name, email, password } = req.body;
        // CHECK IF EMAIL IS EXIST BEFORE
        let user = await UserModel.findOne({ email });
        if (user) return sendError(next, 'account already exist', 401);
        // HASHING PASSWORD
        const hashedPassword = bcrypt.hashSync(password, Number(process.env.ROUND));
        // CREATE NEW USER
        user = new UserModel({ name, email, password: hashedPassword });
        await user.save();
        // GENERATE TOKEN 
        const userInfo = getUserInfo(user);
        const token = generateToken(userInfo);
        res.status(201).json({ message: "success", user: userInfo, token })
    }
)
const signIn = catchAsyncError(
    async (req, res, next) => {
        const { email, password } = req.body;
        // CHECK IF EMAIL IS EXIST
        let user = await UserModel.findOne({ email, authType: "normal" });
        if (!user) return sendError(next, 'invalid email or password', 404);
        // CHECK IF PASSWORD IS CORRECT
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return sendError(next, 'invalid email or password', 401);
        // GENERATE TOKEN
        const userInfo = getUserInfo(user);
        const token = generateToken(userInfo);
        // SEND RESPONSE
        res.status(200).json({ message: "success", user: userInfo, token })
    }
)

const authWithGoogle = catchAsyncError(
    async (req, res, next) => {
        const { googleToken } = req.body;
        const userData = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${googleToken}`
            }
        })
        const { data } = userData;
        let user = await UserModel.findOne({ email: data.email, authType: "google" });
        if (!user) {
            user = new UserModel({
                name: data.name,
                email: data.email,
                profileImage: data.picture,
                authType: "google"
            });
            await user.save();
        }
        // GENERATE TOKEN
        const userInfo = getUserInfo(user);
        const token = generateToken(userInfo);
        // SEND RESPONSE
        res.json({ message: "success", user: userInfo , token })
    }
)
const verifyToken = catchAsyncError(
    async (req, res, next) => {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return sendError(next, 'Not authorized', 401);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
        next();
    }
)
const updateName = catchAsyncError(
    async (req, res, next) => {
        const { name, password, authType } = req.body;

        // check if user is existing
        const user = await UserModel.findOne({ email: req.user.email });
        if (!user) return sendError(next, 'User not found', 404);

        // If authType is normal, validate the password
        if (authType === "normal") {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return sendError(next, 'Invalid password', 401);
        }
        // Save changes
        user.name = name;
        await user.save();

        // Return updated user info
        const userInfo = getUserInfo(user);
        const token = generateToken(userInfo);

        res.status(200).json({ message: 'Success', user: userInfo, token });

    }
)
const updateEmail = catchAsyncError(
    async (req, res, next) => {
        const { email, password } = req.body;

        // check if user is existing
        const user = await UserModel.findOne({ _id: req.user._id, authType: "normal" });
        if (!user) return sendError(next, 'User not found', 404);

        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return sendError(next, 'Invalid password', 401);

        // check if email is existing
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return sendError(next, 'Email already exists', 401);

        // Save changes
        user.email = email;
        await user.save();
        // Return updated user info
        const userInfo = getUserInfo(user);
        const token = generateToken(userInfo);

        res.status(200).json({ message: 'Success', user: userInfo, token });
    }
)
const updatePassword = catchAsyncError(
    async (req, res, next) => {
        const { password, newpassword } = req.body;

        // check if user is existing
        const user = await UserModel.findOne({ _id: req.user._id, authType: "normal" });
        if (!user) return sendError(next, 'User not found', 404);

        // check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return sendError(next, 'Invalid password', 401);

        // Hashing new password
        const hashedPassword = bcrypt.hashSync(newpassword, Number(process.env.ROUND));
        // Save changes
        user.password = hashedPassword;
        await user.save();
        // Return updated user info
        const userInfo = getUserInfo(user);
        const token = generateToken(userInfo);

        res.status(200).json({ message: 'Success', user: userInfo, token });
    }
)


export {
    signup,
    authWithGoogle,
    signIn,
    verifyToken,
    updateName,
    updateEmail,
    updatePassword
}