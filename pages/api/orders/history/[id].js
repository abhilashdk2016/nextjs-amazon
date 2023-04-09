import Order from "@/models/Order";
import db from "@/utils/db";


const handler = async (req, res) => {
  await db.connect();
  const orders = await Order.find({ user: req.query.id });
  await db.disconnect();
  res.send(orders);
};

export default handler;