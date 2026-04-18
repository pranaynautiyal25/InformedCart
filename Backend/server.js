const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const edibleRoutes = require('./routes/edibleRoutes');
const aiRoutes=require('./routes/aiRoutes');


require('dotenv').config();



const app = express();
const port = process.env.port || 5000;

connectDB();

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true
}
));
app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/product', edibleRoutes);
app.use('/api/ai', aiRoutes);

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
