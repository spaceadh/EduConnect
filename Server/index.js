import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// Initialize express
const app = express();

// Express middleware that converts request body to JSON.
app.use(express.json());
app.use(cors());

// Import client routes

app.use('/auth', clientSignInRoutes);
app.use('/api', chatsRoutes);

import clientSignInRoutes from './routes/routes.client.js';
import chatsRoutes from './routes/routes.chats.js';

const port = process.env.PORT;
  // Start the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});