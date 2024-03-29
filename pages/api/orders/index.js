import Order from "@/models/Order";
import db from "@/utils/db";

const handler = async (req, res) => {
    await db.connect();
    const newOrder = new Order({
        ...req.body.order,
        user: req.body.user._id
    });
    const order = await newOrder.save();
    await db.disconnect();
    res.status(201).send(order);
}

export default handler;