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
      return res.status(409).json({msg:"User Already Exist. Please Login"});
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
  export const updateCar = async (req, res)=>{
     const id=req.params.id 
    const doc = await User.findOneAndUpdate({ _id : id },req.file.path,
        { new: true }).exec()
       return res.status(200).json({
        message :"Car Image Added...",
      doc
    })
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
    
    const userData = req.userData;
    const id =req.params.id;
    try {
      const { plan } = req.body;

      const user = await User.findOne({_id:id})
      if(userData.isActive == true){
        res.json({msg:"user already subscribed"});
      }
      else if(plan == "none"){
        user.isActive=false;
          
          // return new user
        res.status(200).json({msg:"no plan choosen, please choose plan first to subscribe"})
        }
      else if(plan == "weekly"){

        const update = await User.findOneAndUpdate(
          { _id : id},req.body, { new: true }
          )
          .exec()
        user.end_date=moment(new Date()).add(7,"days").format("YYYY-MM-DD hh:mm");
        res.status(200).json({message:"subscribe weekly successful", update})
      }
      else if(plan == "monthly"){
         try {
          const update = await User.findOneAndUpdate(
            { _id : id},req.body, { new: true }
            )
            .exec()
     user.end_date=moment(new Date()).add(30,"days").format("YYYY-MM-DD hh:mm");
     res.status(200).json({message:"subscribe monthly successful",update})
         } catch (error) {
           console.log(error)
         }
      }
      else{
          res.status(403).end()
      }
    } catch (e) {
      return res.status(401).json({message:"error", error:e})
    }
    
    
  }
  export const unsubscribe = async (req, res)=>{
    
    const userData = req.userData;
    const id =req.params.id;

    try {
         const doc = await User.findOne({ _id:id }).exec()
          if (doc && userData.isActive === false) {
            res.status(409).json({msg:"user already unsubscribed"});
          }
          else{
          try {
            const update = await User.findOneAndUpdate(
              { _id : id},req.body, { new: true }
              )
              .exec()
            res.status(200).json({update:update,msg:"user unsubscribed successful"});

          } catch (error) {
            console.log(error)
          }
         
        }
  
      } catch(error) {
          console.log(error)
    }
    
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
            expiresIn: "1d",
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
    