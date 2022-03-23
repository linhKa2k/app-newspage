import routerAuth from './auth.js';
import routerPost from './post.js';
import routerAdmin from './admin.js';
import routerUser from './user.js';
import routerCensor from './censor.js'
import routerFreedom from './freedompath.js';
import routerComment from './comment.js';
import routerLike from './like.js'
import passport from "passport";
import {checkRole} from '../commons/middelware/checkrole.js';
import dotenv from 'dotenv';
dotenv.config();
// các router cha sẽ để ở đây.
function route(app){
    const authenticate = passport.authenticate('jwt',{session: false});
    app.use('/auth',routerAuth);
    app.use('/user',authenticate,routerUser);
    app.use('/post',authenticate,routerPost);
    app.use('/likepost',authenticate,routerLike);
    app.use('/comment',routerComment);
    app.use('/admin',authenticate,checkRole.isAdmin,routerAdmin);
    app.use('/censor',authenticate, checkRole.isCensor,routerCensor)
    app.use('/',routerFreedom)
}
export default route;

    
