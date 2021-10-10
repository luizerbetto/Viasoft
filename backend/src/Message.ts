import mongoose from 'mongoose';

const message = new mongoose.Schema({

  nameSender: String,
  nameReceiver: String,
  message: String,
  date: Date
  });
  
  export default mongoose.model("Message", message);