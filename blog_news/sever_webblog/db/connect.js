import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const urimongoo = process.env.DB_link ; 
  const connect = async () => {
    try {
      await mongoose.connect(urimongoo , {
        useUnifiedTopology : true ,
        useNewUrlParser : true
      });
      console.log("database connected");
    } catch (error) {
      console.log("database connect false");
      console.log(error);
    }
  }

  export default { connect };