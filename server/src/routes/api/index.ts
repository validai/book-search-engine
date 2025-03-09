import { Router, type Request, type Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './api/index.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use('/api', apiRoutes);

router.use((req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, '../../client/build/index.html'));
});

export default router;