import User from '../models/user.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import BaseError from '../commons/helper/BaseError.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Post from '../models/post.js';
dotenv.config();

const bcryptSalt = 10;

export default {

    async changePassword(req, res) {
        const pass = req.body;
        const idUser = req.user._id;
        await User.findOne({ _id: idUser }, (error, data) => {
            bcrypt.compare(pass.password, data.password, async (err, result) => {
                if (result) {
                    const salt = bcrypt.genSaltSync(bcryptSalt);
                    const hashPass = bcrypt.hashSync(pass.newpassword, salt);
                    const chagepass = await User.updateOne({ _id: idUser }, { password: hashPass });
                    if (chagepass) {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'Đổi mật khẩu thành công' },
                        }).return(res)
                    } else {
                        new BaseError({
                            statusCode: 400,
                            error: err,
                        })
                    }
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Mật khẩu không chính xác' },
                    }).return(res);
                }
            })
        }).clone()
    },

    async getpostbyuser(req, res) {
        try {
            const idUser = req.user._id;
            const page = req.params.page;
            await Post.find({ poster: idUser, is_available: 'Active', is_detroy: false })
                .limit(6).sort({ 'createAtpost': -1 })
                .skip(6 * (Number(page) - 1))
                .then(response => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { data: response },
                    }).return(res);
                })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        }
    },

    async getProfile(req, res) {
        const idUser = req.user._id;
        await User.findOne({ _id: idUser }, { password: 0 }).then(data => {
            if (data !== null) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'success', results: data },
                }).return(res)
            }
            else {
                new BaseError({
                    statusCode: 400,
                    error: err,
                })
            }
        })
    },
    async uploadImgUser(req, res, next) {
        try {
            const path = `http://localhost:3800/imageuser/${req.file.filename}`;
            return new BaseResponse({ statusCode: 200, data: { urlimageuser: path } }).return(res);
        } catch (error) {
            next(error)
        }
    },

    async readingnoti(req, res) {
        const idNoti = req.params.idnoti;
        User.findOneAndUpdate({ 'notification._id': idNoti }, { $set: { "notification.$.is_reading": true } }, { new: true }).then(response => {
            return new BaseResponse({
                statusCode: 200,
                data: { message: 'readed', payload: response.notification },
            }).return(res)
        }).catch(err => {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        })
    },
    async updateProfile(req, res) {
        const dataReqUser = req.body;
        const idUser = req.user._id;
        await User.findOne({ _id: idUser }, async (error, data) => {
            bcrypt.compare(dataReqUser.password, data.password, async (err, result) => {
                if (result) {
                    const changeProfile = await User.updateOne({ _id: idUser },
                        {
                            name: dataReqUser.name,
                            phoneNumber: dataReqUser.phoneNumber,
                            avatar: dataReqUser.avatar,
                            updateAcountAt: new Date()
                        });
                    if (changeProfile) {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'Cập nhật trang cá nhân thành công' },
                        }).return(res)
                    } else {
                        new BaseError({
                            statusCode: 400,
                            error: err,
                        })
                    }
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Mật khẩu không chính xác' },
                    }).return(res);
                }

            })
        }).clone()
    },

    async getPostpendingbyuser(req, res) {
        try {
            const iduser = req.user._id;
            await Post.find({ poster: iduser, is_available: 'Pending' }).sort({ 'createdAt': -1 })
                .then(response => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { data: response },
                    }).return(res);
                })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        }

    },

    async deletepostunapprove(req, res) {
        const idpost = req.params.idpost;
        try {
            Post.findOne({ _id: idpost }).then(result => {
                if (result.is_available === 'Pending' && result.is_detroy === false) {
                    Post.findOneAndDelete({ _id: idpost }).then(response => {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'Đã hủy yêu cầu duyệt bài' },
                        }).return(res)
                    })
                }else if(result.is_available === 'Pending'&& result.is_detroy === true ){
                    Post.findOneAndDelete({ _id: idpost }).then(response => {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'Đã xóa bài viết' },
                        }).return(res)
                    })
                }
                else{
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Có lỗi xảy ra' },
                    }).return(res)
                }
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },

    async updatetpostpending(req, res){
        try {
            const idpost = req.body.idpost;
            await Post.findByIdAndUpdate(idpost, { is_detroy: true }).then(result => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'ok' },
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

