import mongoose from "mongoose";



const connectDB = async () => {


    try {

        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`DB CONNECTION SUCESSFULLY : ${conn.connection.name}`.bgGreen.white)

    } catch (error) {
        console.log(`DB CONNECTION FAILED : ${error.message}`.bgRed.white)
    }
}

export default connectDB