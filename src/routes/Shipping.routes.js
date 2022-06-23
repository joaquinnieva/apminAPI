import express from 'express';
import jwt from 'jsonwebtoken';
const router = express.Router();

// User Model
import { Shippings } from '../models/Shipping.js';

// GET Shipping by id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Shippings.findOne({
      where: {
        id,
      },
    });
    res.json({ name: user.name, data: user.data }).end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }).end();
  }
});
// GET all Users
router.get('/', async (req, res, next) => {
  try {
    const shippings = await Shippings.findAll({
      atributes: ['id', 'author', 'title', 'data'],
    });
    res.json(shippings).end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }).end();
  }
});

// POST a new Shipping
router.post('/', async (req, res, next) => {
  const { author, title, data } = req.body;
  try {
    const newShip = await Shippings.create(
      {
        author,
        title,
        data
      },
      {
        fields: ['author', 'title', 'data'],
      }
    );
    return res.json(newShip).end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }).end();
  }
});

// EDIT a Shipping by ID
router.put('/:name', async (req, res, next) => {
  const { name } = req.params;
  const { data } = req.body;
  const authorization = req.get('authorization');
  let token = null;
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }
  const decodedToken = jwt.verify(token,'token');
  
  if (decodedToken && (name == decodedToken.name)) {
    try {
      const user = await Users.findOne({
        where: {
          name,
        },
      });

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

// DELETE a Shipping by ID
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const user = await Users.findByPk(id);
  if (user) {
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

//Middleware
router.use(async (error, req, res, next) => {
  console.log(error);
  res.status(400).end();
});

export default router;
