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
        token:{
            type:String
        }
    },
    { timestamps: true }
    )

    
    export const User = mongoose.model('user', userSchema)
    
    
    
    