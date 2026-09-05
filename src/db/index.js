import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {

    const connetionInctance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`);

    console.log(`mongoDb connected !! DB Host:- ${connetionInctance.connection.host}`);
    // console.log(connetionInctance)
  } catch (error) {
    console.log("db Connection failed", error);
    process.exit(1);
  }
};

export default connectDB
