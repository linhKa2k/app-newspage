import express from 'express';  
const routerPost = express.Router();
import LikeController from '../controllers/ControllerLike.js';


routerPost.post('/like/:idpost', LikeController.likepost)



export default routerPost;