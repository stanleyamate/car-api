import { Router } from 'express'
import { createCar,getOneCar, getAllCars, updateCar, removeCar, uploadImg} from '../controllers/cars.controller.js'


const router = Router()

// primarily we these routes

// router.get('/api/cars', carsControllers.getcars)
// router.get('/api/cars:id', carsControllers.getOnecars)
// router.post('/api/cars', carsControllers.addcars)
// router.put('/api/cars/:id', carsControllers.updatecars)
// router.delete('/api/cars:id', carsControllers.deletecars)

router
  .route('/')
  .post(uploadImg,createCar)
  .get(getAllCars)
router
  .route('/:carId')
  .get(getOneCar)
  .put(updateCar)
  .delete(removeCar)

export default router