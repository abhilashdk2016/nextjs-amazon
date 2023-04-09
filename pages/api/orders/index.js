import Order from "@/models/Order";
import db from "@/utils/db";
import { getSession } from "next-auth/react";

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