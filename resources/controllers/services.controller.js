import { Services } from '../models/sevices.model.js';

export const getAllServices =async (req, res)=>{
  try {
    const doc = await Services.find().exec()
    res.status(200).json({doc:doc})
  } catch (error) {
      res.status(404).json({message : {msg:"Services not found",success: false}});
  }
}
export const createService = async (req, res)=>{

  const doc = await Services.create({service:req.body.service})
  if(!doc){
      res.status(404).json({message: {msg:"Services not found",success: false}})
  }
  res.status(200).json({message:{msg:"Service created",success:true},doc :doc});

}
export const updateService = async (req, res)=>{

  const doc = await Services.findOneAndUpdate({_id : req.params.id},req.body,
      { new: true })
  res.status(200).json({
      message :{msg:"service updated",success: true},
      doc:doc
  })

}
export const deleteService = async (req, res)=>{

  const targetId = req.params.id
  try {
    const doc = await Services
  .findOneAndRemove({
    _id: targetId,
    createdBy: req.user._id
  })
  .exec()
  if (!doc) {
    res.status(400).end()
  }
  res.status(200).json({message:{msg:"service deleted", success:true}, data: doc })
  } catch (err) {
    console.log(err)
  }
}