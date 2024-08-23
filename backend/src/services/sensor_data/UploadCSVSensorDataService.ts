import prismaClient from '../../prisma'
import csvParser from 'csv-parser'
import { Readable } from 'stream'

interface CsvRow {
    equipmentId: string
    timestamp: string
    value: string
}

class UploadCSVSensorDataService {
    async execute(fileBuffer: Buffer) {
        const rows: CsvRow[] = []
        const errors: string[] = []

        const readableFile = new Readable()
        readableFile.push(fileBuffer)
        readableFile.push(null)

        // Ler e parsear o arquivo CSV
        readableFile
            .pipe(csvParser({ separator: ';' }))
            .on('data', (row: CsvRow) => {
                rows.push(row)
            })
            .on('end', async () => {
                for (const row of rows) {
                    const { equipmentId, timestamp, value } = row

                    // Verificar se os campos estão presentes
                    if (!equipmentId || !timestamp || !value) {
                        errors.push(`Invalid data: ${JSON.stringify(row)}`)
                        continue
                    }

                    try {
                        // Buscar equipment referente ao ID informado
                        const equipment =
                            await prismaClient.equipment.findUnique({
                                where: {
                                    id: equipmentId,
                                },
                            })

                        // Verificar se equipment existe
                        if (!equipment) {
                            errors.push(`Inexistent equipment: ${equipmentId}`)
                            continue
                        }

                        // Inserir dados no banco
                        await prismaClient.sensorData.create({
                            data: {
                                equipment_id: equipmentId,
                                timestamp: new Date(timestamp),
                                value: parseFloat(value),
                            },
                        })
                    } catch (error) {
                        errors.push(
                            `Error inserting data: ${JSON.stringify(row)} - ${error.message}`
                        )
                    }
                }

                // Retornar erros, se houver
                if (errors.length > 0) {
                    throw new Error(
                        `CSV upload completed with errors: ${errors.join('; ')}`
                    )
                }
            })
            .on('error', (error) => {
                throw new Error(`Error parsing CSV: ${error.message}`)
            })
    }
}

export { UploadCSVSensorDataService }
