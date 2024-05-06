import express from 'express';
const router = express.Router();


router.post('/login', (req, res) => {
    const { username, password } = req?.body?.data;
    console.log(username, password)
    if (username === 'mkc' && password === 'mkc') {
        console.log('hi')
        return res.status(200).send({ success: true });
    } else {
        return res.status(200).send({ success: false, message: 'invalid username or password' });

    }
});



export default router;
