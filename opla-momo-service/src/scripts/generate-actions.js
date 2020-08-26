const Objective = require('../models/objective');
const database = require('../utils/database');
const objectiveEmitter = require('../services/objective-emitter');

database.init(
  process.env.MONGODB_USERNAME,
  process.env.MONGODB_PASSWORD,
  process.env.MONGODB_HOST,
  process.env.MONGODB_PORT,
  process.env.MONGODB_DATABASE_NAME,
).then(async() => {
  const dailyActionService = require('../services/daily-action');
  const collection = await database.getCollection('objective');

  const limit = 100;
  let skip = 0;

  while (true) {
    const arr = await collection.find().skip(skip).limit(limit).toArray();

    if (!arr.length) {
      break;
    }

    for (const item of arr) {
      const objective = new Objective(item);
      await dailyActionService.generateFromToday(objective);
      console.log(`Generated actions for objective "${objective.name}"`);
      await sleep();
    }

    skip += limit;
  }

  process.exit();
}).catch(err => {
  console.log(err);
});

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
}
