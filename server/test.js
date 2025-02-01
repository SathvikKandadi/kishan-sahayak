const mongoose = require('mongoose');
const dotenv = require('dotenv');

mongoose.set('debug', true);

dotenv.config();

const url = process.env.URI;


mongoose.connect(`${url}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
