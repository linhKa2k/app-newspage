import Joi from "joi";
const validpost = async (req, res, next) => {
    const postSchema = Joi.object({
        content: Joi.string().max(20000).required(),
        title: Joi.string().max(150).required(),
        description: Joi.string().max(350).required(),
        category: Joi.required(),
        imagepost: Joi.string(),
        
    });
    try {
        await postSchema.validateAsync(req.body, { abortEarly: false })
        next()
    } catch (error) {
        res.status(400).json({ errors: error.message })
    }
}
export const validatePost = {validpost}