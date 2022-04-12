import { User } from '../models/user.model.js';
import { Services } from '../models/sevices.model.js';

export  const getOneUser = async(req, res)=>{
    const id =req.params.id;
    const doc = await User.findOne({ _id:id
    }).exec();
    if (!doc) {
        res.status(404).end();
    }
    res.status(200).json({ data: doc });
}
export const getAllActiveUsers = async(req, res)=>{
    const doc = await User.find({ isActive:true }).exec();
    if (!doc) {
        res.status(404).end();
    }
    res.status(200).json({ data: doc });
}
export const updateUser = async (req, res) => {
    const id =req.params.id;
    var { isActive, plan} = req.body;
    if(plan ==="none"){
        isActive= false;
    }else{
        isActive=true
    }
    
    try {
        const doc = await User
        .findOneAndUpdate(
            { _id : id},req.body, { new: true }
            )
            .exec()
            if (!doc) {
                res.status(400).end()
            }  
            res.status(200).json({ data: doc })
    } catch(error) {
        console.log(error)
    }
}
    
    export const removeUser =async (req, res) => {
        const id =req.params.id;
        const doc = await User
        .findOneAndRemove({
            _id : id
        })
        .exec()
        if (!doc) {
            res.status(400).end()
        }
        res.status(200).json({ data: doc })
    }


    //service crude
    export  const getOneService = async(req, res)=>{
        const id =req.params.id;
        const doc = await Services.findOne({ _id:id
        }).exec();
        if (!doc) {
            res.status(404).end();
        }
        res.status(200).json({ data: doc });
    }

    export const getAllServices =async (req, res)=>{
  try {
    const doc = await Services.find().exec()
    res.status(200).json({doc:doc})
  } catch (error) {
      res.status(404).json({msg : "services not found"});
  }
}
export const createService = async (req, res)=>{

  const doc = await Services.create({ ...req.body })
  if(!doc){
      res.status(404).json({msg: "not found"})
  }
  res.status(200).json({doc :doc});
}
export const updateService = async (req, res)=>{

  const doc = await Services.findOneAndUpdate({_id : req.params.id},req.body,
      { new: true })
  res.status(200).json({
      message :"service updated",
      doc:doc
  })
}
export const deleteService = async (req, res)=>{

  const id = req.params.id
  const doc = await Services
  .findOneAndRemove({
    _id: id
  })
  .exec()
  if (!doc) {
    res.status(400).end()
  }
  res.status(200).json({ data: doc })
}


    
    