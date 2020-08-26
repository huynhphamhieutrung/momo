const objectiveService = require('../services/objective');
const buddyService = require('../services/buddy');
const {generateNewId} = require('../utils/old-id');

module.exports = (app) => {
  app.get('/users/:id/objectives/count', (req, res, next) => {
    const _id = generateNewId(req.params.id);
    buddyService
      .getShareModes(_id, req.headers.user._id)
      .then((shareModes) => objectiveService.count(_id, shareModes))
      .then((number) => res.send(number))
      .catch((error) => next(error));
  });
};
