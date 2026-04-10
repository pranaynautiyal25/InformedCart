const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();



const app = express();
const port = process.env.port || 5000;

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
