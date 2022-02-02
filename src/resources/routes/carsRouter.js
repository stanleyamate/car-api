import { Router } from 'express'
import carsControllers from '../controllers/cars.controller.js'

const router = Router()

// primarily we these routes

// router.get('/api/cars', carsControllers.getcars)
// router.get('/api/cars:id', carsControllers.getOnecars)
// router.post('/api/cars', carsControllers.addcars)
// router.put('/api/cars/:id', carsControllers.updatecars)
// router.delete('/api/cars:id', carsControllers.deletecars)

router
  .route('/')
  .get(carsControllers.getMany)
  .post(carsControllers.createOne)
router
  .route('/:id')
  .get(carsControllers.getOne)
  .put(carsControllers.updateOne)
  .delete(carsControllers.removeOne)

export default router