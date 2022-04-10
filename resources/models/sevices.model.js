import mongoose from 'mongoose';
const servicesSchema = new mongoose.Schema(
  {
    text:String
  },
  { timestamps: true }
  )
  
  export const Services = mongoose.model('services', servicesSchema)
  
  