import express from "express"
import cors from 'cors'

import 'dotenv/config'

import userRoute from './routes/users.js'
import productRoute from "./routes/products.js";
import orderRoute from "./routes/requests.js";
import orderGroupRoute from "./routes/ordersgroup.js";
import FinancierRouter from "./routes/Financiers.js";



const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cors());

app.use('/users', userRoute)
app.use('/products', productRoute)
app.use('/requested', orderRoute)
app.use('/orderGroup', orderGroupRoute)
app.use('/financier', FinancierRouter)
''


app.listen(3001, () => console.log('RODANDO SERVIDOR'))
