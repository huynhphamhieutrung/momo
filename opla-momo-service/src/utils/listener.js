const amqp = require('amqplib/callback_api');

const type = 'direct';
const durable = false;
const passive = false;
const autoDelete = true;
const exclusive = true;

module.exports = (exchange, routings) => {
  return new Promise((resolve, reject) => {
    amqp.connect(process.env.RABBITMQ_URL, (error, connection) => {
      if (error) {
        reject(error);
        return;
      }

      connection.createChannel(async(error, channel) => {
        if (error) {
          reject(error);
          return;
        }

        const options = {durable, passive, autoDelete, exclusive};

        channel.assertExchange(exchange, type, options);

        channel.assertQueue('', options, (error, q) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();

          for (const routingKey in routings) {
            if (routings.hasOwnProperty(routingKey)) {
              channel.bindQueue(q.queue, exchange, routingKey);
            }
          }

          channel.consume(q.queue, (msg) => {
            const callback = routings[msg.fields.routingKey];
            if (callback instanceof Function) {
              callback(msg.content.toString());
            }
          }, {noAck: true});
        });
      });
    });
  });
};
