import express from "express";
import {registerController, loginController, testController, forgotPasswordController, updateProfileController, getOrderController, getAllOrdersController, orderStatusController} from '../controllers/authController.js';
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";


//router object
const router = express.Router();

//routing
//REGISTER ROUTE || METHOD POST
router.post('/register', registerController )
//LOGIN ROUTE || METHOD POST
router.post('/login', loginController )
//FORGET PASSWORD ROUTE || METHOD POST
router.post('/forgot-password', forgotPasswordController )
//TEST ROUTE || METHOD GET
router.get('/test', requireSignIn, isAdmin, testController )
//PROTECTED USER ROUTE || METHOD GET
router.get('/user-auth', requireSignIn, (req, res) => {
    res.status(200).send({ok:true});
});
//PROTECTED ADMIN ROUTE || METHOD GET
router.get('/admin-auth', requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ok:true});
});
router.put('/profile', requireSignIn, updateProfileController, (req, res) => {
    res.status(200).send({ok:true});
});
router.get('/orders', requireSignIn, getOrderController);
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);
router.put('/order-status/:orderStatus', requireSignIn, isAdmin, orderStatusController);


export default router;