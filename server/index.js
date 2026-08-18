const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const sequelize = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Hotel Management API (MySQL Edition)' });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menu', require('./routes/menuRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Database Connection & Sync
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database sync error:', err);
        if (process.env.NODE_ENV === 'development') {
            console.log('Continuing server start in development mode despite DB failure...');
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT} (Offline Mode)`);
            });
        }
    });
