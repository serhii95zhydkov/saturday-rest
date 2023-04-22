module.exports = (error, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const stack = error.stack;
  return res.status(statusCode).json({ code: statusCode, stack });
};
