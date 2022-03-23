import BaseError from '../commons/helper/BaseError.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import Post from '../models/post.js';
import User from '../models/user.js'
import { io } from '../../../index.js';

export default {
    // lấy danh sách bài viết chưa được duyệt
    async getPostPending(req, res) {
        const idcategory = req.query.idcategory;
        const obj = {
            updateAt: 0,
            is_detroy: 0,
        }
        try {
        if(idcategory === ''){
            Post.find({ is_available: "Pending" ,is_detroy: false}, obj).populate('poster', 'name').populate('category', 'namecategory').sort({ 'createdAt': -1 }).exec(function (err, respone) {
                if (respone !== null) {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: "success", data: respone },
                    }).return(res)
                }
                else {
                    return new BaseError({
                        statusCode: 400,
                        errors: err,
                    })
                }
            });
        }else{
            Post.find({ is_available: "Pending", category: idcategory, is_detroy: false}, obj).populate('poster', 'name').populate('category', 'namecategory').exec(function (err, respone) {
                if(respone === undefined){
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: "success", data: [] },
                    }).return(res)
                }
                if (respone !== null) {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: "success", data: respone },
                    }).return(res)
                }
                else {
                    return new BaseError({
                        statusCode: 400,
                        errors: err,
                    })
                }
            });
        }
            
        } catch (error) {
            return new BaseError({
                statusCode: 400,
                errors: error,
            })
        }
    },

    // duyệt bài viết
    async approvePost(req, res) {
        const idpost = req.query.idpost;
        const idcencor = req.user._id;
        await Post.findById(idpost).exec()
            .then((datapost) => {
                if (datapost.censor === null) {
                    Post.findByIdAndUpdate(idpost, { censor: idcencor, is_available: "Active" , createAtpost: new Date() })
                    .then(respone => {
                        const objnotifi = { message: `Cộng tác viên đã phê duyệt bài viết của bạn` ,is_reading: false, idpost: idpost, image: datapost.imagepost , time: new Date() }
                        User.findOneAndUpdate({_id: datapost.poster.toString()}, { $push: {notification: { $each: [objnotifi], $position: 0  } }},{ new: true }).then(resp =>{
                            io.sockets.in(`${datapost.poster.toString()}`).emit('new_msg', {msg: resp.notification});
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'Đã duyệt bài viết' },
                            }).return(res)
                        })
                    }).catch(err => {
                        new BaseError({
                            statusCode: 400,
                            errors: err,
                        })
                    })
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Bài viết không tồn tại hoặc đã được cộng tác viên khác xử lý' },
                    }).return(res)
                }
            }).catch(err => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Bài viết không tồn tại' },
                }).return(res)
            })
    },

    async unapprovePost(req, res) {
        const idpost = req.query.idpost;
        const idcencor = req.user._id;
        const message = req.body.msg;
        const datapost =  await Post.findById(idpost).exec();
            if(datapost){
                if (datapost.censor === null) {
                    Post.findByIdAndUpdate(idpost, { censor: idcencor, is_available: "Pending" , is_detroy: true })
                    .then(respone => {
                        const objnotifi = { message: `Bài viết của bạn bị từ chối bởi Cộng tác viên vì lý do ${message}` , is_reading: false, idpost: '', image: 'https://huflit.edu.vn/uploads/news/2021_06/thong_bao.jpg' , time: new Date() }
                        User.findOneAndUpdate({_id: datapost.poster.toString()}, { $push: {notification: { $each: [objnotifi], $position: 0  } }},{ new: true }).then(resp =>{
                            io.sockets.in(`${datapost.poster.toString()}`).emit('new_msg', {msg: resp.notification});
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'Đã hủy yêu cầu đăng bài bài viết' },
                            }).return(res)
                        })
                    }).catch(err => {
                        new BaseError({
                            statusCode: 400,
                            errors: err,
                        })
                    })
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Bài viết không tồn tại hoặc đã được cộng tác viên khác xử lý' },
                    }).return(res)
                }
            }else{
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Bài viết không tồn tại' },
                }).return(res)
            }
    },
}