import {
    logout,
    authenticateToken,
    login,
    checkRole,
} from '../controller/auth-controller.js';
const routes = [
    {
        method: 'POST',
        url: '/logout',
        preHandler: authenticateToken,
        handler: (request, reply) => logout(request, reply),
    },
    {
        method: 'POST',
        url: '/login',
        handler: (request, reply) => login(request, reply),
    },
    {
        method: 'GET',
        url: '/protected',
        preHandler: checkRole,
        handler: (request, reply) => {
            return reply.send({ hello: 'world' });
        },
    },
];

export default routes;
