import {RedisOptions} from 'ioredis';
import {Redis} from 'ioredis';

const redisOptions:RedisOptions = {
    host : '127.0.0.1',
    port : 6379,
    maxRetriesPerRequest : null
}

const connection = new Redis(redisOptions);

export default connection;