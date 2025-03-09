import type { Request, Response } from 'express';
import express from 'express';
import * as path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debugging Statement - Check Routes Directory
console.log('📂 Routes directory:', __dirname);

// Serve up React frontend in production
router.use('/api', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

export default router;