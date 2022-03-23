import express from 'express';  
const routerAdmin = express.Router();
import Admincontroler from '../controllers/ControlerAdmin.js';

routerAdmin.get('/getlistuser/:page', Admincontroler.getListUser)
routerAdmin.post('/deleteuser/:id', Admincontroler.deleteUser)
routerAdmin.post('/unlockaccount/:id', Admincontroler.unlockaccount)
routerAdmin.post('/accountVerification/:iduser', Admincontroler.accountVerification)
routerAdmin.get('/findusersbyname', Admincontroler.findUsersByName)
routerAdmin.get('/getcategory/:isavalible', Admincontroler.getcategory)
routerAdmin.get('/findusersbyemail', Admincontroler.findUsersByEmail)
routerAdmin.post('/addcensor/:iduser', Admincontroler.addcensor)
routerAdmin.post('/removecensor/:iduser', Admincontroler.removeCensor)
routerAdmin.post('/removeCategory/:idcategory', Admincontroler.lockCategory)
routerAdmin.post('/unlockCategory/:idcategory', Admincontroler.unlockCategory)
routerAdmin.post('/removeaccount/:iduser', Admincontroler.removeAccount)
routerAdmin.post('/addCategory', Admincontroler.addCategory)
routerAdmin.get('/getpostbyfillter/:page', Admincontroler.getpostbyfillter)
routerAdmin.get('/getpostdeletedbyfillter/:page', Admincontroler.getpostdeletedbyfillter)
routerAdmin.post('/updateCategory/:nameCategory/:idcategory', Admincontroler.updateCategory)


export default routerAdmin;
