import BaseResponse from "../helper/BaseRespone.js";
const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        return next();
    }
    return new BaseResponse({ statusCode: 404}).return(res);
}
const isCensor = (req, res, next) => {
    if(req.user.role === 'censor'){
        return next();
    }
    return new BaseResponse({ statusCode: 404}).return(res);
}
const isTruongphong = (req, res, next) => {
    if(req.user.chucvu === "truongphong"){
        return next();
    }
    return new BaseResponse({ statusCode: 404}).return(res);
}
export const checkRole = { isAdmin,isCensor,isTruongphong};