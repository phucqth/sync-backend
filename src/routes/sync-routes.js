import { apiDefineList } from '../utils/api-define.js';
import Boom from 'boom';
import _ from 'lodash';
import {
    apiHandler,
    getSFTMessages,
    getUnpostedSftMessages,
    pushSFTMessage,
    sftMessagesHandler,
} from '../controller/sync-controller.js';

const routes = [
    {
        method: 'GET',
        path: '/apis',
        handler: (request, reply) => {
            try {
                reply.send(apiDefineList);
            } catch (error) {
                reply.send(Boom.badRequest(error));
            }
        },
    },
    {
        method: 'GET',
        path: '/sync',
        handler: async (request, reply) => {
            try {
                const { api } = request.query;
                const selectedAPI = _.filter(
                    apiDefineList,
                    (item) => item.name === api
                );
                await apiHandler(selectedAPI[0]);
                reply.send({ status: 'success' });
            } catch (error) {
                reply.send(Boom.badRequest(error));
            }
        },
    },
    {
        method: 'POST',
        path: '/sft-message',
        handler: (request, reply) => {
            sftMessagesHandler(request, reply);
        },
    },

    {
        method: 'GET',
        path: '/sft-messages',
        handler: async (request, reply) => {
            const messages = await getSFTMessages();
            const resData = {
                status: 'success',
                data: messages,
            };
            reply.send(resData);
        },
    },
    {
        method: 'GET',
        path: '/test',
        handler: async (request, reply) => {
            await pushSFTMessage(reply);
        },
    },
];

export default routes;
