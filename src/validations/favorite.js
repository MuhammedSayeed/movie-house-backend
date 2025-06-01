import Joi from "joi";

const id = Joi.number().messages({
    "number.base": "Invalid id. It must be a number."
})

const addToFavoritesSchema = Joi.object({
    id : id.required().messages({
        "any.required": "id is required"
    }),
    title : Joi.string().required().messages({
        "string.base": "Invalid title. It must be a string.",
        "string.empty": "Title is required"
    }),
    overview : Joi.string().required().messages({
        "string.base": "Invalid overview. It must be a string.",
        "string.empty": "Overview is required"
    }),
    poster_path : Joi.string().required().messages({
        "string.base": "Invalid poster_path. It must be a string.",
        "string.empty": "Poster_path is required"
    }),
    release_date : Joi.string().required().messages({
        "string.base": "Invalid release_date. It must be a string.",
        "string.empty": "Release_date is required"
    }),
    vote_average : Joi.string().required().messages({
        "string.base": "Invalid vote_average. It must be a string.",
        "string.empty": "Vote_average is required"
    }),
    media_type : Joi.string().required().messages({
        "string.base": "Invalid media_type. It must be a string.",
        "string.empty": "Media_type is required"
    })
})

const removeFromFavoritesSchema = Joi.object({
    id : id.required().messages({
        "any.required": "id is required"
    })
})

export {
    addToFavoritesSchema,
    removeFromFavoritesSchema
}