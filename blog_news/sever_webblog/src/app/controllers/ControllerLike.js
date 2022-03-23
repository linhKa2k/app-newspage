import Like from '../models/like.js';
import Post from '../models/post.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import BaseError from '../commons/helper/BaseError.js';
import { response } from 'express';


export default {
    async likepost(req, res) {
        const { idpost } = req.params;
        const iduser = req.user._id;

        await Post.findOne({ _id: idpost, is_detroy: false, is_available: 'Active' }).then(async (datapost) => {
            const checklike = await Like.findOne({ iduser, idpost })
            if (checklike) {
                let decreaselike = datapost.likecount -1;
                Like.findOneAndDelete({iduser, idpost}).then(result => {
                    Post.findOneAndUpdate({ _id :idpost }, { likecount: decreaselike }).then(response =>{
                        return new BaseResponse({
                            statusCode: 200,
                            data: { liked: false },
                        }).return(res)
                    }).catch(error =>{
                        new BaseError({
                            statusCode: 500,
                            errors: error,
                        })
                    })
                })
            } else {
                const likeNew = new Like({
                    iduser,
                    idpost
                })
                let increaselike = datapost.likecount +1;
                likeNew.save().then(response => {
                    Post.findOneAndUpdate({ _id :idpost }, { likecount: increaselike }).then(response =>{
                        return new BaseResponse({
                            statusCode: 200,
                            data: { liked: true },
                        }).return(res)
                    }).catch(error =>{
                        new BaseError({
                            statusCode: 500,
                            errors: error,
                        })
                    })
                })
            }
        }).catch(err => {
            return new BaseResponse({
                statusCode: 400,
                data: { message: 'Bài viết không tồn tại hoặc đã bị xóa' },
            }).return(res)
        })


    },
}
