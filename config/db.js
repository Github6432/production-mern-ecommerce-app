import mongoose from 'mongoose';

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected successfully host: ${conn.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`MongoDb Error: =>>> ${error}`.bgRed.white);
    }
};

export default connectDB;