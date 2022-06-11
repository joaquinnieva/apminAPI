import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

// User Model
import { Users } from '../models/User.js';

// GET all Users
router.get('/', async (req, res, next) => {
  try {
    const users = await Users.findAll({
      atributes: ['id', 'name', 'data'],
    });
    res.json(users).end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }).end();
  }
});

// GET User by id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const { name, data } = await Users.findOne({
      where: {
        id,
      },
    });
    res.json({ name, data }).end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }).end();
  }
});

// POST a new User
router.post('/', async (req, res, next) => {
  const { name, password } = req.body;
  try {
    const newUser = await Users.create(
      {
        name,
        password,
      },
      {
        fields: ['name', 'password'],
      }
    );
    return res.json({ id:newUser.id, name, message: 'User created succesfully', }).end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }).end();
  }
});

// EDIT a User by ID
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;
  const authorization = req.get('authorization');
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }
  const decodedToken = jwt.verify(token,'token');
  
  if (decodedToken && (id == decodedToken.id)) {
    try {
      const user = await Users.findByPk(id);
      user.data = data;
      await user.save();
      res.json({
        message: 'User updated succesfully',
        data: user.data,
      }).end();
    } catch (error) {
      return res.status(500).json({ message: error.message }).end();
    }
  }else{
    res.status(400).json({
      message: 'User not updated succesfully, validate your credentials',
    }).end();
  }
});

// DELETE a User by ID
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const user = await Users.findByPk(id);
  if (user) {
    await Users.destroy({
      where: {
        id,
      },
    });
    await Users.destroy({
      where: {
        id,
      },
    });
    return res.sendStatus(204).json({ message: 'User deleted id:' + id }).end();
  }

  if (!user) {
    return res.status(500).json({ message: 'User not found' }).end();
  }
});

// POST to login User
router.post('/login', async (req, res, next) => {
  const { name, password } = req.body;
  const authorization = req.get('authorization');
  let token = null;

console.log(authorization,"auth")

  if (!authorization) {
    const userToLogin = await Users.findOne({
      where: {
        name,
      },
    });
    const userForToken = {
      id: userToLogin?.id,
      name,
      password
    };
    token = jwt.sign(userForToken, 'token');
    if (userToLogin.password == password) {
      res.send({ id:userToLogin.id, token }).end();
    }else {
      res.status(401).json({ status: 'Invalid data' }).end();
    }
  }if (authorization){console.log(authorization)
    let decodedToken = null;
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      token = authorization.substring(7);
      decodedToken = jwt.verify(token,'token');
      console.log("TOKEN=",decodedToken)
    }
    if (decodedToken.password == password) {
      res.send({ id: decodedToken.id, token }).end();
    } else {
      res.status(401).json({ status: 'Invalid data' }).end();
    }
  }
});

//Middleware
router.use(async (error, req, res, next) => {
  console.log(error);
  res.status(400).end();
});

export default router;
