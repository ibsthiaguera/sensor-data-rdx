import prismaClient from "../../prisma"

class ListSensorDataService {
    async execute() {
        
        const sensorData = await prismaClient.sensorData.findMany({
            select: {
                id: true,
                equipment_id: true,
                timestamp: true,
                value: true
            },
            orderBy: {
                timestamp: 'desc'
            }
        })

        return sensorData
    }
}

export { ListSensorDataService }