import { Router } from 'express'
import { getAllEmployees } from '../controllers/employee.controller.js'
const router = Router()
router
  .route('/')
  .get(getAllEmployees)

export default router
