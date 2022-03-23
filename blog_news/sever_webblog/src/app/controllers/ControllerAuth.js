import bcrypt from 'bcrypt';
import Jwt from "jsonwebtoken";
import User from '../models/user.js';
import codegeneration from '../commons/service/codegeneration.js';
import randompass from '../commons/service/randompass.js';
import { sendMailService, sendEmailRegisterSuccess, sendEmailForgotpassword, sendEmailNewPass } from '../commons/service/sendEmail.js'
import BaseResponse from '../commons/helper/BaseRespone.js';
import BaseError from '../commons/helper/BaseError.js';
import { endcodeToken } from '../commons/service/encodeToken.js';
import dotenv from 'dotenv'
dotenv.config();

const bcryptSalt = 10;

export default {
    // register
    async register(req, res, next) {
        try {
            const dataNewUsser = req.body;
            const salt = bcrypt.genSaltSync(bcryptSalt);
            const hashPass = bcrypt.hashSync(dataNewUsser.password, salt);
            User.findOne({ email: dataNewUsser.email }, (err, data) => {
                if (data !== null && data.status === "Active") {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Email đã tồn tại' },
                    }).return(res)
                }
                if (data !== null && data.status === "Pending") {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Email chưa được xác thực' },
                    }).return(res)
                }
                const newUser = new User({
                    name: dataNewUsser.name,
                    email: dataNewUsser.email,
                    validateCode: codegeneration(),
                    password: hashPass,
                })
                newUser
                    .save()
                    .then(response => {
                        sendMailService(newUser.name, newUser.email, newUser.validateCode);
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: 'đăng kí thành công' , email: dataNewUsser.email},
                        }).return(res)
                    }).catch(err => {
                        res.send(err)
                    });

            })
        } catch (error) {
            console.log(error)
        }
    },


    // verify code
    async verificationCodes(req, res) {
        try {
            const dataUser = req.body;
            User.findOne({ email: dataUser.email }, (error, data) => {
                if (Number(dataUser.code) !== Number(data.validateCode)) {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'Mã xác thực không chính xác' },
                    }).return(res)
                } else {

                    User.updateOne({ email: dataUser.email }, { status: 'Active', createAcountAt: new Date(), validateCode: '' })
                        .then(response => {
                            sendEmailRegisterSuccess(dataUser);
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'Đã xác thực tài khoản'},
                            }).return(res)
                        }).catch(err => {
                            new BaseError({
                                statusCode: 400,
                                error: err,
                            })
                        })
                }
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error,
            })
        }
    },
    async resendcode(req,res) {
        const emailresendcode = req.body.email;
        console.log(emailresendcode)
        const code = codegeneration();
        const results = await User.findOne({ email: emailresendcode });
        if(results){
            User.updateOne({ email: emailresendcode }, { validateCode: code })
            .then(response => {
                sendMailService("", emailresendcode, code);
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Đã gửi mã otp xác thực'},
                }).return(res)
            }).catch(err => {
                new BaseError({
                    statusCode: 400,
                    error: err,
                })
            })
    
        }else{
            return new BaseResponse({
                statusCode: 200,
                data: { message: 'thực'},
            }).return(res)
        }
    },

    // login
    async login(req, res) {
        try {
            const userData = req.body;
            User.findOne({ email: userData.email }, (error, data) => {
                if (data !== null) {
                    bcrypt.compare(userData.password, data.password, (err, result) => {
                        if (result) {
                            if (data.status === "Active" && data.role !== 'admin') {
                                if (data.is_available) {
                                    let tokenAccsess = endcodeToken.encodeTokenAccsess(data._id);
                                    let tokenRefresh = endcodeToken.encodeTokenRefresh(data._id);
                                    res.cookie('at', tokenAccsess, {
                                        expires: new Date(Date.now() + 1000 * 60 * 1),                                    
                                        httpOnly: true,
                                    });
                                    res.cookie('rt', tokenRefresh, {
                                        expires: new Date(Date.now() + 1000 * 60 *14400),                                    
                                        httpOnly: true,
                                    });
                                    return new BaseResponse({
                                        statusCode: 200,
                                        data: { message: 'đăng nhập thành công'},
                                    }).return(res);
                                } else {
                                    return new BaseResponse({
                                        statusCode: 200,
                                        data: { message: 'Tài khoản của bạn đã bị khóa, Vui lòng liên hệ CSKH để biết thên chi tiết' },
                                    }).return(res);
                                }
                            }else if (data.role === "admin") {
                                if (data.is_available) {
                                    let tokenAccsess = endcodeToken.encodeTokenAccsess(data._id);
                                    let tokenRefresh = endcodeToken.encodeTokenRefresh(data._id);
                                    res.cookie('at', tokenAccsess, {
                                        expires: new Date(Date.now() + 1000 * 60 * 1),                                    
                                        httpOnly: true,
                                    });
                                    res.cookie('rt', tokenRefresh, {
                                        expires: new Date(Date.now() + 1000 * 60 *14400),                                    
                                        httpOnly: true,
                                    });
                                    return new BaseResponse({
                                        statusCode: 200,
                                        data: { message: 'admin'},
                                    }).return(res);
                                } else {
                                    return new BaseResponse({
                                        statusCode: 200,
                                        data: { message: 'Tài khoản của bạn đã bị khóa, Vui lòng liên hệ CSKH để biết thên chi tiết' },
                                    }).return(res);
                                }
                            } 
                             else {
                                return new BaseResponse({
                                    statusCode: 200,
                                    data: { message: 'tài khoản chưa được xác thực', email: data.email},
                                }).return(res);
                            }
                        } else {
                            return new BaseResponse({
                                statusCode: 200,
                                data: { message: 'email hoặc password không chính xác !!' },
                            }).return(res);
                        }

                    })
                } else {
                    return new BaseResponse({
                        statusCode: 200,
                        data: { message: 'email hoặc password không chính xác !!' },
                    }).return(res);
                }
            })
        } catch (error) {
            new BaseError({
                statusCode: 500,
                error: error
            })
        }
    },
    // refreshtoken
    async generationToken(req, res, next) {
        const refreshToken = req.cookies.rt;
        if(refreshToken === undefined || refreshToken === null){
            new BaseResponse({
                statusCode: 200,
                data: { message: "not authorized"}
            }).return(res);
        }
        else{
            Jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
                if (err) {
                    new BaseResponse({
                        statusCode: 200,
                        data: { message: "not authorized"}
                    }).return(err);
                } else {
                    let newTokenAccess = endcodeToken.encodeTokenAccsess(decode.sub)
                    res.cookie('at', newTokenAccess, {
                        expires: new Date(Date.now() + 1000 * 60 * 1),                                    
                        httpOnly: true,
                    });
                    new BaseResponse({
                        statusCode: 200,
                        data: { message: "create new token"}
                    }).return(res);
                }
            })
        }
    },

    //quên mật khẩu
    async forgotPassword(req, res) {
        const email = req.body.email;
        const code = codegeneration();
        await User.findOne({ email: email }, async (error, data) => {
            if (data !== null) {
                sendEmailForgotpassword(email, code)
                await User.updateOne({ email: email }, { validateCode: code })
                    .then(respone => {
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: `Chúng tôi đã gửi mã xác thực đến ${email} , vui lòng kiểm tra hộp thư thoại !!` },
                        }).return(res);
                    }).catch(err => {
                        return new BaseError({
                            statusCode: 400,
                            error: err
                        })
                    })
            } else {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: "Địa chỉ email không tồn tại" },
                }).return(res);
            }
        }).clone().catch(err => {
            return new BaseError({
                statusCode: 400,
                error: err
            })
        })
    },

    async checkCodeForgotPassword(req, res) {
        const dataForgot = req.body;
        const passRandom = randompass();
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPassRandom = bcrypt.hashSync(passRandom, salt);
        await User.findOne({ email: dataForgot.email }, async (error, data) => {
            if (Number(dataForgot.code) !== data.validateCode) {
                return new BaseResponse({
                    statusCode: 200,
                    data: { message: 'Mã xác thực không chính xác' },
                }).return(res)
            } else {
                await User.updateOne({ email: dataForgot.email }, { validateCode: "", password: hashPassRandom })
                    .then(respone => {
                        sendEmailNewPass(dataForgot.email, passRandom)
                        return new BaseResponse({
                            statusCode: 200,
                            data: { message: "Mật khẩu mới đã được gửi đến email của bạn, Vui lòng kiểm tra hộp thư !!" },
                        }).return(res);
                    }).catch(err => {
                        return new BaseError({
                            statusCode: 400,
                            error: err
                        })
                    })
            }
        }).clone().catch(err => {
            return new BaseError({
                statusCode: 400,
                error: err
            })
        })
    },

    async logout(req, res){
        res.clearCookie('rt');
        res.clearCookie('at');
        return new BaseResponse({
            statusCode: 200,
            data: { message: 'logout success'},
        }).return(res);
    }


}

