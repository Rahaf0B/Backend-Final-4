
//this is a dummy rout to test if my api works, will be deleted later
async function test(req: any, res: any) {
    try {
        res.status(200).send({ message: "we are at Order test, server is running" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getOrdersInfo(req: any, res: any) {
    try {
        const token = req.header('Authorization');
        const orderStatus=req.params.order_status;
        res.status(200).send(
            {
                function: "getOrdersInfo",
                token:token,
                orderStatus:orderStatus
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export default {
    test,
    getOrdersInfo,
}