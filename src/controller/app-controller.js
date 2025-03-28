import Boom from 'boom';
import { getConntectionStatus } from '@utils/api-service.js';
import 'dotenv/config';
const login = (request, reply) => {
    try {
        const { username, password } = request.body;
        if (username !== 'username' || password !== 'password')
            return reply.send(Boom.unauthorized('Invalid credentials'));
        reply.send({ hello: 'world' });
    } catch (error) {
        reply.send(Boom.badRequest(error));
    }
};
const changePassword = (request, reply) => {
    try {
        if (request.headers.token !== 'token') {
            return reply.send(Boom.unauthorized());
        }
    } catch (error) {
        throw Boom.boomify(error);
    }
};

const register = (request, reply) => {
    reply.send({ hello: 'world' });
};
const applicationStatus = async (request, reply) => {
    try {
        const d365Connection = await getConntectionStatus(
            'http://192.168.109.25:7048/BC/api/ACCA/PROD/v2.0'
        );
        const { status, statusText } = d365Connection;
        console.log({ status, statusText });
        reply.send({
            applicationStatus: { status, statusText },
        });
    } catch (error) {
        const { message, status } = error;
        reply.send({
            applicationStatus: { status: status, statusText: message },
        });
    }
};

export default {
    applicationStatus,
};
