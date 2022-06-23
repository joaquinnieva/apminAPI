import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { sequelize } from './database.js';
import shipping from './routes/Shipping.routes.js';
import users from './routes/User.routes.js';

import './models/User.js';

const app = express();
// Database connection
async function api() {
  try {
    await sequelize.sync({force: false})
    // Settings
    app.set('port', process.env.PORT || 3001);

    // Middlewares
    app.use(morgan('dev'));
    app.use(express.json({ limit: '50mb' }));
    app.use(cors());

    // Routes
    app.use('/api/user', users);
    app.use('/api/shipping', shipping);

    // Static Files
    app.use(express.static(path.join(process.cwd(),'src', 'public')));

    // Starting the server
    app.listen(app.get('port'), () => {
      console.log(`||||  Server on port ${app.get('port')}  ||||`);
    });
  } catch (error) {
    console.error("Unable to connect to the db:",error)
  }
}

api()