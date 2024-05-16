import connectDB from "../mongodb/index.js";
function imageController (db) {
    const imageDB = db.collection('image');
    // imageDB.createIndex(
    //     { "published_date": 1 },
    //     // { expireAfterSeconds: 10 }
    //     { expireAfterSeconds: 2630016 }  // 3个月后文档过期
    // );
    return {
        create: async (data) => {
            data.published_date = new Date();
            return await imageDB.insertOne(data);
        },
        fetch: async (fileId) => {
            return await imageDB.findOne({ fileId });
        },
        update: async (fileId, data) => {
            data.published_date = new Date();
            return await imageDB.replaceOne({fileId}, data);
        },
        delete: async (fileId) => {
            return await imageDB.deleteOne({fileId});
        },
        // fetchUnconfirmedMessage: async () => {
        //     return await imageDB.find({ confirm: false });
        // },
        // update: async ({ id, confirm }) => {
        //     return await imageDB.updateOne({id}, {
        //         $set: {
        //             confirm
        //         }})
        // },
    }
}

export default imageController;