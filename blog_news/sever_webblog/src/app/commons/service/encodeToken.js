import moment from "moment";
import Jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const encodeTokenAccsess = (_idUser) => {
    const infoTokenAccsess = {
        sub: _idUser, //chứa thông tin để định danh (thông tin duy nhất)
        exp: moment().add(process.env.ACCESS_TOKEN_LIFE, 's').unix(), // thời hạn token
        iat: moment().unix(), // ngày tạo token
    };
    return Jwt.sign(
        infoTokenAccsess,
        process.env.ACCESS_TOKEN_SECRET,

    )
    
}
const encodeTokenRefresh = (_idUser) => {
    const infoToken = {
        sub: _idUser, //chứa thông tin để định danh (thông tin duy nhất)
        exp: moment().add(process.env.REFRESH_TOKEN_LIFE, 's').unix(), // thời hạn token
        iat: moment().unix(), // ngày tạo token
    };
    return Jwt.sign(
        infoToken,
        process.env.REFRESH_TOKEN_SECRET,
    )
    
}

export const endcodeToken = {encodeTokenAccsess , encodeTokenRefresh}  ;