import express from 'express';  
const routerAuth = express.Router();
import {validateUser} from '../commons/validate/auth.validate.js'
import AuthController from '../controllers/ControllerAuth.js';

routerAuth.post('/register', validateUser.validRegister,  AuthController.register)
routerAuth.post('/verificationcodes', AuthController.verificationCodes)
routerAuth.post('/login',validateUser.validLogin, AuthController.login)
routerAuth.post("/generationToken",AuthController.generationToken)
routerAuth.post("/forgotpassword",AuthController.forgotPassword)
routerAuth.post("/checkcodeforgotpassword",AuthController.checkCodeForgotPassword)
routerAuth.post("/resendcode",AuthController.resendcode)
routerAuth.post("/logout",AuthController.logout)


export default routerAuth;
