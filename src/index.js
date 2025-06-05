import dotenv from 'dotenv'
import app from './app.js'

dotenv.config()

const PORT = process.env.port || 3000;

app.listen(PORT, () => {
  console.log(`The app is listening at port ${PORT}`);
});