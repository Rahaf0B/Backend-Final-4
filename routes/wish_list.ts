async function addToWishlist(req: any, res: any) {
    try {
        const token = req.header('Authorization');
        const productId=req.body.product_id;
        res.status(200).send(
            {
                function: "addToWishlist",
                token:token,
                productId:productId
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
export default {
    addToWishlist
}