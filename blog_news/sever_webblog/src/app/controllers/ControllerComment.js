import BaseError from '../commons/helper/BaseError.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import Comment from '../models/comment.js';
import { io } from '../../../index.js';
import Post from '../models/post.js';

export default {
    async createComment(req, res) {
        try {
            const { id_post, content } = req.body;
            const newCmt = Comment({
                user: req.user._id,
                id_post,
                content
            });
            const checkpost = await Post.findOne({ _id: id_post })
            if (checkpost) {
                const objUser = { _id: req.user._id.toString(), name: req.user.name, avatar: req.user.avatar, chucvu: req.user.chucvu }
                const data = { _id: newCmt._id.toString(), user: objUser, id_post, content, createdAt: new Date(), updatedAt: new Date() }
                io.to(`${id_post}`).emit('createComment', data)
                await newCmt.save()
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "Đã Bình luận bài viết" },
                }).return(res)
            } else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "Bài viết không tồn tại hoặc đã bị xóa" },
                }).return(res)
            }

        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },
    async getComment(req, res) {
        try {
            const { id, limit } = req.params;
            let pageNumber = req.params.page;
            pageNumber = pageNumber - 1;
            const count = await Comment.count({ id_post: id });
            await Comment.find({ id_post: id })
                .sort({ 'createdAt': -1 })
                .limit(Number(limit))
                .skip(Number(limit) * Number(pageNumber))
                .populate('user', "_id name chucvu avatar")
                .then(listcomments => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { listcomments, count },
                    }).return(res)
                }).catch(err => {
                    return new BaseResponse({
                        statusCode: 400,
                        data: { message: "không tồn tại" },
                    }).return(res)
                })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    }
}