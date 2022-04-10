import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        full_names:{
            type: String,
            required:[true, "full names required"],
            maxLength:20
        },
        username:{
            type:String,
            required:[true, "username required"],
            unique:true,
            trim:true,
            maxlength: 10
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            minLength:[4, "atleast 4 xter pw"]
        },
        plan: {
            type:String,
            enum:["none","weekly","monthly"],
            default: "none",
            required:[true, "please choose plan"]
        },
        car_model:  { 
            type: String,
            // required: [true,"car model must be filled"],
             maxLength:20
        },
          image:{
            type: String,
            // required: [true, "car image is required"]
          },
        role: {
            type:String,
            enum:["user","admin"],
            default: "user",
        },
        isActive:{
            type: Boolean,
            default:false
        },
        end_date:{
            type:Date
        },
        token:{
            type:String
        },
        userData:{
            type:Object
        }
    },
    { timestamps: true }
    )

    
    export const User = mongoose.model('user', userSchema)
    
    
    
    