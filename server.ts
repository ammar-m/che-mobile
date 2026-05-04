import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/create-payment-intent', async (req, res) => {
    // This would normally use the Stripe SDK with a secret key
    // For this demo, we'll return a mock success
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body;
    
    console.log(`Payment intent requested for amount: ${amount}`);
    
    res.json({
      clientSecret: 'pi_mock_secret_' + Math.random().toString(36).substring(7),
      message: 'Payment intent created (Demo Mode)'
    });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
