import mongoose from 'mongoose';
const ObjectId = mongoose.Schema.Types.ObjectId
const carsSchema = new mongoose.Schema(
  {
    _id: ObjectId,
    car_model:  { 
      type: String,
      required: [true,"car model must be filled"], maxLength:20
    },
    image:{
      type: String,
      required: [true, "car image is required"]
    }
  },
    // ,
    // createdBy: {
    //   type: ObjectId,
    //   ref: 'user'
    // },
  
  { timestamps: true }
  )
  
  export const Cars = mongoose.model('cars', carsSchema)
  
  