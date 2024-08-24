import { Request, Response } from "express"
import { ListSensorDataService } from "../../services/sensor_data/ListSensorDataService"

class ListSensorDataController {
    async handle(req: Request, res: Response) {

        const listSensorDataService = new ListSensorDataService()
        const sensorData = await listSensorDataService.execute()

        return res.json(sensorData)

    }
}

export { ListSensorDataController }