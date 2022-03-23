import BaseError from '../commons/helper/BaseError.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import { io } from '../../../index.js';
import Post from '../models/post.js';

export default {
    async getListUser(req, res) {
        try {
            const filter = req.query.filter;
            const nameUser = req.query.nameuser;
            const obj = {
                notification: 0,
                validateCode: 0,
                password: 0,
            }
            switch (filter) {
                case '':
                    await User.find({ 'chucvu': { $ne: 'Admin' }, name: { $regex: nameUser }, status: 'Active', is_available: true }, obj)
                        .then((results) => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { datauser: results },
                            }).return(res)
                        })
                    break;
                case 'censor':
                    await User.find({ role: filter, status: 'Active', name: { $regex: nameUser }, is_available: true }, obj)
                        .then((results) => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { datauser: results },
                            }).return(res)
                        })
                    break;
                case 'user':
                    await User.find({ chucvu: filter, status: 'Active', name: { $regex: nameUser }, is_available: true }, obj)
                        .then((results) => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { datauser: results },
                            }).return(res)
                        })
                    break;
                case 'false':
                    await User.find({ is_available: false, name: { $regex: nameUser } }, obj)
                        .then((results) => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { datauser: results },
                            }).return(res)
                        })
                    break;
                case 'Pending':
                    await User.find({ status: 'Pending', name: { $regex: nameUser }, is_available: true }, obj)
                        .then((results) => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { datauser: results },
                            }).return(res)
                        })
                    break;
                default:
                    await User.find({ 'chucvu': { $ne: 'Admin' }, status: 'Active', is_available: true }, obj)
                        .then((results) => {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { datauser: results },
                            }).return(res)
                        })
            }
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },
    async deleteUser(req, res) {
        const idUser = req.params.id;
        await User.findOneAndUpdate({ _id: idUser }, { is_available: false }).then(respone => {
            io.sockets.in(`${idUser}`).emit('lock_account', {msg: "lockaccount"});
            return new BaseResponse({
                statusCode: 200,
                data: { message: "Đã Khóa tài khoản" },
            }).return(res)
        }).catch(err => {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        })

    },

    async unlockaccount(req, res) {
        const idUser = req.params.id;
        await User.findOneAndUpdate({ _id: idUser }, { is_available: true }).then(respone => {
            return new BaseResponse({
                statusCode: 200,
                data: { message: "Đã mở khóa tài khoản" },
            }).return(res)
        }).catch(err => {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        })

    },

    async unlockaccount(req, res) {
        const idUser = req.params.id;
        await User.findOneAndUpdate({ _id: idUser }, { is_available: true }).then(respone => {

            return new BaseResponse({
                statusCode: 200,
                data: { message: "Đã mở khóa tài khoản" },
            }).return(res)
        }).catch(err => {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        })

    },

    async accountVerification(req, res) {
        const iduser = req.params.iduser;
        await User.findOneAndUpdate({ _id: iduser }, { status: 'Active', createAcountAt: new Date(), validateCode: '' }).then(respone => {
            return new BaseResponse({
                statusCode: 200,
                data: { message: "Đã xác thực tài khoản" },
            }).return(res)
        }).catch(err => {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        })
    },
    async addcensor(req, res) {
        const iduser = req.params.iduser;
        const result = await User.find({ role: 'censor', chucvu: "Cộng tác viên" })
        if (result.length === 5) {
            return new BaseResponse({
                statusCode: 200,
                data: { message: "Chỉ được thêm tối đa 5 Cộng tác viên !" },
            }).return(res)
        }
        else {
            const objnotifi = { message: `Admin đã phong bạn làm Cộng tác viên của trang` ,is_reading: false, idpost: "", image: "https://huflit.edu.vn/uploads/news/2021_06/thong_bao.jpg" , time: new Date() }
            await User.findOneAndUpdate({ _id: iduser }, { role: 'censor', chucvu: "Cộng tác viên", $push: {notification: { $each: [objnotifi], $position: 0  } } }, { new: true }).then(result => {
                io.sockets.in(`${iduser}`).emit('new_msg', {msg: objnotifi});
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã thêm cộng tác viên', result },
                }).return(res)
            }).catch(err => {
                new BaseError({
                    statusCode: 500,
                    error: err,
                })
            })
        }
    },

    async removeCensor(req, res) {
        const iduser = req.params.iduser;
        try {
            await User.findOneAndUpdate({ _id: iduser }, { role: 'user', chucvu: "user" }, { new: true }).then(result => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã hủy chức cộng tác viên của người dùng này', result },
                }).return(res)
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },

    async removeAccount(req, res) {
        const iduser = req.params.iduser;
        try {
            User.findOneAndDelete({ _id: iduser }).then(response => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã xóa tài khoản' },
                }).return(res)
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },

    async findUsersByName(req, res) {
        const nameUser = req.query.nameuser;
        await User.find({ name: { $regex: nameUser } }, { password: 0 }, function (err, data) {
            if (err) {
                new BaseError({
                    statusCode: 500,
                    error: err,
                })
            }
            else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "sucsess", data },
                }).return(res)
            }
        });
    },
    async findUsersByEmail(req, res) {
        const email = req.query.email;
        await User.find({ email: { $regex: email } }, { password: 0 }, function (err, data) {
            if (err) {
                new BaseError({
                    statusCode: 500,
                    error: err,
                })
            }
            else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "sucsess", data },
                }).return(res)
            }
        });
    },

    async getcategory(req, res) {
        const isavalible = req.params.isavalible;
        await Category.find({is_available: isavalible}).sort({ 'createdAt': -1 }).then(respone => {
            return new BaseResponse({
                statusCode: 200,
                data: { listcategory: respone },
            }).return(res)
        }).catch(err => {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        })
    },

    async addCategory(req, res) {
        const nameCategory = req.query.nameCategory;
        const data = await Category.findOne({ namecategory: { $regex: new RegExp(nameCategory, "i") } });
        if (data) {
            return new BaseResponse({
                statusCode: 200,
                data: { message: 'Thể loại này đã tồn tại' },
            }).return(res)
        } else {
            const newCategory = new Category({
                namecategory: nameCategory,
            })
            newCategory
                .save()
                .then(response => {
                    console.log(response)
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Thêm thể loại thành công !', categorynew: response },
                    }).return(res)
                }).catch(err => {
                    new BaseError({
                        statusCode: 500,
                        error: err,
                    })
                });
        }
    },


    async updateCategory(req, res) {
        try {
            const nameCategory = req.params.nameCategory;
            const id = req.params.idcategory;
            const data = await Category.findOne({ namecategory: nameCategory });
            if (data) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Thể loại này đã tồn tại' },
                }).return(res)
            } else {
                await Category.findOneAndUpdate({ _id: id }, { namecategory: nameCategory }, { new: true }).then(result => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Cập nhật thể loại thành công', result },
                    }).return(res)
                })
            }
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        }
    },

    async lockCategory(req, res) {
        try {
            const idcategory = req.params.idcategory;
            await Category.findOneAndUpdate({ _id: idcategory }, { is_available: false } , { new: true }).then(result => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã thêm thể loại vào danh sách hạn chế' },
                }).return(res)
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        }
    },

    async unlockCategory(req, res) {
        try {
            const idcategory = req.params.idcategory;
            await Category.findOneAndUpdate({ _id: idcategory }, { is_available: true } , { new: true }).then(result => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã xóa thể loại khỏi danh sách hạn chế' },
                }).return(res)
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },

    async getpostbyfillter(req, res) {
        try{
            const sort = req.query.s;
            const idcategory = req.query.idcategory;
            const search = req.query.search;
            const page = req.params.page;
            if(idcategory === ''){
                await Post.find({title: new RegExp(search, "i"), is_detroy: false,is_available: 'Active'})
                .populate('poster', 'name')
                .populate('category', 'namecategory')
                .populate('censor', 'name')
                .limit(6)
                .skip(6 * (Number(page) - 1))
                .sort({"createAtpost": sort})
                .then(respone => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: {data: respone },
                    }).return(res)
                })
            }else{
                await Post.find({category: idcategory, title: new RegExp(search, "i"), is_detroy: false,is_available: 'Active'})
                .populate('poster', 'name')
                .populate('category', 'namecategory')
                .skip(6 * (Number(page) - 1))
                .limit(6)
                .sort({"createAtpost": sort})
                .then(respone => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: {data: respone },
                    }).return(res)
                })
            }
        }catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
       
    },

    async getpostdeletedbyfillter(req, res) {
        try{
            const sort = req.query.s;
            const idcategory = req.query.idcategory;
            const search = req.query.search;
            const page = req.params.page;
            if(idcategory === ''){
                await Post.find({title: new RegExp(search, "i"), is_detroy: true ,is_available: 'Active'})
                .populate('poster', 'name')
                .populate('category', 'namecategory')
                .populate('censor', 'name')
                .limit(6)
                .skip(6 * (Number(page) - 1))
                .sort({"createAtpost": sort})
                .then(respone => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: {data: respone },
                    }).return(res)
                })
            }else{
                await Post.find({category: idcategory, title: new RegExp(search, "i"), is_detroy: true,is_available: 'Active'})
                .populate('poster', 'name')
                .populate('category', 'namecategory')
                .skip(6 * (Number(page) - 1))
                .limit(6)
                .sort({"createAtpost": sort})
                .then(respone => {
                    return new BaseResponse({
                        statusCode: 200,
                        data: {data: respone },
                    }).return(res)
                })
            }
        }catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
       
    }







}
