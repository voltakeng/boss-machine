const minionsRouter = require('express').Router();

module.exports = minionsRouter;

const { 
  addToDatabase,
  getAllFromDatabase,
  getFromDatabaseById,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require('./db');

minionsRouter.param('minionId', (req, res, next, id) => {
  const minionData = getFromDatabaseById('minions', id); 
  if (minionData){ 
    req.minionData = minionData; 
    next(); 
  } else {
    res.status(404).send('Not Found');
  }
});

minionsRouter.get('/', (req, res, next) => {
  res.send(getAllFromDatabase('minions'));
});

minionsRouter.get('/:minionId', (req, res, next) => {
  res.send(req.minionData); 
});

minionsRouter.put('/:minionId', (req, res, next) => {
  let updatedMinion = updateInstanceInDatabase('minions', req.body);
  res.send(updatedMinion);
});

minionsRouter.delete('/:minionId', (req, res, next) => {
  let deleteSucess = deleteFromDatabasebyId('minions', req.minionData.id)
  if (deleteSucess) {
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

minionsRouter.post('/', (req, res, next) => {
  const newMinion = addToDatabase('minions', req.body)
  res.status(201).send(newMinion);
});

minionsRouter.get('/:minionId/work', (req, res, next) => {
  const works = getAllFromDatabase('work'); 
  const work = works.filter((w) => {
    return w.minionId === req.minionData.id
  });
  res.send(work); 
});

minionsRouter.post('/:minionId/work', (req, res, next) => {
  const workToAdd = req.body;
  workToAdd.minionId = req.params.minionId;
  const createdWork = addToDatabase('work', workToAdd);
  res.status(201).send(createdWork);
});

minionsRouter.param('workId', (req, res, next, id) => {
  const work = getFromDatabaseById('work', id);
  if (work) {
    req.work = work;
    next();
  } else {
    res.status(404).send();
  }
});

minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
  if (req.params.minionId !== req.body.minionId) {
    res.status(400).send();
  } else {
    updatedWork = updateInstanceInDatabase('work', req.body);
    res.send(updatedWork);
  }
});

minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
  const deleted = deleteFromDatabasebyId('work', req.params.workId);
  if (deleted) {
    res.status(204);
  } else {
    res.status(500);
  }
  res.send();
});