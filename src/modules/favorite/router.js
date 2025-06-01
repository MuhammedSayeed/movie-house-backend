import express from 'express';
import * as controller from "./controller.js"
import { verifyToken } from '../user/controller.js';
import { validation } from '../../middlewares/validation.js';
import { addToFavoritesSchema, removeFromFavoritesSchema } from '../../validations/favorite.js';

const router = express.Router();

router.get("/", verifyToken, controller.getList)
router.post("/", verifyToken, validation(addToFavoritesSchema), controller.addToList)
router.patch("/", verifyToken, validation(removeFromFavoritesSchema), controller.removeFromList)


export default router;