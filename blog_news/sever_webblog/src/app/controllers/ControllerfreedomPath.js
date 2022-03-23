import BaseError from '../commons/helper/BaseError.js';
import BaseResponse from '../commons/helper/BaseRespone.js';
import Post from '../models/post.js';
import Like from '../models/like.js';
import Category from '../models/category.js';
export default {
    async getPostByCategory(req, res) {
        try {
            const { idcategory, page } = req.params;
            // console.log(idcategory)
            // console.log(page)
            const obj = {
                is_available: 0,
                censor: 0,
                is_detroy: 0,
                is_available: 0,
                content: 0,
                updatedAt: 0
            }
            const total = await Post.count({ category: idcategory, is_available: 'Active', is_detroy: false })
            const results = await Post.find({ category: idcategory, is_available: 'Active' ,is_detroy: false}, obj)
                .populate('poster', 'name')
                .populate('category', 'namecategory')
                .sort({ createAt: -1 })
                .limit(6)
                .skip(6 * (Number(page) - 1));

            if (results) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { datapost: results, total: total },
                }).return(res)
            } else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "khong co ket qua" },
                }).return(res)
            }
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }

    },

    async getpostbyid(req, res) {
        const idpost = req.params;
        const iduser = req.query.iduser;
        const obj = {
            is_available: 0,
            censor: 0,
            is_detroy: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        }
        await Post.findOne({ _id: idpost.id }, obj).populate('poster', 'name').populate('category', 'namecategory').then(async(response) => {
            const userlike = await Like.find({ idpost: idpost.id },{_id: 0, idpost: 0,  createdAt: 0, updatedAt: 0, __v: 0});
            const checkuserlike = userlike.some(item => item.iduser.toString() === iduser);
            console.log(userlike.some(item => item.iduser.toString() === iduser))
            return new BaseResponse({
                        statusCode: 200,
                        data: { post: response, checkidlike: checkuserlike},
                    }).return(res)
        }).catch(err => {
            return new BaseResponse({
                statusCode: 400,
                data: { message: "Bài đăng không tồn tại" },
            }).return(res)
        })


    },
    async getrelatedpost(req, res) {
        try {
            const idcategory = req.params.idcategory;
            const idpost = req.query.idpost;
            const results = await Post.find({_id: { $ne: idpost }, is_available: 'Active', is_detroy: false, category: idcategory})
            .limit(5)
            .sort({'views': -1});
            if (results) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { datapost: results },
                }).return(res)
            }
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },
    async getPostNewAndHighestViews(req, res) {
        try {
            const obj = {
                is_available: 0,
                censor: 0,
                is_detroy: 0,
                is_available: 0,
                poster: 0,
                updatedAt: 0
            }
            const resultspostnew = await Post.find({ is_available: "Active", is_detroy: false}, obj).limit(5).populate('category', 'namecategory').sort({ "createAtpost": -1 });
            const resultspostviews = await Post.find({ is_available: "Active", is_detroy: false }, obj).limit(8).populate('category', 'namecategory').sort({ "views": -1 });
            if (resultspostnew) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { postnew: resultspostnew, postviews: resultspostviews },
                }).return(res)
            } else if (!resultspostviews) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'không có bài đăng ' },
                }).return(res)
            }
            else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'không có bài đăng ' },
                }).return(res)
            }
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },

    async getposttopview(req, res) {
        try {
            const obj = {
                is_available: 0,
                censor: 0,
                is_detroy: 0,
                is_available: 0,
                poster: 0,
                updatedAt: 0
            }
            await Post.find({ is_available: "Active" ,is_detroy: false}, obj)
            .limit(3)
            .populate('category', 'namecategory')
            .sort({ "views": -1 })
            .then(response => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { listtopview: response },
                }).return(res)
            })
            
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },

    async getcategory(req, res) {
        const obj = {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        }
        Category.find({is_available: true}, obj, function (err, listcategorys) {
            return new BaseResponse({
                statusCode: 200,
                data: { listcategory: listcategorys },
            }).return(res)
        })
    },
    async postincreaseviews(req, res) {
        const idpost = req.query.idpost;
        console.log(idpost)
        const data = await Post.findOne({ _id: idpost });
        if (data) {
            await Post.updateOne({ _id: idpost }, { views: data.views + 1 }).then(ress => {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "success" },
                }).return(res)
            }).catch(error => {
                new BaseError({
                    statusCode: 500,
                    error: error,
                })
            })
        } else {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }

    },

    async gethomeblogs(req, res) {
        const results = await Category.aggregate([
            { $limit: 4 },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "category",
                    as: "productList"
                },
            },
            { $unwind: "$productList" },
            { $sort: { "productList.views": -1 } },
            {
                $match: {
                    $and: [
                        {"productList.is_available": "Active"},
                        {"productList.is_detroy": false},
                    ]
                },
            },
            {
                $group: {
                    _id: "$_id",
                    namecategory: { $first: "$namecategory" },
                    listpost: { $push: "$productList" }
                }
            },
            { $sort: { _id: 1 } },
            {
                $project: {
                    listpost: {
                        $slice: ['$listpost', 0, 6],
                    },
                    namecategory: 1

                }
            }
        ])
        return new BaseResponse({
            statusCode: 200,
            data: { listpostsbycategory: results },
        }).return(res)
    },

    async searchblog(req, res){
        const value = req.query.value;
        const page = req.query.page;
        const obj ={
            likecount: 0,
            createAtpost: 0,
            updateAtpost: 0,
            createdAt: 0,
            updatedAt: 0,
            censor: 0
        }
        Post.find({title: { $regex: new RegExp(value, "i") }, is_available: 'Active', is_detroy: false}, obj)
        .sort({ "createAtpost": -1 })
        .populate('poster', 'name')
        .limit(5)
        .skip(5 * (Number(page) - 1))
        .then(result => {
            return new BaseResponse({
                statusCode: 200,
                data: { listsearch: result },
            }).return(res)
        }).catch(err => {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        })
    },

    async getpostbyposter(req, res){
        try {
        const idposter = req.params.idposter;
        await Post.find({ poster: idposter, is_available: 'Active', is_detroy: false}).limit(3).sort({'createAtpost': 1}).then(result => {
            return new BaseResponse({
                statusCode: 200,
                data: { listpostbyposter: result },
            }).return(res)
        })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: err,
            })
        }
    }

    
}