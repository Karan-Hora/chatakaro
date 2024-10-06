const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");


const protect = async (req, res, next) => {


    try {
      let token;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        try {
          token = req.headers.authorization.split(" ")[1];

          //decodes token id
          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          req.user = await User.findById(decoded.id).select("-password");

          next();
        } catch (error) {
          res.status(401);
          throw new Error("Not authorized, token failed");
        }
      }

      if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }
    } catch (error) {
      // If there is an error during the authentication process, return 401 Unauthorized response
      return res.status(401).json({
        success: false,
        message: `Something Went Wrong While Validating the Token`,
      });
    }
};

module.exports = { protect };
