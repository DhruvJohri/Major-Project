const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI ;
  await mongoose.connect(uri, {
    // options are not required for modern mongoose
  });
  return mongoose.connection;
};

module.exports = connectDB;
