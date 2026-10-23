import express from 'express';
import cors from 'cors';
import produtoRoutes from './routes/produtoRoutes.js';
import movimentacaoRoutes from './routes/movimentacaoRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Backend Node.js + Express subiu com sucesso!'));
app.get('/teste', (req, res) => res.send('API funcionando!'));

app.use('/produtos', produtoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);

app.use(errorHandler);

export default app;
