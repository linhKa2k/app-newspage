import express from 'express';  
const routerPost = express.Router();
import multer from 'multer';
import {validatePost} from '../commons/validate/post.validate.js';
import PostController from '../controllers/ControllerPost.js';
import {uploadpost} from '../commons/helper/uploadimage.js';
import {checkRole} from '../commons/middelware/checkrole.js';
import {resise} from '../commons/middelware/resizeimg.js'


routerPost.post('/uploadimage',uploadpost,resise.resizeimg, PostController.uploadImg)
routerPost.post('/creatpost', validatePost.validpost, PostController.creatPost)
routerPost.post('/updatepost', PostController.updatePost)
routerPost.post('/deletepost', PostController.deletePost)
routerPost.post('/restorePost', PostController.restorePost)



export default routerPost;