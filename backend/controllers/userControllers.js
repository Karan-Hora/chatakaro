const User = require("../models/userModel");
const generateToken= require("../config/generateToken");
const bcrypt = require("bcrypt");
exports.registerUser=async(req,res)=>{
   try{
     const { name, email, password, pic } = req.body;

     if (!name || !email || !password) {
       res.status(400).send({
         success: false,
         message: "All Fields are required",
       });
     }

     // check if user alredy exist
     const userExists = await User.findOne({ email });

     if (userExists) {
       return res.status(400).json({
         success: false,
         message: "User already exists. Please sign in to continue.",
       });
     }

     // Hash the password
     const hashedPassword = await bcrypt.hash(password, 10);


     const user = await User.create({
       name,
       email,
       password:hashedPassword,
       pic,
     });

     return res.status(201).json({
       _id: user._id,
       name: user.name,
       email: user.email,
       isAdmin: user.isAdmin,
       pic: user.pic,
       token: generateToken(user._id),
       message: "User registered successfully",
     });
   } 



   


   catch(error){
         console.log(error);
         return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    })
}

}


// login

exports.authUser=async(req,res)=>{

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({
        success: false,
        message: `User is not Registered with Us or passsword not match Please SignUp to Continue`,
      });
    }
  } catch (error) {
    console.error(error);
    // Return 500 Internal Server Error status code with error message
    return res.status(500).json({
      success: false,
      message: `Login Failure Please Try Again`,
    });
  }
}


exports.allUser = async (req, res) => {
try{
const keyword = req.query.search
  ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
  : {};

const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
res.send(users);
}
catch(error){
   console.log(error);

   return res.status(500).json({
    success:false,
    message:`All User cant fetch`,
   });
}
  
};
   