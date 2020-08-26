const amqp = require('amqplib/callback_api');
const logger = require('../utils/logger');

const type = 'direct';
const durable = false;
const passive = false;
const autoDelete = true;
const exclusive = true;

module.exports = (exchange, routingKey, messages, logMessages = []) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(messages)) {
      messages = [messages];
    }
    if (!Array.isArray(logMessages)) {
      logMessages = [logMessages];
    }

    amqp.connect(process.env.RABBITMQ_URL, (error, connection) => {
      if (error) {
        reject(error);
        return;
      }

      connection.createChannel(async(error, channel) => {
        if (error) {
          closeConnection(connection);
          reject(error);
          return;
        }

        channel.assertExchange(
          exchange,
          type,
          {durable, passive, autoDelete, exclusive},
        );

        for (let i = 0; i < messages.length; i++) {
          const message = messages[i];
          const logMessage = logMessages[i];

          channel.publish(exchange, routingKey, Buffer.from(message));

          if (logMessage) {
            logger.info(logMessage);
          }

          await sleep();
        }

        closeConnection(connection);
        resolve();
      });
    });
  });
};

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 50);
  });
}

function closeConnection(connection) {
  setTimeout(() => {
    connection.close();
  }, 500);
}
