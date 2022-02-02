import Router from 'express'
import carListControllers from '../controllers/carList.controllers.js'

const router = Router()

router
  .route('/')
  .get(carListControllers.getMany)
  .post(carListControllers.createOne)
router
  .route('/:id')
  .get(carListControllers.getOne)
  .put(carListControllers.updateOne)
  .delete(carListControllers.removeOne)

export default router;