import mongodb, {MongoClient} from 'mongodb';
import { MONGODB_LINK } from '../const.js';
export default async function getConnectDB() {
    const client = new MongoClient(MONGODB_LINK)
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db('MKC_DB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

//Od4Wzdan@vkn
// mongosh admin --username root -p