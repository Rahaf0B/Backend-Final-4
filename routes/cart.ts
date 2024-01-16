
//this is a dummy rout to test if my api works, will be deleted later
async function test(req: any, res: any) {
    try {
        res.status(200).send({ message: "we are at Cart test, server is running" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getCartInfo(req: any, res: any) {
    try {
        const token = req.header('Authorization');
        res.status(200).send(
            {
                function: "getCartInfo",
                token:token,
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function addToCart(req: any, res: any) {
    try {
        const token = req.header('Authorization');
        const productId=req.body.product_id;
        const quintity=req.body.quintity;
        res.status(200).send(
            {
                function: "addToCart",
                token:token,
                productId:productId,
                quintity:quintity
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export default {
    test,
    getCartInfo,
    addToCart,
}