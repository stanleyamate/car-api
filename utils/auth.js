import jwt from 'jsonwebtoken';

const config = process.env;

const verifyToken = (req, res, next) => {

  const tokenHeader = req.headers.authorization;
   if(tokenHeader == null || tokenHeader == undefined){
    console.log("not auth");
    return res.status(401).send("A token is required for authentication");
  }
  try {
    const token = tokenHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.TOKEN_KEY);
     req.userData = decoded;
    next();
  } catch (err) {
    //for subscription checker
    return res.status(403).send("Invalid Token");
  }
};


export default verifyToken;
