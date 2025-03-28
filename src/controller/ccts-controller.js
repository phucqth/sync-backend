import Boom from 'boom';
import { PrismaClient } from '@root/prisma/app/generated/prisma/client/index.js';
const prisma = new PrismaClient();
const cctsHandler = async (request, reply) => {
    try {
        if (!request.body || !request.body.data) {
            return reply.send(Boom.badRequest('Invalid message data'));
        }

        const { data } = request.body;
        const { document_type } = data;

        if (document_type !== 3) {
            return reply.send(
                Boom.badRequest('Invalid message type, must be 3 for CCTS')
            );
        }

        await prisma.tbl_50236_qcs_references.create({
            data: {
                ...data,
            },
        });
        await prisma.$disconnect();
        return reply.send({ status: 'success' });
    } catch (error) {
        return reply.send(Boom.badRequest(error));
    }
};

export { cctsHandler };
