// централизованный обработчик ошибок
const CentralizedErrorHandler = (err, req, res, next) => {
  const { statusCode, message } = err;

  res
    .status(err.statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = CentralizedErrorHandler;
