import { Router } from "express";
import amqp  from "amqplib"
import {pool} from "../db.js"


const notificationRouter = Router();
const EXCHANGE = "msg_exchange";
const routingKey = "send_msg";
const TYPE_KEYS = { email: "email", sms: "sms", inapp: "inapp" }


notificationRouter.post("/", async (req, res) => {
  const { userId, type, payload } = req.body;

  const client = await pool.connect();

  try {
    const result = await client.query(
      "INSERT INTO notification(user_id, type, payload) VALUES ($1 $2 $3) RETURNING *",
      [userId, type, payload]
    );
    const connection = await amqp.connect(process.env.RABBIT_URL);
    const channel = await connection.createChannel();

    const queue = `${type}_queue`;
    await channel.assertQueue(queue, { durable: true });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(result.rows[0])), {
      persistent: true,
    });

    res
      .status(200)
      .json({ message: "Notification queued", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Notification failed to queue" });
  } finally {
    client.release();
  }
});


notificationRouter.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    const result = await client.query(
      "SELECT * FROM notifications WHERE user_id = $1",
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  } finally {
    client.release();
  }
});

export default notificationRouter;