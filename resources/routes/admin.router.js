import { Router } from 'express'
  import { getOneUser,getAllActiveUsers,removeUser,updateUser, getOneService, getAllServices,createService,updateService,deleteService } from '../controllers/Admin.controller.js';

const router = Router()

//user router
router
  .route('/users')
  .get(getAllActiveUsers)
router
  .route('/users/:id')
  .get(getOneUser)
  .patch(updateUser)
  .delete(removeUser)
  //service router
router
  .route('/service')
  .get(getAllServices)
  .post(createService)
router
  .route('/service/:id')
  .get(getOneService)
  .put(updateService)
  .delete(deleteService)
  

export default router