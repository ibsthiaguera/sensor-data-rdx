import prismaClient from '../../prisma'

interface EquipmentRequest {
    name: string
}

class CreateEquipmentService {
    async execute({ name }: EquipmentRequest) {

        // Verificar se name foi informado
        if (!name || name.trim() === '') {
            throw new Error('Invalid name.')
        }

        // Buscar último equipment para encontrar o maior ID
        const lastEquipment = await prismaClient.equipment.findFirst({
            orderBy: {
                id: 'desc',
            },
        })

        // Gerar novo ID baseado no último ID
        let newId = 'EQ-00001' // ID padrão se não existir nenhum equipamento
        if (lastEquipment) {
            const lastIdNumber = parseInt(lastEquipment.id.split('-')[1], 10)
            newId = `EQ-${(lastIdNumber + 1).toString().padStart(5, '0')}`
        }

        // Criar novo equipamento com o ID gerado
        const equipment = await prismaClient.equipment.create({
            data: {
                id: newId,
                name: name,
            },
        })

        return equipment
    }
}

export { CreateEquipmentService }
