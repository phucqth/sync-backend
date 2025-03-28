// import { createClient } from 'redis';
import Redis from 'ioredis';
import 'dotenv/config';

const redisClient = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
});

export default redisClient;
