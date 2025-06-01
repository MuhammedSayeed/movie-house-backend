import { UserModel } from "../../../databases/models/user.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js"
import { generateToken, getUserInfo, sendError } from "../../utils/index.js"
import bcrypt from 'bcrypt'
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { FavoriteModel } from "../../../databases/models/favorite.js";

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
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie will last for 7 days
        });
        res.status(201).json({ message: "success", user: userInfo })
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
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie will last for 7 days
        });
        res.status(200).json({ message: "success", user: userInfo })
    }
)
const logout = catchAsyncError(
    async (req, res, next) => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false
        });
        res.status(200).json({ message: "success" })
    }
)

// const signupWithGoogle = catchAsyncError(
//     async (req, res, next) => {
//         const { googleToken } = req.body;
//         const userData = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//             headers: {
//                 Authorization: `Bearer ${googleToken}`
//             }
//         })
//         const { data } = userData;
//         let user = await UserModel.findOne({ email: data.email });
//         if (user) sendError(next, "account already exist", 401)

//         user = new UserModel({
//             name: data.name,
//             email: data.email,
//             profileImage: data.picture,
//             authType: "google"
//         });
//         await user.save();

//         // GENERATE TOKEN
//         const userInfo = getUserInfo(user);
//         const token = generateToken(userInfo);

//         // SEND RESPONSE
//         res.cookie('token', token, { httpOnly: true, secure: false });
//         res.json({ message: "success", user: userInfo })
//     }
// )

// const signInWithGoogle = catchAsyncError(
//     async (req, res, next) => {
//         const { googleToken } = req.body;
//         const userData = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//             headers: {
//                 Authorization: `Bearer ${googleToken}`
//             }
//         })
//         const { data } = userData;
//         let user = await UserModel.findOne({ email: data.email , authType : "google" });
//         if (!user) sendError(next, "account not found", 401)

//         // GENERATE TOKEN
//         const userInfo = getUserInfo(user);
//         const token = generateToken(userInfo);

//         // SEND RESPONSE
//         res.cookie('token', token, { httpOnly: true, secure: false });
//         res.json({ message: "success", user: userInfo })
//     }
// )

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
        res.cookie('token', token, { httpOnly: true, secure: false });
        res.json({ message: "success", user: userInfo })
    }
)
const verifyToken = catchAsyncError(
    async (req, res, next) => {
        const token = req.cookies.token;
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

        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ message: 'Success', user: userInfo });

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
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ message: 'Success', user: userInfo });
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
        res.cookie('token', token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        res.status(200).json({ message: 'Success', user: userInfo });
    }
)
const deleteUser = catchAsyncError(
    async (req, res, next) => {
        const userId = req.user._id;
        // check if user is existing
        const user = await UserModel.findOneAndDelete({ _id: userId });
        if (!user) return sendError(next, 'User not found', 404);

        // Remove user's favorite list if exists
        const list = await FavoriteModel.findOne({ user: userId });
        if (list) await list.remove();

        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
        });
        res.status(204).json({ message: 'User deleted successfully' });
    }
)

export {
    signup,
    authWithGoogle,
    signIn,
    logout,
    verifyToken,
    updateName,
    updateEmail,
    updatePassword,
    deleteUser
}