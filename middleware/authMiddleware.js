const jwt = require("jsonwebtoken");
const cerateError = require("../utills/error");

const protect = async (req, res, next) => {
  let token;

  console.log("");

  if (
    req.headers.authorization 
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(createError(403, "Token is not valid!"));
        console.log(user);
        req.user = user;

        next();
      });
    } catch (error) {
      next(cerateError(401, "Not authorized, token failed"));
    }

    // if (!token) {
    //   next(cerateError(401, "Not authorized, token failed"));
    // }
  } else {
    next(cerateError(401, "Not authorized, token failed"));
  }
};

module.exports = { protect };