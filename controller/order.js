
import generateShortId from "ssid";

function orderController (db) {
    const orderDB = db.collection('order');
    const imageDB = db.collection('image');

    orderDB.createIndex(
        { "published_date": 1 },
        { expireAfterSeconds: 7776000 }  // 3个月后文档过期
    );
    return {
            async createOrder (data) {
                const count = await orderDB.find({})?.toArray();
                const noteId = generateShortId();
                // data.index = count.length;
                if (data?.additional) {
                    data.additional = [{ noteId, value: data.additional, noteTime: new Date() }];
                }
                if (data?.roomInfo) {
                    Object.defineProperty(data, 'roomInfoStr', {
                        value: JSON.stringify(data?.roomInfo),
                        enumerable: true
                    });
                }
                data.published_date = new Date();
                return await orderDB.insertOne(data);
            },
            async fetchOrder ({filter, range, sort}) {
                const f = JSON.parse(filter);
                if (f?.q) {
                    const name = f?.q;
                    return await orderDB.find({
                        name: { $regex: new RegExp(`${name}`, 'i')}
                    }).sort({published_date: -1})
                        .project({
                            _id: 0,
                            additional: 0,
                        });
                }
                if (f?.order_item) {
                    const keyword = f?.order_item;
                    return await orderDB.find({
                        roomInfoStr: { $regex: new RegExp(`${keyword}`, 'i') }
                    }).sort({published_date: -1})
                        .project({
                            _id: 0,
                            additional: 0,
                        });
                }
                if (f?.stage) {
                    return await orderDB.find(f)
                        .sort({published_date: -1})
                        .project({
                            _id: 0,
                            additional: 0,
                            roomInfo: 0,
                        })
                        .limit(50);
                }
                return await orderDB.find({})
                    .sort({published_date: -1})
                    .project({
                        _id: 0,
                        additional: 0,
                        roomInfo: 0,
                    })
                    .limit(50);
            },
            updateOne: async (id, data) => {
                if (data?.roomInfo) {
                    Object.defineProperty(data, 'roomInfoStr', {
                        value: JSON.stringify(data?.roomInfo),
                        enumerable: true
                    });
                }
                return await orderDB.updateOne({id}, {
                    $set: {
                        // additional: data?.additional || '',
                        address: data?.address || '',
                        email: data?.email || '',
                        name: data?.name || '',
                        phone: data?.phone || '',
                        roomInfo: data?.roomInfo || {},
                        roomInfoStr: data?.roomInfoStr | '',
                        stage: data?.stage || 'ordered'
                    }
                }, {
                    upsert: true
                })
            },
            updatePosition: async (id, { index, stage }) => {
            const updateObj = {};
            if (index) updateObj.index = index;
            if (stage) updateObj.stage = stage;
            return await orderDB.updateOne({ id }, {
                $set: updateObj
            }, {
                upsert: true
            });
        },
            updateNote: async (id, orderData) => {
            const existed = await orderDB.findOne({id});
            const noteId = generateShortId();
            let noteArray = [];
            let newNoteObj;
            if (orderData?.type === 'img') {
                newNoteObj  = { noteId, type: orderData?.type, value: orderData?.fileId, noteTime: new Date() };
            } else {
                newNoteObj = { noteId, type: orderData?.type, value: orderData?.newNote, noteTime: new Date() };
            }
            if (existed?.additional) {
                noteArray = [newNoteObj, ...existed.additional]
            } else {
                noteArray = [newNoteObj];
            }
            return await orderDB.updateOne({ id }, {
                $set: {additional: noteArray}
            }, {
                upsert: true
            });

        },
            deleteNote: async (id, noteId) => {
            let needDeleteFileId = '';
            const selected = await orderDB.findOne({id});
            const newNoteList = selected.additional.filter((note) => {
                if (note.noteId === noteId) {
                    needDeleteFileId = note.value;
                }
                return note.noteId !== noteId;
            });
            if (needDeleteFileId) {
                await imageDB.deleteOne({ fileId: needDeleteFileId });
            }
            return await orderDB.updateOne({ id }, {
                $set: { additional: newNoteList }
            });
        },
            deleteOrder: async (id) => {
                const current = await orderDB.findOne({id});
                if (current?.additional?.length) {
                    current.additional.forEach(async ({ type, value }) => {
                        if (type === 'img') {
                            await imageDB.deleteOne({ fileId: value });
                        }
                    })
                }
            return await orderDB.deleteOne({id});
        },
            findOne: async (id) => {
                return await orderDB.findOne({id}, { projection: {_id: 0}});
            }
    }
}

export default orderController;
