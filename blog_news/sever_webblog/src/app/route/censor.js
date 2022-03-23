import express from 'express';  
const routerCensor = express.Router();
import {checkRole} from '../commons/middelware/checkrole.js'
import Censorcontroler from '../controllers/ControlerCencor.js';

routerCensor.get('/getpostpending',  Censorcontroler.getPostPending)
routerCensor.post('/approvepost',  Censorcontroler.approvePost)
routerCensor.post('/unapprovePost',  Censorcontroler.unapprovePost)


export default routerCensor;