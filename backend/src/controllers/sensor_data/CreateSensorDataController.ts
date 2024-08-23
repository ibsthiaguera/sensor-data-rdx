import { Request, Response } from "express"
import { CreateSensorDataService } from "../../services/sensor_data/CreateSensorDataService"

class CreateSensorDataController {
    async handle(req: Request, res: Response) {

        const { equipment_id, timestamp, value } = req.body
        const createSensorDataService = new CreateSensorDataService()

        const sensorData = await createSensorDataService.execute({
            equipment_id, timestamp, value
        })

        return res.json(sensorData)

    }
}

export { CreateSensorDataController }