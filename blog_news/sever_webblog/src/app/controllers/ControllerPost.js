import Post from "../models/post.js";
import Like from "../models/like.js";
import BaseResponse from "../commons/helper/BaseRespone.js";
import BaseError from '../commons/helper/BaseError.js'
export default {
    async creatPost(req, res) {
        try {
            const dataPost = req.body;
            const dataUser = req.user;
            let createdat = null;
            const data = new Post({
                content: dataPost.content,
                title: dataPost.title,
                description: dataPost.description,
                category: dataPost.category,
                imagepost: dataPost.imagepost,
                poster: dataUser._id,
                createAtpost : createdat
            })
            if(dataUser.role === 'censor' || dataUser.role === 'admin'){
                createdat = new Date();
                const data1 = new Post({
                    content: dataPost.content,
                    title: dataPost.title,
                    description: dataPost.description,
                    category: dataPost.category,
                    imagepost: dataPost.imagepost,
                    poster: dataUser._id,
                    is_available: 'Active',
                    createAtpost : createdat
                })
                data1.save()
                .then(response => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Tạo bài viết thành công' },
                    }).return(res)
                }).catch(err => {
                    new BaseError({
                        statusCode: 400,
                        errors: err,
                    })
                });
            }else{
                data.save()
                .then(response => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Để tránh các bài viết có nội dung spam, không lành mạnh trên Page. Nên Bài viết của bạn đã được chuyển đến Cộng tác viên. Vui lòng chờ duyệt...' },
                    }).return(res)
                }).catch(err => {
                    new BaseError({
                        statusCode: 400,
                        errors: err,
                    })
                });
            }
        } catch (error) {
            console.log(error)
            new BaseError({
                statusCode: 500,
                errors: error,
            })
        }
    },


    async updatePost(req, res) {
        const idPost = req.query.idpost;
        const idUser = req.user._id;
        const role = req.user.role;
        const {contentnew,titlenew, descriptionnew, idcategorynew, avatarpostnew} = req.body;
        console.log(req.user)
        await Post.findById(idPost).exec()
            .then((dataPost) => {
                if (dataPost.poster.toString() === idUser.toString()) {
                    if(role === 'censor'){
                        Post.findByIdAndUpdate(idPost, { content: contentnew, title: titlenew , description: descriptionnew, category:idcategorynew, imagepost: avatarpostnew , updateAt: new Date()})
                        .then(respone => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'Cập nhật bài viết thành công' },
                            }).return(res)
                        }).catch(err => {
                            new BaseError({
                                statusCode: 500,
                                errors: err,
                            })
                        })
                    }else{
                        Post.findByIdAndUpdate(idPost, { content: contentnew, title: titlenew , description: descriptionnew, category:idcategorynew, imagepost: avatarpostnew ,is_available: 'Pending', is_detroy: false, censor: null,  updateAt: new Date(), createdAt: new Date() })
                        .then(respone => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'Cập nhật bài viết thành công, Bài viết của bạn đã được chuyển cho Cộng tác viên, Vui lòng chờ duyệt...' },
                            }).return(res)
                        }).catch(err => {
                            new BaseError({
                                statusCode: 500,
                                errors: err,
                            })
                        })
                    }
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Bạn không có quyền sửa bài viết của người khác' },
                    }).return(res)
                }
            }).catch(err => {
                new BaseError({
                    statusCode: 500,
                    errors: err,
                })
            })

    },
    async uploadImg(req, res) {
        try {
                return new BaseResponse({ 
                    statusCode: 200,
                     data: { message: 'success', urlimagepost: `http://localhost:3800/imagepost/${req.file.filename}` }, 
                }).return(res);
        } catch (error) {
            new BaseError({
                statusCode: 400,
                errors: error,
            })
        }
    },

    async deletePost(req, res) {
        const idPost = req.query.idpost;
        Post.findByIdAndUpdate(idPost, { is_detroy: true })
            .then((respone) => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã xóa bài viết' },
                }).return(res)
            }).catch((err) => {
                new BaseError({
                    statusCode: 400,
                    errors: err,
                })
            })
    },
    
    async restorePost(req, res) {
        const idPost = req.query.idpost;
        Post.findByIdAndUpdate(idPost, { is_detroy: false })
            .then((respone) => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Khôi phục bài viết thành công' },
                }).return(res)
            }).catch((err) => {
                new BaseError({
                    statusCode: 400,
                    errors: err,
                })
            })
    }

}
