    import jwt from 'jsonwebtoken';
    import userModel from '../models/userModel.js';


    //Testing middleware
    export const requireSignIn = async (req, res, next)=>{
        try {
            const decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
            req.user = decode
            next()
        } catch (error) {
            console.log(`VERIFY TOKEN ERROR: ${error}`)
        }
    };

    // Check admin middleware
    export const isAdmin = async(req, res, next)=>{
        try {
            
            const user = await userModel.findOne({_id:req.user._id});
            if(user.role !==1){
                return res.status(401).send({
                    success:false,
                    message:'ISadmin ERROR: UnAuthorized Access'
                })
            } else {
                next()
            }
        } catch (error) {
            console.log(`isAdmin ERROR: ${error}`);
            res.status(401).send({
                success:false,
                error,
                message:'ERROR in Admin middleware'
            })
        }
    }