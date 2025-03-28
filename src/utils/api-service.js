import axios from 'axios';
import redisClient from '@utils/redis-client.js';
import 'dotenv/config';

const apiAuth = {
    username: 'API\\SYNCHRONIZER',
    password: 'Acca@2024',
};
export const getDataFromBC = async (url) => {
    const response = await axios.get(url, {
        auth: apiAuth,
    });
    const data = response.data;
    return data;
};
export const postDataToBC = async (url, data) => {
    const response = await axios.post(url, data, { auth: apiAuth });
    return response.data;
};
export const putDataToBC = async (url, data) => {
    const response = await axios.put(url, data, { auth: apiAuth });
    return response.data;
};
export const getConntectionStatus = async (url) => {
    const response = await axios.get(url, { auth: apiAuth });
    return response;
};
const getOAuth2Token = async () => {
    const oauth2Link = `https://login.microsoftonline.com/${process.env.APP_TENANT_ID}/oauth2/v2.0/token`;
    const body = {
        client_id: process.env.APP_CLIENT_ID,
        client_secret: process.env.APP_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: `${process.env.APP_BASE_URL}/.default`,
    };
    try {
        const res = await axios.post(oauth2Link, body, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        const { data } = res;
        return {
            status: 'success',
            data,
        };
    } catch (error) {
        return {
            status: 'error',
            data: error,
        };
    }
};
/**
 * Ensures that a valid access token is available for D365 API calls.
 * Checks the Redis cache for a valid token and if not available, retrieves a new one.
 * If there is an error during the retrieval, the error is thrown.
 * @returns {Promise<string>} A promise that resolves to the access token.
 */
const ensureAccessToken = async () => {
    // await client.connect();
    let token = '';
    let tokenTtl = 0;
    const expirationBuffer = 120;
    try {
        token = await redisClient.get('d365_token');
        tokenTtl = await redisClient.ttl('d365_token');
        console.log(tokenTtl);
        if (token === null) {
            console.log('Token is null or near expire, get new token');
            const tokenData = await getOAuth2Token();
            if (tokenData.status === 'error') {
                throw tokenData.data;
            }
            token = tokenData.data.access_token;
            const expiresIn = tokenData.data.expires_in;
            await redisClient.set(
                'd365_token',
                token,
                'EX',
                expiresIn - expirationBuffer
            );
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
    return token;
};

export const getValueFromAPI = async ({
    apiType,
    serviceName = 'BCServices',
    reqId = '06696126-844c-4b0c-a267-d8748f6f7a83',
    reqBody,
}) => {
    // let token = await ensureAccessToken();
    // const url = `${process.env.APP_BASE_URL}/v2.0/${process.env.APP_TENANT_ID}/${process.env.D365_ENVIRONMENT}/ODataV4/BCServices_OutService?company=${process.env.D365_COMPANY_ID}`;
    // if (token !== '' || token !== null) {
    //     const headers = {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${token}`,
    //     };
    //     const bodyData = JSON.stringify({
    //         _APIType: apiType,
    //         _ReqId: reqId,
    //         _ReqBody: reqBody,
    //     });
    //     try {
    //         const res = await axios.post(url, bodyData, { headers });
    //         const resData = res.data;
    //         return resData.value;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // } else {
    //     console.log('Token is empty or expired');
    // }
    //================================
    const url = `http://acca-dynbcdev01.api.local:7048/BC/ODataV4/${serviceName}_OutService?company=4DFF7CA1-A659-EF11-BFE7-6045BDE9B799`;
    const auth = {
        username: 'API\\SYNCHRONIZER',
        password: 'Acca@2025',
    };

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(
            `${auth.username}:${auth.password}`
        ).toString('base64')}`,
    };
    const bodyData = JSON.stringify({
        _APIType: apiType,
        _ReqId: reqId,
        _ReqBody: reqBody,
    });
    console.log(bodyData);
    try {
        const res = await axios.post(url, bodyData, { headers });
        const resData = res.data;
        return resData.value;
    } catch (error) {
        console.log(error);
    }
    //================================
};
