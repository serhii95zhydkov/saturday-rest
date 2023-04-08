module.exports = (error, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const stack = error.stack;
  res.status(statusCode);
  res.json({ code: statusCode, stack });
};
