const { validationResult } = require('express-validator');

const formatBodyErrMessage = (valResult) => {
  const [ firstErr ] = valResult.array({ onlyFirstError: true });

  return `Property "req.body.${firstErr.param}": ${firstErr.msg}. Current value = ${firstErr.value}`;
};

exports.validateBody = (req) => {
  const valResult = validationResult(req);

  if (!valResult.isEmpty()) {
    throw new Error(formatBodyErrMessage(valResult));
  }
};
