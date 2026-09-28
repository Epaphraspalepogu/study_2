import { handleHealth } from '../server/handlers.js';

export default function health(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  return handleHealth(req, res);
}
