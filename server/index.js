const express = require('express');
const cors = require('cors');
const {connect} =require("mongoose")
require("dotenv").config();
const upload = require("express-fileupload");


const Routes = require('./routes/Routes')
const messageRoutes = require('./routes/messageRoutes')
const {notFound, errorHandler} = require("./middleware/errorMiddleware")

const app = express()

// Add timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 second timeout
  res.setTimeout(30000, () => {
    console.log('Response timeout occurred');
    if (!res.headersSent) {
      res.status(408).json({ message: 'Request Timeout', http_code: 408, name: 'TimeoutError' });
    }
  });
  next();
});

app.use(express.json({extended: true, limit: '10mb'}))
app.use(express.urlencoded({extended: true, limit: '10mb'}))
app.use(cors({credentials: true, origin: ["http://localhost:3000"]}))
app.use(upload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}))


app.use('/api', Routes)
app.use('/api', messageRoutes)
app.use(notFound)
app.use(errorHandler)





// Configure mongoose connection options
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000, // Increase server selection timeout
  socketTimeoutMS: 45000, // Increase socket timeout
  bufferCommands: false, // Disable buffering
  maxPoolSize: 10
};

// Connect to MongoDB with improved error handling
connect(process.env.MONGO_URL, mongooseOptions)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('Please ensure your IP address is whitelisted in MongoDB Atlas');
      console.error('Visit: https://www.mongodb.com/docs/atlas/security-whitelist/');
    }
    process.exit(1);
  });
