const i18n = require('./../utils/i18n');

module.exports = (error, req, res, next) => {
  var selectedLang = req.param('lang');
  i18n.setLocale(selectedLang);
  const code = 'number' === typeof error.code ? error.code : 500;
  const message = i18n.__(error.message);

  const errors = !Array.isArray(error.errors) ?
    [] :
    error.errors.map(({param, msg}) => {
      return {param, message: i18n.__(msg)};
    });

  res.status(code).send({code, message, errors});
};
