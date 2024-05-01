import userModel from '../models/userModel.js';
import orderModel from '../models/orderModel.js';
import {  comparePassword, hashPassword } from "./../helpers/authHelper.js";
import jwt from "jsonwebtoken";

//Registration =>> Method: Post
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer, role } = req.body
        //validation
        if (!name) {
            return res.send({ message: 'Name is Required' })
        }
        if (!email) {
            return res.send({ message: 'Email is Required' })
        }
        if (!password) {
            return res.send({ message: 'Password is Required' })
        }
        if (!phone) {
            return res.send({ message: 'Phone is Required' })
        }
        if (!address) {
            return res.send({ message: 'Address is Required' })
        }
        if (!answer) {
            return res.send({ message: 'Answer is Required' })
        }
        if (!role) {
            return res.send({ message: 'Role is Required' })
        }
        //Check existing user
        const existingUser = await userModel.findOne({ email })
        //exisiting user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Alread Register Please loginh',
            })
        }
        //Register User
        const hashedPassword = await hashPassword(password);
        //Save User Registration Details
        const user = await new userModel({name, email, phone, address, answer, role,  password:hashedPassword}).save();
        res.status(201).send({
            success:true,
            message:'User Register successfully',
            user,
        });
    }
    catch (error) {
        console.log('RE=>>1')
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'ERROR: error in registration',
            error
        })
    }
};


//Login =>> Method:Post
export const loginController = async(req, res)=>{
    try {
        const {email, password} = req.body;
        //Validation
        if(!email || !password){
            return res.status(404).send({
                success:true,
                message:'Please Enter Valid Email or Password'
            });
        };
        //Check User Password match
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Email is not registerd, Please regiter you mail and login'
            });
        };
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(200).send({
                success:false,
                message:'Backend ERROR: Please Enter Valid credentials'
            });
        };
        //Create token
        const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).send({
            success:true,
            message:'Login Successfully',
            user:{
                name:user.name,
                email: user.email,
                phone:user.phone,
                address: user.address,
                role:user.role,
            },
            token,
        });

    }
    catch (error) {
        console.log('LE=>>1')
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'ERROR: Error in Login',
            error
        })
    }
};

//Login =>> Method:Post
export const forgotPasswordController = async(req, res)=>{
    try {
        const {email, newPassword, answer} = req.body;
        //req.body Validation
        if(!email){
            return res.status(400).send({message:'Please Enter Valid Email'});
        };
        if(!newPassword){
            return res.status(400).send({message:'Please Enter Valid New Password'});
        };
        if(!answer){
            return res.status(400).send({message:'Please Enter Valid Answer'});
        };
        //Check User
        const user = await userModel.findOne({email, answer});
        //database validation
        if(!user){
            return res.status(404).send({
                success:false,
                message:'Please Enter correct Email answer'
            });
        };
        //hash password
        const hashedPassword = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password:hashedPassword});
        res.status(200).send({
            seccess:true,
            message:'Passworld reset seccessfully'
        });

    }
    catch (error) {
        console.log('F_P_E=>>1')
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'ERROR: Error in Forgot Password',
            error
        })
    }
};

//UPDATE PROFILE =>> Method Put
export const updateProfileController = async(req, res) => {
    try {
        const {name, email, password, address, phone} = req.body;
        const user = await userModel.findById(req.user._id);
        if(password && password.length < 6) {
            return res.json({error:'Password is required and must be 6 charcter long'})
        }
        const hashedPassword = password ? await hashPassword(password) : undefined
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            email: email || user.email,
            password: hashedPassword || user.password,
            address: address || user.address,
            phone: phone || user.phone,

        },{new:true})
        res.status(200).send({
            success: true,
            message: 'Profile Updated Successfully',
            updatedUser
        })
    } catch (error) {
        console.log('F_U_P_E=>>1');
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'ERROR: Error in Update Profile',
            error
        })
    }
}

//ORDERS
export const getOrderController = async (req, res) => {
    try {
        const orders = await orderModel.find({buyer: req.user._id}).populate('products', '-photo').populate('buyer', 'name');
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while Geting Orders',
            error
        })
    }
}


//ORDERS
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate('products', '-photo').populate('buyer', 'name').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while Geting Orders',
            error
        })
    }
}

//ORDER STATUS UPDATE
export const orderStatusController = async (req, res) => {
    try {
        const {orderStatus} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderStatus, {status}, {new: true});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while order status update',
            error
        })
    }
}



//TEST :
export const testController =(req, res)=>{
    res.send('Protected route')
} 




