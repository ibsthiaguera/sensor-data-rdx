import prismaClient from '../../prisma'

class ListEquipmentService {
    async execute() {
        const equipmentData = await prismaClient.equipment.findMany({
            include: {
                sensor_data: {
                    orderBy: { timestamp: 'asc' }, // Include sensor_data with 'asc' order by timestamp
                },
            },
        })

        return equipmentData
    }
}

export { ListEquipmentService }
