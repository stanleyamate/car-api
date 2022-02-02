import mongoose from 'mongoose';
const ObjectId = mongoose.SchemaTypes.ObjectId
const carsSchema = new mongoose.Schema(
  {
    car_model:  { 
      type: String,
      required: [true,"car model must be filled"], trim:true, maxLength:20
    },
    choose_plan :  { 
      type: String,
      options: ["30days", "3months", "6months", "1year"],
      default : "30days"
    },
    due: Date,
    image:{
      type: String
      // required: [true, "car image is required"]
    },
    createdBy: {
      type: ObjectId,
      ref: 'user',
      required: false
    },
    list: {
      type: ObjectId,
      ref: 'carList',
      required: false
    }
  },
  { timestamps: true }
  )
  
  carsSchema.index({ carList: 1, name: 1 }, { unique: true })
  export const Cars = mongoose.model('cars', carsSchema)
  
  