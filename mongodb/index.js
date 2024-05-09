import mongodb, {MongoClient} from 'mongodb';

export default async function getConnectDB() {
    const client = new MongoClient(process.env.MONGODB_URI);
    // const client = new MongoClient('mongodb://root:Od4Wzdan%40vkn@127.0.0.1:27017')
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