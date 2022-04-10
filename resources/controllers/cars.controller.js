import mongoose from 'mongoose';
// import { crudControllers } from '../../utils/crud.js'
import { Cars } from '../models/cars_model.js'
import multer from 'multer'
import { CarList } from '../models/carList_model.js'
    
 export const createCar = async(req, res)=>{

        // const {car_model, description, createdBy}= req.body;
        try{
            CarList.findById(req.body.carListId)
        }
        catch(e){
            res.status(500).json({message:"error occured", error: e})
        }
        const doc = await Cars.create({
            _id: new mongoose.Types.ObjectId(),
            car_model: req.body.car_model,
            image:req.file.path,
            description: req.body.description,
            createdBy: req.body.userId
        });
        doc.save().then(result=>{
        res.status(201).json(result); // 201:success in creation of resource
        }).catch (err=>{
            res.status(500).json({ message: "could not create", error: err });
        })
}
export const updateCar= async(req, res)=>{
    const targetId = req.params.carId
  const doc = await Cars
  .findOneAndUpdate(
    {
      _id: targetId,
      createdBy: req.body.userId
    },
    req.body,
    { new: true }
    )
    .exec()
    if (!doc) {
      res.status(400).end()
    }
    res.status(200).json({ data: doc })
}
export const getAllCars= async(req, res)=>{
    const targetId = req.params.carId
  const docs = await Cars
//   .find({createdBy: targetId})
  .find()
  .select('car_model createdBy _id image')
  .exec()
    if (!docs) {
      res.status(400).end()
    }
    docs.map(doc=>{
        return{
            car_model:doc.car_model,
            createdBy: doc.createdBy,
            _id: doc._id,
            image: doc.image
        }
    })
    // res.status(200).json({ data: doc, image: doc.image })
}
export const getOneCar = async(req, res)=>{
    const carId = req.params.carId
  const doc = await Cars
  .find()
  .select('car_model createdBy _id image').populate('createdBy', 'username plan')
  .exec()
    if (!doc) {
      res.status(400).end()
    }
    res.status(200).json({ data: doc, req_url :'http://localhost:3000/cars'})
}
export const removeCar = async (req, res)=>{
 try{
    const carId = req.params.carId
     const doc =await Cars.findById(carId)
     if(!doc){
         res.status(404).json({message:"car not found"})
     }
    await Cars
    .remove({_id: carId})
    .exec()
    res.status(200).json({message: "Car deleted", 
request:{
    type:"Post",
    req_url :'http://localhost:3000/cars'
} })
 }catch(e){
    res.status(500).json({message:"error occured", error: e})
 }
}



const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})
const fileFilter=(req, file, cb)=>{
    if(file.mimetype ==='image/jpeg' || file.mimetype ==='image/png'){
        cb(null, true)
    }
    else cb(null, false)
    
}
export const uploadImg = multer({
    storage:storage, 
    limits:{
        fileSize:1024 *1024 * 5
    },
     fileFilter: fileFilter
    }).single('image');

    