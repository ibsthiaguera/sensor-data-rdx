import { Request, Response } from "express"
import { CreateEquipmentService } from "../../services/equipment/CreateEquipmentService"

class CreateEquipmentController {
    async handle(req: Request, res: Response) {

        const { name } = req.body
        const createEquipmentService = new CreateEquipmentService()

        const equipment = await createEquipmentService.execute({
            name,
        })

        return res.json(equipment)

    }
}

export { CreateEquipmentController }