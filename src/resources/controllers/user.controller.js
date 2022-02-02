import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs';

// Register
export const register =async (req, res) => {
    // Our register logic starts here
    var encryptedPassword;
  try {
    // Get user input
    const { full_names, username, email, password} = req.body;

    // Validate user input
    if (!(email && password && full_names && username)) {
     return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    // if(password != password2){
    //     return res.status(400).send({message: "passwords to do not match"})
    // }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      full_names,
      username,
      email,
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    return res.status(201).json({user});
  } catch (err) {
    console.log(err);
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
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
     return res.status(200).json(user);
    }
   return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
  // Our register logic ends here
}