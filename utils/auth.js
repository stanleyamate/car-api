import jwt from 'jsonwebtoken';

const config = process.env;

const verifyToken = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  const tokenHeader = req.headers.authorization;
   if(tokenHeader == null || tokenHeader == undefined){
    return res.status(401).send("A token is required for authentication");
  }
  try {
    const token = tokenHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.TOKEN_KEY);
     req.userData = decoded;
    next();
  } catch (err) {
    return res.status(403).send("Invalid Token");
  }
};


export default verifyToken;
