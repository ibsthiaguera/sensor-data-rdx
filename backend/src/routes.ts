import { Router, Request, Response } from 'express'
import multer from 'multer'

import { isAuthenticated } from './middlewares/isAuthenticated'

import { CreateEquipmentController } from './controllers/equipment/CreateEquipmentController'
import { ListEquipmentController } from './controllers/equipment/ListEquipmentController'

import { CreateSensorDataController } from './controllers/sensor_data/CreateSensorDataController'
import { ListSensorDataController } from './controllers/sensor_data/ListSensorDataController'
import { UploadCSVSensorDataController } from './controllers/sensor_data/UploadCSVSensorDataController'

import { AuthUserController } from './controllers/user/AuthUserController'
import { CreateUserController } from './controllers/user/CreateUserController'
import { DetailLoggedUserController } from './controllers/user/DetailLoggedUserController'

const router = Router()
const upload = multer()

// -- Routes EQUIPMENT --
router.get('/equipment', isAuthenticated, new ListEquipmentController().handle)
router.post('/equipment', isAuthenticated, new CreateEquipmentController().handle)

// -- Routes SENSOR DATA --
router.get('/sensor_data', isAuthenticated, new ListSensorDataController().handle)
router.post('/sensor_data', new CreateSensorDataController().handle)
router.post('/sensor_data/upload', isAuthenticated, upload.single('file'), new UploadCSVSensorDataController().handle);

// -- Routes USER --
router.get('/me', isAuthenticated, new DetailLoggedUserController().handle)
router.post('/auth', new AuthUserController().handle)
router.post('/user', new CreateUserController().handle)

export { router }
