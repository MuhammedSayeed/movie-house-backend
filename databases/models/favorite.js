import mongoose from 'mongoose';
const { Schema } = mongoose;

const listItemSchema = new Schema({
    id: {
        type: Number,
    },
    title: {
        type: String,
    },
    poster_path: {
        type: String,
    },
    overview: {
        type: String,
    },
    release_date: {
        type: String,
    },
    media_type: {
        type: String,
    },
    vote_average: {
        type: Number,
    },
}, {
    _id: false, // Prevents creating a separate `_id` for each list item
});


const favoriteSchema = new Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    list : [listItemSchema]
    
}, {
    timestamps: true,
});

export const FavoriteModel = mongoose.model('Favorite', favoriteSchema);