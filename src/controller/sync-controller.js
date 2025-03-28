import axios from 'axios';
import {
    executeQuery,
    getQueryString,
    transformISOToDateTime,
} from '@utils/db.js';
import _ from 'lodash';
import Boom from 'boom';
import { getValueFromAPI } from '@utils/api-service.js';
import { errorLogger } from '@utils/logger.js';
import { PrismaClient } from '@root/prisma/app/generated/prisma/client/index.js';
const prisma = new PrismaClient();
const apiHandler = async (api) => {
    try {
        const { name, main, childs, apiType, serviceName } = api;

        let mainTableName = main['table']['name'];

        const lastModified = await prisma[mainTableName].aggregate({
            _max: {
                system_modified_at: true,
            },
        });
        const reqBody = {
            PageSize: 100000,
            LastModifiedAt: lastModified._max.system_modified_at,
        };
        const value = await getValueFromAPI({
            apiType: apiType,
            serviceName: serviceName,
            reqBody: JSON.stringify(reqBody),
        });

        if (value === null || value === '') {
            console.error('No data from API or api have been crashed');
            return Boom.notFound('No data');
        }
        const {
            Data: data,
            // Status: status,
            // StatusCode: statusCode,
            // Description: description,
            // NextPage: nextPage,
            TotalEntry: totalEntry,
        } = JSON.parse(value);
        console.log(
            '\x1b[32m%s\x1b[0m',
            `Start sync ${name} - ${totalEntry} Item`
        );

        await insertData(data, main, childs);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        console.info(`-------|  DONE  |-------`);
    }
};

const remappingData = (data, fields) => {
    return Object.keys(fields).reduce((acc, key) => {
        if (key === 'created_date' || key === 'creation_date') {
            acc['created_date'] = new Date(data['CreatedDate']).toISOString();
        } else acc[key] = data[fields[key]];
        return acc;
    }, {});
};
const insertData = async (data, main, childs) => {
    try {
        for (const item of data) {
            const fields = main['table']['fields'];
            let mainTableName = main['table']['name'];
            const transformedData = remappingData(item, fields);

            if (prisma[mainTableName]) {
                await prisma[mainTableName].create({ data: transformedData });
            } else {
                console.error(
                    `Table ${mainTableName} is not defined in Prisma Client.`
                );
            }
            if (childs) {
                for (const child of childs) {
                    const childData = item[child.key] || [];
                    /* delete data if not existed in API*/
                    await clearNonExistedRec({
                        data: childData,
                        tableName: child.name,
                        parentKeys: main['table']['keys'],
                    });
                    for (const childItem of childData) {
                        const query = await handleData({
                            tableObject: child,
                            data: childItem,
                        });
                        queries.push(query);
                    }
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
};
const handleData = async ({ data, tableObject }) => {
    const isExisted = await isRecordExisted({
        tableName: tableObject['name'],
        values: data,
    });
    return getQueryString({
        tableObject: tableObject['table'],
        data: data,
        mode: isExisted ? 'update' : 'insert',
    });
};
const isRecordExisted = async ({ tableName, values }) => {
    try {
        const queryString = `SELECT EXISTS(SELECT 1 FROM ${tableName} WHERE system_id = '${values['system_id']}') AS recordExists`;
        const { rows } = await executeQuery(queryString);
        return rows[0].recordExists === 1;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const sftMessagesHandler = async (request, reply) => {
    try {
        if (!request.body || !request.body.data) {
            return reply.send(Boom.badRequest('Invalid message data'));
        }
        const { data } = request.body;
        const { messageType } = data;

        if (!_.some(validMessageType, ['messageType', messageType])) {
            return reply.send(Boom.badRequest('Invalid message type'));
        }

        const requiredFields = {
            '01': [
                'messageType',
                'sftDateTime',
                'productionOrderNo',
                'prodOrderLineNo',
                'fgNo',
                'fgName',
                'operationNo',
                'itemNo',
                'variantCode',
                'consumptQty',
                'unit',
                /* GAP 1.3 
				shift
				inputQtyMD
				unitOfMeasureCode
				locationCode
				binCode
				lotNo
				PkgNo
				traceId
				netWeight
				Notes

				*/
                'traceId',
            ],
            '02': [
                //
                'messageType',
                'sftDateTime',
                'productionOrderNo',
                'prodOrderLineNo',
                'fgNo',
                'fgName',
                'operationNo',
                'operatorNo',
                'operatorName',
                'workCenterNo',
                'machineCenterNo',
                'quantity',
                'shift',
                'stopCode',
                /* GAP 1.3
				Finished
				Notes
				 */
                //add by Canh
                'fromTime',
                'toTime',
            ],
            '03': [
                'messageType',
                'sftDateTime',
                'productionOrderNo',
                'prodOrderLineNo',
                'fgNo',
                'fgName',
                'operationNo',
                'itemNo',
                'variantCode',
                'unit',
                'workCenterNo',
                'machineCenterNo',
                'quantity',
                'quantityKG',
                'quantityM2',
                'quantityMD',
                'operatorNo',
                'operatorName',
                'shift',
                'stopCode',
                //Anh canh request them:
                'outWidth',
                'outSetNo',
                'outWinder',
                'outLaneNo',
                'outConnectNo',
                'outStatus',
                'outDate',

                /* GAP 1.3
				Scrap Quantity
				Scrap Code 
				Location Code 
				Bin Code
				Lot No.   
				Trace ID    
				Package No.    
				Finished   
				Notes 
  				*/
                'traceId',
            ],
            '04': [
                //Pusf scrap by a Canh
                'messageType',
                'sftDateTime',
                'productionOrderNo',
                'prodOrderLineNo',
                'fgNo',
                'fgName',
                'operationNo',
                'operatorNo',
                'workCenterNo',
                'machineCenterNo',
                'quantity',
                'stopCode',
                'itemNo',
                'shift',
                'unit',
                'netWeight',
                'grossWeight',
                'traceId',
                'scrapCode',
            ],
        };

        const fields = requiredFields[messageType] || [];
        const missingFields = fields.filter(
            (field) => data[field] === undefined
        );

        if (missingFields.length > 0) {
            return reply.send(
                Boom.badRequest('Missing fields: ' + missingFields.join(', '))
            );
        }
        /* -------------------------- insert in to db first ------------------------- */
        // const query = await buildInsertSftMessageQuery(fields, data);
        // await executeQuery(query);
        await prisma.tbl_sft_message.create({
            data: {
                ...data,
            },
        });
        await prisma.$disconnect();
        /* ---------------------------- force post to API --------------------------- */
        if (request.body.forcePost) {
            console.log('Force Post');
        }

        reply.send({
            status: 'success',
            message: 'SFT message inserted successfully',
        });
    } catch (error) {
        return reply.send(Boom.badRequest(error));
    }
};

const getUnpostedSftMessages = async () => {
    const queryString = `SELECT * FROM tbl_sft_message WHERE posted = false`;
    const { rows } = await executeQuery(queryString);
    return rows;
};
const getSFTMessages = async () => {
    const queryString = `SELECT * FROM tbl_sft_message`;
    const { rows } = await executeQuery(queryString);
    return rows;
};

const pushSFTMessage = async (reply) => {
    try {
        const url = `http://192.168.109.25:7048/BC/api/ACCA/PROD/v2.0/sftMessages`;
        const apiAuth = {
            username: 'api\\phuc.thuong',
            password: 'Fucryu@3112',
        };
        const decimalFields = [
            'consumptQty',
            'quantity',
            'quantityKG',
            'quantityM2',
            'quantityMD',
            'outWidth',
            'outSetNo',
            'outLaneNo',
            'outConnectNo',
            'outStatus',
            'netWeight',
            'grossWeight',
        ];
        const dateFields = ['outDate'];

        const messages = await getUnpostedSftMessages();
        console.log(messages);
        if (messages.length === 0)
            return reply.send({
                status: 'success',
                message: 'Nothing to post',
            });
        // return reply.send({ data: messages });
        const now = new Date().toISOString();
        const dateTimeNow = transformISOToDateTime(now);
        // const promises = [];
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const errorText = message['errorText'];
            console.log(errorText);

            decimalFields.forEach((field) => {
                message[field] = parseFloat(message[field]);
            });
            dateFields.forEach((field) => {
                message[field] = new Date(message[field])
                    .toISOString()
                    .split('T')[0];
            });
            const finalPushData = _.omit(message, [
                'posted',
                'error',
                'postedDateAndTime',
                'error',
                'errorText',
            ]); //remove unnecessary fields
            try {
                const res = await axios.post(url, finalPushData, {
                    auth: apiAuth,
                });
                if (res.status === 201) {
                    await executeQuery(
                        `UPDATE tbl_sft_message SET posted = 1 , postedDateAndTime = '${dateTimeNow}' WHERE no = ${message.no} `
                    );
                }
            } catch (error) {
                const status = {
                    time: dateTimeNow,
                    status: error['response']['status'],
                    message: error['response']['statusText'],
                };
                let insertError = [];
                if (
                    errorText !== null &&
                    errorText !== undefined &&
                    errorText !== ''
                ) {
                    insertError = JSON.parse(errorText);
                }
                insertError.push(status);
                await executeQuery(
                    `UPDATE tbl_sft_message SET  errorText = '${JSON.stringify(
                        insertError
                    ).replace(/'/g, "\\'")}' WHERE no = ${message.no}`
                );

                return reply.send(status);
            }
        }

        return reply.send({
            status: 'success',
            message: 'All SFT messages posted successfully',
        });
    } catch (error) {
        console.log(error);
        return;
    }
};

export {
    apiHandler,
    pushSFTMessage,
    sftMessagesHandler,
    getUnpostedSftMessages,
    getSFTMessages,
};
const validMessageType = [
    {
        messageType: '01',
        messageName: 'NVL',
    },
    {
        messageType: '02',
        messageName: 'Time',
    },
    {
        messageType: '03',
        messageName: 'Output',
    },
    {
        messageType: '04',
        messageName: 'Scrap',
    },
];
