import { Request, Response } from 'express';
import { UploadCSVSensorDataService } from '../../services/sensor_data/UploadCSVSensorDataService';

class UploadCSVSensorDataController {
    async handle(req: Request, res: Response): Promise<Response> {
        const { file } = req;

        // Verificar se o arquivo foi enviado
        if (!file) {
            return res.status(400).json({ error: 'CSV file is required.' });
        }

        const uploadCSVSensorDataService = new UploadCSVSensorDataService();

        try {
            // Executar o serviço para processar o arquivo CSV
            await uploadCSVSensorDataService.execute(file.buffer);
            return res.status(200).json({ message: 'CSV data processed successfully.' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export { UploadCSVSensorDataController };
