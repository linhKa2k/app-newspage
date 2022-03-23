import express from 'express';  
const routerFreedom = express.Router();
import FreedomPathController from '../controllers/ControllerfreedomPath.js'
import { serviceFind } from '../commons/helper/checklimit.js';

routerFreedom.get('/postbycategory/:idcategory/:page',serviceFind.limit,  FreedomPathController.getPostByCategory);
routerFreedom.get('/getpostnewandviews',serviceFind.limit,  FreedomPathController.getPostNewAndHighestViews);
routerFreedom.get('/getcategory',  FreedomPathController.getcategory);
routerFreedom.get('/gethomeblogs',  FreedomPathController.gethomeblogs);
routerFreedom.get('/getrelatedpost/:idcategory',  FreedomPathController.getrelatedpost);
routerFreedom.post('/postincreaseviews',  FreedomPathController.postincreaseviews);
routerFreedom.get('/getpostbyid/:id',  FreedomPathController.getpostbyid);
routerFreedom.get('/searchblog',  FreedomPathController.searchblog);
routerFreedom.get('/getposttopview',  FreedomPathController.getposttopview);
routerFreedom.get('/getpostbyposter/:idposter',  FreedomPathController.getpostbyposter);
export default routerFreedom;