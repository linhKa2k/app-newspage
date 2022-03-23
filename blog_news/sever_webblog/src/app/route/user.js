import express from 'express';  
const routerUser = express.Router();
import Usercontroller from '../controllers/ControllerUser.js';
import {uploaduser} from '../commons/helper/uploadimage.js';
import {validateuser} from '../commons/validate/user.validate.js'
import {resise} from '../commons/middelware/resizeimg.js';
routerUser.post("/changepassword",Usercontroller.changePassword)
routerUser.get("/getprofile",Usercontroller.getProfile)
routerUser.post("/readingnoti/:idnoti",Usercontroller.readingnoti)
routerUser.post("/uploadimguser",uploaduser,resise.resizeimg,Usercontroller.uploadImgUser)
routerUser.post("/updateprofile", validateuser.validupdateprofile,uploaduser,Usercontroller.updateProfile)
routerUser.post("/deletepostunapprove/:idpost",Usercontroller.deletepostunapprove)
routerUser.get("/getpostbyuser/:page",Usercontroller.getpostbyuser)
routerUser.get("/getPostpendingbyuser",Usercontroller.getPostpendingbyuser)
routerUser.post("/updatetpostpending",Usercontroller.updatetpostpending)


export default routerUser;