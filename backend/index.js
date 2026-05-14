import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import playerRouter from './routes/player.js';
import matchesRouter from './routes/matches.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Validação da API key
if (!process.env.RIOT_API_KEY) {
  console.error('❌ RIOT_API_KEY não definida! Crie um arquivo .env com sua chave.');
  console.error('   Veja .env.example para referência.');
  process.exit(1);
}

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'https://rift-lens-front.vercel.app', 'https://rift-lens-front.vercel.app'],
  methods: ['GET', 'OPTIONS'],
  credentials: false,
}));
app.use(express.json());

// Logging de requisições
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rotas
app.use('/api/player', playerRouter);
app.use('/api/matches', matchesRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: true, status: 404, message: 'Rota não encontrada.' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: true, status: 500, message: 'Erro interno do servidor.' });
});

// app.listen(PORT, () => {
//   console.log(`✅ RIFT LENS Backend rodando em http://localhost:${PORT}`);
//   console.log(`   API Key: ${process.env.RIOT_API_KEY?.substring(0, 10)}...`);
// });

export default app;