const express = require("express");
const dotenv = require("dotenv");
const app= express();
const database = require("./config/database");
const colors=require("colors");
const userRoutes=require("./routes/userRoutes");
const chatRoutes=require("./routes/chatRoutes");
const PORT= process.env.PORT || 5000;

// Loading environment variables from .env file
dotenv.config();

// Connecting to database
database.connect();


//to accept json data
app.use(express.json()); 

// Setting up routes

app.use('/api/user',userRoutes)

app.use('/api/chat',chatRoutes)

// Testing server          

app.get("/",(req,res)=>{
     
    return res.json({
        message:"Your server is up and running ...",
    })

})


// Listening to the server
app.listen(PORT, () => {
	console.log(`App is listening at ${PORT}`.yellow.bold);
});




