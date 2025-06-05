import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const conn = await amqp.connect(process.env.RABBIT_URL);
  const ch = await conn.createChannel();
  await ch.assertQueue("email_queue", { durable: true });

  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  ch.consume(
    "email_queue",
    async (msg) => {
      const notification = JSON.parse(msg.content.toString());
      console.log(" Sending email to:", notification.payload.to);

      try {
        await transporter.sendMail({
          from: "notifications@app.com",
          to: notification.payload.to,
          subject: notification.payload.subject,
          text: notification.payload.body,
        });

        console.log("Email sent:", notification.payload.to);
        ch.ack(msg);
      } catch (error) {
        console.error("Email failed", error);
        ch.nack(msg, false, true);
      }
    },
    { noAck: false }
  );
}

main();
