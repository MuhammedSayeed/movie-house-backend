import Joi from "joi";

// Reusable Schemas
const name = Joi.string().min(2).max(26).messages({
    'string.base': 'Name must be a string.',
    'string.min': 'Name must be at least 2 characters long.',
    'string.max': 'Name must be at most 26 characters long.',
});
const email = Joi.string().email().messages({
    'string.email': 'Invalid email format. Please enter a valid email address.',
});
const password = Joi.string().min(6).max(32).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).messages({
    'string.min': 'Password must be at least {#limit} characters long.',
    'string.max': 'Password cannot be longer than {#limit} characters.',
    'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one digit.',
});

const signupSchema = Joi.object({
    name: name.required().messages({ 'any.required': 'Name is required.' }),
    email: email.required().messages({ 'any.required': 'Email is required.' }),
    password: password.required().messages({ 'any.required': 'Password is required.' }),
})

const signInSchema = Joi.object({
    email: email.required().messages({ 'any.required': 'Email is required.' }),
    password: password.required().messages({ 'any.required': 'Password is required.' }),
})

const updateNameSchema = Joi.object({
    name: name.required().messages({ 'any.required': 'Name is required.' }),
    password: password.when('authType', {
        is: "normal",
        then: Joi.required().messages({ 'any.required': 'Password is required.' }),
        otherwise: Joi.optional(),
    }),
    authType: Joi.string().valid('normal', 'google').required().messages({ 'any.required': 'Auth type is required.', 'any.only': 'Auth type must be either normal or google.' })
})

const updateEmailSchema = Joi.object({
    email: email.required().messages({ 'any.required': 'Email is required.' }),
    password: password.required().messages({ 'any.required': 'Password is required.' }),
})

const updatePasswordSchema = Joi.object({
    password: password.required().messages({ 'any.required': 'Password is required.' }),
    newpassword: password.required().messages({ 'any.required': 'New password is required.' }),
})
export {
    signupSchema,
    signInSchema,
    updateNameSchema,
    updateEmailSchema,
    updatePasswordSchema
}