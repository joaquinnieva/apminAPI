import express from 'express';
const router = express.Router();

// Ship Model
import { Shippings } from '../models/Shipping.js';

// GET Shipping by id
router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const ship = await Shippings.findOne({
      where: {
        id,
      },
    });
    res.json( ship ).end();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }).end();
  }
});
// GET all Ships
router.get('/author/:author', async (req, res, next) => {
  const { author } = req.params;
  try {
    const shippings = await Shippings.findAll({
      where: {
        author,
      },
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
router.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;
    try {
      const ship = await Shippings.findOne({
        where: {
          id,
        },
      });

      ship.data = data;
      await ship.save();
      res.json({
        message: 'Ship updated succesfully',
        ship: ship,
      }).end();
    } catch (error) {
      return res.status(500).json({ message: error.message }).end();
    }
});

// DELETE a Shipping by ID
router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  const ship = await Shippings.findByPk(id);
  if (ship) {
    await Shippings.destroy({
      where: {
        id,
      },
    });
    return res.status(204).json({ message: 'Shipping deleted id:' + id }).end();
  }
  if (!ship) {
    return res.status(500).json({ message: 'Shipping not found' }).end();
  }
});

//Middleware
router.use(async (error, req, res, next) => {
  console.log(error);
  res.status(400).end();
});

export default router;
