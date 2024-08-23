import prismaClient from '../../prisma'

interface SensorDataRequest {
    equipment_id: string
    timestamp: Date
    value: number
}

class CreateSensorDataService {
    async execute({ equipment_id, timestamp, value }: SensorDataRequest) {       

        // Buscar equipment referente ao ID informado
        const equipment = await prismaClient.equipment.findUnique({ 
            where: {
                id: equipment_id
            },
        })
        
        // Verificar se equipment existe
        if (!equipment) {
            throw new Error('Inexistent equipment.')
        }
        
        // Verificar se name foi informado
        if (!equipment_id || equipment_id.trim() === '') {
            throw new Error('Invalid equipment ID.')
        }
        
        // Verificar se timestamp foi informado
        if (!timestamp) {
            throw new Error('Invalid timestamp.')
        }

        // Criar novo registro
        const sensorData = await prismaClient.sensorData.create({
            data: {
                equipment_id: equipment_id,
                timestamp: timestamp,
                value: value,
            },
        })

        return sensorData
    }
}

export { CreateSensorDataService }
