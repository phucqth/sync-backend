import appController from '../controller/app-controller.js';
import { getValueFromAPI } from '../utils/api-service.js';
const routes = [
    {
        method: 'GET',
        path: '/application-status',
        handler: appController.applicationStatus,
    },
    {
        method: 'GET',
        path: '/cloud-token',
        handler: async (request, reply) => {
            const { api } = request.query;
            const data = await getValueFromAPI({
                apiType: api,
                reqBody: '{}',
            });
            return reply.send(data);
        },
    },
];

export default routes;
