import mongoose from 'mongoose'

const carListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50
    },
    description: String
  },
  { timestamps: true }
)

//carListSchema.index({ user: 1, name: 1 }, { unique: true })

export  const CarList = mongoose.model('carList', carListSchema)