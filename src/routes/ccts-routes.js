import { cctsHandler } from '../controller/ccts-controller.js';

const routes = [
    {
        method: 'POST',
        path: '/ccts',
        handler: (request, reply) => {
            cctsHandler(request, reply);
        },
    },
];

export default routes;
