module.exports = {
  log: (message) => console.log('\x1b[30m%s\x1b[0m', message),
  info: (message) => console.log('\x1b[36m%s\x1b[0m', message),
  success: (message) => console.log('\x1b[32m%s\x1b[0m', message),
  warning: (message) => console.log('\x1b[33m%s\x1b[0m', message),
  error: (message) => console.error('\x1b[31m%s\x1b[0m', message),
  event: (message) => console.error('\x1b[35m%s\x1b[0m', message),
};
