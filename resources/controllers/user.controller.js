import { User } from '../models/user.model.js';
import multer from 'multer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import moment from 'moment'

// Register
export const register =async (req, res, next) => {
  // Our register logic starts here
  var encryptedPassword;
  try {
    // Get user input
    var { full_names, username, email, password, plan, role, isActive, car_model} = req.body;
    
    // Validate user input
    if (!(email && password && full_names && username)) {
      return res.status(400).send("All inputs are required");
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: email });
    
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    // if(password != password2){
    //     return res.status(400).send({message: "passwords to do not match"})
    // }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
 if( plan == "none"){
      isActive = false;
    }
    else{
      isActive = true;
    }
    //Create user in our database
    const user = await User.create({
      full_names,
      username,
      email,
      password: encryptedPassword,
      plan,
      isActive,
      role,
      car_model,
      image: req.file.path
    });
    
    //Create token
   
    const token = jwt.sign(
      { user_id: user._id, email, isActive: user.isActive, role: user.role },
      process.env.TOKEN_KEY,
      {
        expiresIn: "15s"
      }
      );
      // save user token
        user.token = token;
      
      // return new user
      res.status(201).json({user});
      next()
    } catch (err) {
      console.log(err);
    }
  }
  const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null,file.originalname) 
    },
    
})
const fileFilter=(req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/png' || file.mimetype ==='image/jpg'){
        cb(null, true)
    }
    else cb(null, false)
    
}
export const uploadImg = multer({
    storage:storage, 
    // limits:{
    //     fileSize:1024 *1024 * 5
    // },
     fileFilter: fileFilter
    }).single('image');

  //subscribe
  export const subscribe = async (req, res)=>{
    // try {
    //   await User.findOne({ _id:id});
    
    // } catch (error) {
    //   res.status(404).json({message:"user not found", error: error});
    // }
    const userData = req.userData;

    try {
      const { email, plan} = req.body;

      const user = await User.findOne({email: email})
      if(userData.isActive == true){
        res.json({msg:"user already subscribed"});
      }
      else if(plan == "none"){
        user.isActive=false;
        res.status(500).json({msg:"no plan choosen, please choose plan first to subscribe"})
        }
      else if(plan == "weekly"){
        user.isActive=true;
        user.end_date=moment(new Date()).add(7,"days").format("YYYY-MM-DD hh:mm");
        res.status(200).json({message:"subscribe weekly successful", user:user})
      }
      else if(plan == "monthly"){
        user.isActive=true;
        user.end_date=moment(new Date()).add(30,"days").format("YYYY-MM-DD hh:mm");
        res.status(200).json({message:"subscribe monthly successful", user:user})
      }
      else{
          res.status(403).end()
      }
    } catch (e) {
      return res.status(401).json({message:"error", error:e})
    }
    // try {
    //     var car = await Cars.findOne({ _id : req.params.id });
    // } catch (e) {
    //     return res.status(404).json({ message: "car not found!", errors: e.message });
    // }
    
    // try {
    //     var user = await User.findOne({ username });
    // } catch (e) {
    //     return res.status(500).json({ message: "Error getting user", errors: e.message });
    // }
    
    // res.json({ 'success': true, user: user });
    
  }
  // Login
  export const login =async (req, res) => {
    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
      
      // Validate user input
      if (!(email && password)) {
        return res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ email });
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email},
          process.env.TOKEN_KEY,
          {
            expiresIn: "30days",
          }
          );

          // save user tok en
          user.token = token;
          // user
          return res.status(200).json({user:user, token});
        }
      } catch (err) {
        console.log(err);
      }
      // Our register logic ends here
    }
    