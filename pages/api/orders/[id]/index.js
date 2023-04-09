import Order from "@/models/Order";
import db from "@/utils/db";

const handler = async (req, res) => {
    await db.connect();
    const order = await Order.findById(req.query.id);
    await db.disconnect();
    res.status(200).send(order);
}

export default handler;