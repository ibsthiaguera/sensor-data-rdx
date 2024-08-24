import { Request, Response } from "express"
import { ListEquipmentService } from "../../services/equipment/ListEquipmentService"

class ListEquipmentController {
    async handle(req: Request, res: Response) {

        const listEquipmentService = new ListEquipmentService()
        const response = await listEquipmentService.execute()

        const equipments = response.map(equipment => {
            return {
                ...equipment
            }
        })

        return res.json(equipments)

    }
}

export { ListEquipmentController }