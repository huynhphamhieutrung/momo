require('./utils/i18n');
const logger = require('./utils/logger');
const database = require('./utils/database');

database.init(
  process.env.MONGODB_USERNAME,
  process.env.MONGODB_PASSWORD,
  process.env.MONGODB_HOST,
  process.env.MONGODB_PORT,
  process.env.MONGODB_DATABASE_NAME,
).then((() => {
  initBuddyListener();
  initApp();
  initCron();
}));

function initApp() {
  const express = require('express');
  const bodyParser = require('body-parser');
  const securityMiddleware = require('./middlewares/security');
  const errorMiddleware = require('./middlewares/error');

  const app = express();
  const port = 3000;

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.use(securityMiddleware);

  require('./controllers/my-objective')(app);
  require('./controllers/my-daily-action')(app);
  require('./controllers/momo')(app);

  app.use(errorMiddleware);

  app.listen(port, () => {
    console.log(`OPLA app listening on port ${port}!`);
  });
}

function initBuddyListener() {
  const buddyListenerService = require('./services/buddy-listener');

  buddyListenerService().then(() => {
    logger.info('Listening buddies! Waiting buddy message...');
  }).catch((error) => {
    logger.error(`Cannot connect to RabbitMQ: ${error.message}`);
    process.exit(500);
  });
}

function initCron() {
  const {CronJob} = require('cron');
  const dailyActionService = require('./services/daily-action');

  const job = new CronJob('0 */5 * * * *', () => {
    dailyActionService.remind(5);
  }, null, true, 'UTC');

  job.start();
}
