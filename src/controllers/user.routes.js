const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const userRepository = require('../models/user-repository');
const { validateBody } = require('./validation/route.validator');
const uuid = require('uuid');
const User = require("../models/user.model")

router.get('/', (req, res) => {
  res.send(userRepository.getUsers());
});

router.get('/:firstName', (req, res) => {
  const foundUser = userRepository.getUserByFirstName(req.params.firstName);

  if (!foundUser) {
    throw new Error('User not found');
  }

  res.send(foundUser);
});

router.post(
  '/',
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('password').notEmpty().isLength({ min: 5 }),
  async (req, res) => {
      validateBody(req);

      await User.create({id:uuid.v4(), firstName: req.body.firstName, lastName: req.body.lastName, password: req.body.password});
      res.status(201).end();
  });

router.put('/', async (req, res) => {
    await User.update({ lastName: "Doe" }, {
        where: {
            firstName: "Jean"
        }
    });
    res.status(204).end();
});

router.delete('/', async (req, res) => {
    await User.destroy({
        where: {
            firstName: req.body.firstName
        }
    })
    res.status(204).end();
});

exports.initializeRoutes = () => router;
