import { Services } from '../models/sevices.model.js';

export const getAllServices =async (req, res)=>{
  try {
    const doc = await Services.find().exec()
    res.status(200).json({doc:doc})
  } catch (error) {
      res.status(404).json({msg : "services not found"});
  }
}
export const createService = async (req, res)=>{

  const doc = await Services.create({service:req.body.service})
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

  const targetId = req.params.id
  const doc = await Services
  .findOneAndRemove({
    _id: targetId,
    createdBy: req.user._id
  })
  .exec()
  if (!doc) {
    res.status(400).end()
  }
  res.status(200).json({ data: doc })

}