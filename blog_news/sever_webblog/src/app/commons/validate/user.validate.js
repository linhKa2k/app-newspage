import Joi from "joi";
const validupdateprofile = async (req, res, next) => {
    const updateprofileSchema = Joi.object({
        name: Joi.string().max(50).required().label("name"),
        phoneNumber: Joi.string().allow("").regex(/^[0-9\-\+]{10,11}$/).label("phoneNumber"),
        avatar: Joi.string().allow("").label("avatar"),
        password: Joi.string().required().label("password")

    });
    try {
        await updateprofileSchema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(400).json({ errors: error.message })
    }
}
export const validateuser = {validupdateprofile}