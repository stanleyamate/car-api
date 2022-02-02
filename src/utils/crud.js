export const getOne = model => async (req, res) => {
  const id = req.params.id
  const userId = req.user._id
  const doc = await model.findOne({ _id: id, createdBy: userId }).exec()
  if (!doc) {
    res.status(404).end()
  }
  res.status(200).json({ data: doc })
}

export const getMany = model => async (req, res) => {
  const docs = await model.find({ createdBy: req.user }).exec()
  if (!docs) {
    res.status(404).end()
  }
  res.json({ data: docs })
}

export const createOne = model => async (req, res) => {
  try {
    const doc = await model.create({ ...req.body })
    res.status(201).json({ data: doc }) // 201:success in creation of resource
  } catch (e) {
    res.status(404).json({ message:"could not create",error: e})
  }
}

export const updateOne = model => async (req, res) => {
  const targetId = req.params.id
  const doc = await model
  .findOneAndUpdate(
    {
      _id: targetId,
      createdBy: req.user._id
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
  
  export const removeOne = model => async (req, res) => {
    const targetId = req.params.id
    const doc = await model
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
  
  export const crudControllers = model => ({
    removeOne: removeOne(model),
    updateOne: updateOne(model),
    getMany: getMany(model),
    getOne: getOne(model),
    createOne: createOne(model)
  })
  