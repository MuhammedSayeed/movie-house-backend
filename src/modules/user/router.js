import express from 'express';
import * as controller from "./controller.js"
import { validation } from '../../middlewares/validation.js';
import { signInSchema, signupSchema, updateEmailSchema, updateNameSchema, updatePasswordSchema } from '../../validations/user.js';

const router = express.Router();


router.post('/signup', validation(signupSchema), controller.signup)
router.post('/signin', validation(signInSchema), controller.signIn)
router.patch('/name', controller.verifyToken, validation(updateNameSchema), controller.updateName)
router.patch('/email', controller.verifyToken, validation(updateEmailSchema), controller.updateEmail)
router.patch('/password', controller.verifyToken, validation(updatePasswordSchema), controller.updatePassword)
router.post('/google', controller.authWithGoogle)


export default router;