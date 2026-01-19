import "dotenv/config"; // Variables de entorno
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from "./middlewares/errorHandler";

const PORT = process.env.PORT || 3001; // Puerto del servidor

const app = express();

app.use(helmet()); // Seguridad de las cabeceras HTTP
app.use(cors({
    origin: "*"
    // origin: ["http://localhost:4200"]
}));
app.use(express.json()); // Middleware que transforma la req.body en un objeto JSON
app.use(errorHandler);
// Esta es la parte que te falta:
app.get('/', (_req: Request, res: Response) => {
  res.send('¡Servidor Inicio correctamente!');
});
app.use('/api', routes);
app.use(morgan('dev'));



app.listen(PORT, () => {
    console.log(`Server is running on PORT success: ${PORT}`);
});