import { FavoriteModel } from "../../../databases/models/favorite.js";
import { catchAsyncError } from "../../middlewares/catchAsyncError.js";




const addToList = catchAsyncError(
    async (req, res, next) => {
        const show = req.body;

        let favoriteList = await FavoriteModel.findOne({ user: req.user._id });
        if (!favoriteList) {
            favoriteList = new FavoriteModel({ user: req.user._id });
        }
        favoriteList.list.push(show);
        await favoriteList.save();
        res.status(200).json({ message: "success", results: favoriteList.list })
    }
)

const removeFromList = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.body;
        const userId = req.user._id;
        const result = await FavoriteModel.findOneAndUpdate(
            { user: userId },
            {
                $pull: {
                    list: { id: id }
                }
            },
            { new: true }
        );

        console.log(result);


        res.status(200).json({ message: "success", results: result.list })
    }
)

const getList = catchAsyncError(
    async (req, res, next) => {
        const favoriteList = await FavoriteModel.findOne({ user: req.user._id });
        res.status(200).json({ message: "success", results: favoriteList ? favoriteList.list : [] })
    }
)


export {
    addToList,
    getList,
    removeFromList
}