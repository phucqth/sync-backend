import Fastify from 'fastify';
import cors from '@fastify/cors';
import syncRoutes from '@src/routes/sync-routes.js';
import routes from '@src/routes/app-routes.js';
import authRoutes from '@src/routes/auth-routes.js';
import cctsRoutes from '@src/routes/ccts-routes.js';
import { apiDefineList } from '@src/utils/api-define.js';
import { apiHandler } from '@src/controller/sync-controller.js';

const fastify = Fastify({
    logger: true,
});

await fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
});
routes.forEach((route) => {
    fastify.route(route);
});
syncRoutes.forEach((route) => {
    fastify.route(route);
});
authRoutes.forEach((route) => {
    fastify.route(route);
});
cctsRoutes.forEach((route) => {
    fastify.route(route);
});

// Run the server!
fastify.listen({ port: 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    //todo: schedule sync data by interval time here
    // scheduleApiHandlers();
    fastify.log.info(`server listening on ${address}`);
});

async function scheduleApiHandlers() {
    await Promise.all(apiDefineList.map(apiHandler));
    setTimeout(scheduleApiHandlers, 300000);
}
