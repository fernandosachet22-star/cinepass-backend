
import express from 'express';
import cors from 'cors';
import filmeRoutes from './routes/filmeRoutes';
import sessaoRoutes from './routes/sessaoRoutes';
import salaRoutes from './routes/salaRoutes';
import reservaRoutes from './routes/reservaRoutes';
import compraRoutes from './routes/CompraRoutes';
import ingressoRoutes from './routes/IngressoRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensagem: 'API CinePass funcionando!' });
});

app.use('/filmes', filmeRoutes);
app.use('/sessoes', sessaoRoutes);
app.use('/salas', salaRoutes);
app.use('/reservas', reservaRoutes);
app.use('/compras', compraRoutes);
app.use('/ingressos', ingressoRoutes);

export default app;
