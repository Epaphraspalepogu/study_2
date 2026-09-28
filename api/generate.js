import { handleGenerate } from '../server/handlers.js';

export default function generate(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  return handleGenerate(req, res);
}
