/* ************************************************************************* */
/*                           message-router.js                               */
/*  HTTP Endpoints for the user - REST API                                   */
/*                                                                           */
/*  Method  |  url                                                           */
/*  POST    |  /                                                             */
/*  GET     |  /                                                             */
/*  GET     |  /:id                                                          */
/*  PATCH   |  /:id                                                          */
/*  DELETE  |  /:id                                                          */
/*                                                                           */
/* ************************************************************************* */
const express = require('express');
const router = express.Router();

const { handleAsyncError } = require('../errors/error-handler');
const { checkId, denyQueryString } = require('../utils/utils-router');
const controller = require('./message-controller');

router.post(
  '/',
  handleAsyncError(async (req, res, _next) => {
    let newMessage = await controller.create(req.body);
    res.status(201).json(newMessage);
  }),
);

router.get(
  '/',
  handleAsyncError(async (req, res, _next) => {
    let messages;
    if (Object.keys(req.query).length > 0)
      messages = await controller.getFiltered(req.query);
    else messages = await controller.getAll();

    res.status(200).json(messages);
  }),
);


router.use('/:_id', checkId);
router.use('/:_id', denyQueryString);

router.get(
  '/:_id',
  handleAsyncError(async (req, res, _next) => {
    res.status(200).json(await controller.getById(req.params._id));
  }),
);

router.delete(
  '/:_id',
  handleAsyncError(async (req, res, _next) => {
    await controller.deleteById(req.params._id);
    res.status(204).send();
  }),
);

router.patch(
  '/:_id',
  handleAsyncError(async (req, res, _next) => {
    res.status(200).json(await controller.update(req.params._id, req.body));
  }),
);

router.delete('/', (_req, res, _next) => {
  res
    .status(405)
    .json({ code: 405, message: 'not allowed to delete messages-collection' });
});

router.patch('/', (_req, res, _next) => {
  res
    .status(405)
    .json({ code: 405, message: 'not allowed to patch messages-collection' });
});

module.exports = router;
