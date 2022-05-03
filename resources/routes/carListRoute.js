import Router from 'express'
import getMany from '../controllers/carList.controllers.js'

const router = Router()

router
  .route('/')
  .get(getMany)
router
  .route('/:id')
export default router;