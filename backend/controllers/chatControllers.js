
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.accessChat= async(req,res)=>{
    try{
      const { userId } = req.body;
      if (!userId) {
        console.log("UserId param not sent with request");
        return res.sendStatus(400);
      }

      var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
        .populate("users", "-password")
        .populate("latestMessage");
      isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
      
    }

     const createdChat = await Chat.create(chatData);
     const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
       "users",
       "-password"
     );
     res.status(200).json(FullChat);
    }  
    catch(error){
res.status(400);
throw new Error(error.message);
    }
  
}
exports.fetchChats= async(req,res)=>{

    try{
        let val = Chat.find({ users: { $elemMatch: { $eq: req.user._id } } });
         val
           .populate("users", "-pssword")
           .populate("groupAdmin", "-password")
           .populate("latestMessage")
           .sort({ updatedAt: -1 })
           .then(async(resolve)=>{
            resolve = await User.populate(resolve, {
              path: "latestMessage.sender",
              select: "name pic email",
            });
            res.status(200).send(resolve);
           })
           


    }

    catch(error){
       res.status(400);
       throw new Error(error.message);
    }
  

}

exports.createGroupChat =async(req,res)=>{

  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }
 
  var users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

      res.status(200).json(fullGroupChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
}

exports.renameGroup= async(req,res)=>{
  try{
  const {chatId,chatName}= req.body;

   const updatedChat= await Chat.findByIdAndUpdate(chatId,{
    chatName:chatName,
   },
   {
    new:true,
   }).populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updatedChat){
      return res.status(404).json({
        success:false,
        message:"Chat Not Found"
      })
    }
    else{
      return res.json(updatedChat);
    }
}

catch(error){
  return res.status(401).json({
    success: false,
    message: `Something Went Wrong While Ranaming  the Chat`,
  });
}

}

exports.removeFromGroup=async(req, res)=>{

   try{
         const {userId,chatId}=req.body;
         if(!userId||chatId){
          return res
            .status(500)
            .send({ message: " Id not found" });
         }
         const removed= await Chat.findByIdAndUpdate(
         chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(removed){
      return res.json(removed);

    }
    else{
      return res.status(404).json({
        message:`Something went wrong`,
      })
    }


        
          
         

   }
   catch(error){
     console.log(error);
        return res.status(501).json({
          success: false,
          message: `Something Went Wrong While romoving  the Chat`,
        });
   }

}


exports.addToGroup=async(req,res)=>{
  try {
    const { userId, chatId } = req.body;
    if (!userId || chatId) {
      return res.status(500).send({ message: " Id not found" });
    }

    const added = Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (added) {
      return res.json(added);
    } else {
      return res.status(404).json({
        message: `Something went wrong`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      success: false,
      message: `Something Went Wrong While adding  the user`,
    });
  }
}