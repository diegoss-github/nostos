import Koa from 'koa';
const app = new Koa();

import cors from '@koa/cors';
import { bodyParser } from '@koa/bodyparser';
import koaRouter from './router';

app.use(cors())
   .use(bodyParser())
   .use(koaRouter.routes())
   .use(koaRouter.allowedMethods());


const port = 3000;

app.listen(port, () => {
	console.log('Server running on ' + port);
})


export default app;