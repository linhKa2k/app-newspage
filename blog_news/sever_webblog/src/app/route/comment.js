import express from 'express';  
const routerComment = express.Router();
import Commentcontroller from '../controllers/ControllerComment.js'
import passport from "passport";
const authenticate = passport.authenticate('jwt',{session: false});
import { serviceFind } from '../commons/helper/checklimit.js'

routerComment.post('/creatcomment', authenticate, Commentcontroller.createComment);
routerComment.get('/getcomment/:id/:limit/:page',serviceFind.limit, Commentcontroller.getComment);

export default routerComment;