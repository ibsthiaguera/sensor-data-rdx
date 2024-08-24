import prismaClient from "../../prisma"

class ListEquipmentService {
    async execute() {
        
        const sensorData = await prismaClient.equipment.findMany({
            include: {
                sensor_data: true
            }
        })

        return sensorData
    }
}

export { ListEquipmentService }