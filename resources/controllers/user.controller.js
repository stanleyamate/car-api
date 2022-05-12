import { User } from '../models/user.model.js';
import multer from 'multer'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';
import moment from 'moment'

// Register
export const register =async (req, res, next) => {
  // Our register logic starts here
  var encryptedPassword;
   // Get user input
    var { full_names, username, email, password, plan, role, isActive, car_model, end_date, show_end_date} = req.body; 
    try {
        // check if user already exist
       // Validate if user exist in our database
      const oldUser = await User.findOne({ username });
    
    if (oldUser) {
      return res.status(409).json({message:{msg:"User Already Exist.", success:false}});
    }
    } catch (error) {
      console.log(error)
    }
    
  try {
   
    
    // Validate user input
    if (!(email && password && full_names && username)) {
      res.status(400).json({message:{msg:"All inputs are required",success: false}});
    }
 
    // if(password != password2){
    //     return res.status(400).send({message: "passwords to do not match"})
    // }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    if( plan == "none"){
      isActive = false;
    }
    else if(plan == "weekly"){
    isActive = true;
    end_date=moment(new Date()).add(7,"days").format("YYYY-MM-DD hh:mm");
    show_end_date=moment(new Date()).add(7,"days").format("YYYY-MM-DD hh:mm");
    }
    else if(plan == "monthly"){
      isActive=true
      end_date=moment(new Date()).add(30,"days").format("YYYY-MM-DD hh:mm");
      show_end_date=moment(new Date()).add(30,"days").format("YYYY-MM-DD hh:mm");
  }
  //ofunction to Create token
  const createToken=(user)=>{
    const token = jwt.sign(
      { user_id: user._id, email, isActive: user.isActive, role: user.role, end_date: user.end_date, show_end_date: user.show_end_date },
      process.env.TOKEN_KEY,
      {
        expiresIn: "15s"
      }
      );
      // save user token
        user.token = token;
      
      // return new user
      return res.status(201).json({message:{msg:"Registration successful",success: true}, user});
  }
    //Create user in our database
    if(req.file){
      const user = await User.create({
        full_names,
        username,
        email,
        password: encryptedPassword,
        plan,
        isActive,
        role,
        car_model,
        end_date,
        show_end_date,
        image: req.file.path
      });
      createToken(user)
    }else{
      const user = await User.create({
        full_names,
        username,
        email,
        password: encryptedPassword,
        plan,
        isActive,
        role,
        car_model,
        end_date,
        show_end_date
      });
      createToken(user)
    }

  
    } catch (err) {
      console.log(err);
    }
  }
   
  export const updateCar = async (req, res)=>{
     const id=req.params.id 
      if(req.file){ 
        
        try {
         const doc = await User.findOneAndUpdate({ _id : id },
        {image: req.file.path},
        { new: true }).exec()
       return res.status(200).json({
        message :{msg:"Car Image updated.", success: true},
        doc
     })
       } catch (error) {
        return res.status(400).json({
          message :{msg:"Could not updated Image.", success: false}
       })
       }
      }
     
    
  }
  const storage = multer.diskStorage({
    destination:function(req, file, cb){
    if(file.fieldname === "image"){
        cb(null, './uploads/')
      }
    },
    filename: function(req, file, cb){
        cb(null,file.filename + '-' + Date. now()) 

    }
    
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
    }).single('image')

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
        res.status(200).json({message:{msg:"no plan choosen, please choose plan first to subscribe",success: true}})
        }
      else if(plan == "weekly"){

        const update = await User.findOneAndUpdate(
          { _id : id},req.body, { new: true }
          )
          .exec()
          user.end_date=moment(new Date()).add(7,"days").format("YYYY-MM-DD hh:mm");
          user.show_end_date=moment(new Date()).add(7,"days").format("YYYY-MM-DD hh:mm");

        res.status(200).json({message:{msg:"Weekly subscribe successful",success: true}, update})
      }
      else if(plan == "monthly"){
         try {
          const update = await User.findOneAndUpdate(
            { _id : id},req.body, { new: true }
            )
            .exec()
          user.end_date=moment(new Date()).add(30,"days").format("YYYY-MM-DD hh:mm");
          user.show_end_date=moment(new Date()).add(30,"days").format("YYYY-MM-DD hh:mm");
          res.status(200).json({message:{msg:"Monthly subscription successful",success: true},update})
         } catch (error) {
           console.log(error)
         }
      }
      else{
          res.status(403).end()
      }
    } catch (e) {
      return res.status(401).json({message:{msg:"error subscribing, please try again",success: false}, error:e})
    }
  }
  export const unsubscribe = async (req, res)=>{
    
    const userData = req.userData;
    const id =req.params.id;

    try {
         const doc = await User.findOne({ _id:id }).exec()
          if (doc && userData.isActive === false) {
            res.status(409).json({message:{msg:"user already unsubscribed",success: false}});
          }
          else{
          try {
            const update = await User.findOneAndUpdate(
              { _id : id},req.body, { new: true }
              )
              .exec()
            res.status(200).json({update, message:{msg:"user unsubscribed successful",success: true}});

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
    // Get user input
      const { email, password } = req.body;

      try {
        const registeredUser= await User.findOne({email}).exec()
        if(!registeredUser){
          res.status(404).json({message:{msg:`${email} is not found`,success: false}})
        }
      } catch (error) {
        console.log(error)
      }
    try {
     
      // Validate user input
      if (!(email && password)) {
        return res.status(400).json({message:{msg:"All inputs required",success: false}});
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
          return res.status(200).json({message:{msg:"Logged successful",success: true},user:user, token});
        }else{
         return res.status(401).json({message:{msg:"Invalid credentials",success: false}})
        }
      } catch (err) {
        console.log(err);
      }
      // Our login logic ends here
    }
    