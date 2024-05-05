import mongodb, {MongoClient} from 'mongodb';

export default async function connectDB() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(process.env.DB_NAME);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}