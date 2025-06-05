# 📬 Notification System

A full-stack backend system to send notifications (Email, SMS, In-App) using a message queue and REST API. Built with **Node.js**, **Express**, **PostgreSQL**, **RabbitMQ**, and **Mailtrap**.

---

## 🚀 Features

- Send Notifications via REST API
- Types: Email, SMS, In-App (extendable)
- Queued delivery using RabbitMQ
- Retries on failure (via `nack`)
- PostgreSQL for storing notification logs

---

## 📁 Project Structure

├── src/
│ ├── app.js
│ ├── index.js
│ ├── db.js
│ ├── routes/
│ │ └── notifications.js
│ |_ email.js
│ │
├── .env
├── package.json
└── docker-compose.yml


## 📦 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/notification-system.git
cd notification-system

### 2. Install dependencies

```bash
npm install

### 3. Create env file 

PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/notifications
RABBIT_URL=amqp://localhost
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password


### 4. start docker

```bash
docker-compose up -d


### 5. 5. Start the server
```bash
npx nodemon src/index.js

### 6. In another terminal, run the email worker:

```bash
node src/workers/email-worker.js