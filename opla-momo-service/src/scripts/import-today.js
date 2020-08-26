const fs = require('fs');
const DailyAction = require('../models/daily-action');
const logger = require('../utils/logger');
const database = require('../utils/database');
const {generateNewId} = require('../utils/old-id');

const arrFields = [
  'id',
  'objective_id',
  'name',
  'date',
  'reminder',
  'finished_date',
];

fs.readFile('objective.sql', 'utf8', function(err, data) {
  if (err) {
    throw err;
  }

  const regex = /INSERT INTO `opla_daily_action` VALUES (.*);/;
  let text = data.match(regex)[0];
  text = text.substr(40);
  text = text.substr(0, text.length - 2);
  const arr = text.split('),(');
  const dailyActions = [];

  arr.map(str => {
    const dailyAction = new DailyAction();

    for (const field of arrFields) {
      let data;

      if (str.startsWith('NULL')) {
        str = str.substr(5);
        data = null;
      } else if (str.startsWith('\'')) {
        str = str.substr(1);
        const index = str.indexOf('\',');
        data = str.substr(0, index);
        str = str.substr(index + 2);
      } else {
        const index = str.indexOf(',');
        data = +str.substr(0, index);
        str = str.substr(index + 1);
      }

      if ('objective_id' === field) {
        dailyAction.objective = generateNewId(data);
      } else if ('id' === field) {
      } else if ('finished_date' === field) {
        dailyAction.finishedDate = data;
      } else if (
        [
          'id', 'objective_id', 'name', 'date', 'reminder', 'finished_date',
        ].indexOf(field) >= 0
      ) {
        dailyAction[field] = data;
      }
    }

    dailyActions.push(dailyAction);
  });

  database.init(
    process.env.MONGODB_USERNAME,
    process.env.MONGODB_PASSWORD,
    process.env.MONGODB_HOST,
    process.env.MONGODB_PORT,
    process.env.MONGODB_DATABASE_NAME,
  ).then(async() => {
    const dailyActionService = require('../services/daily-action');

    for (const dailyAction of dailyActions) {
      const action = await dailyActionService.insert(dailyAction);
      logger.info(`Inserted objective ${action.name} (${action._id})`);
      await sleep();
    }

    process.exit();
  }).catch(err => {
    console.log(err);
  });
});

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 10);
  });
}
