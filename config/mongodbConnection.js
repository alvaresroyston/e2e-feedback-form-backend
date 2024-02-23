const mongoose = require('mongoose');

const connectDb = async () =>{
  try {
    const MONGODB_URL = "mongodb+srv://rojo:rojo123@cluster0.9ltccst.mongodb.net/AdminTest";
    await mongoose.connect(MONGODB_URL,{useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}
module.exports = { connectDb };