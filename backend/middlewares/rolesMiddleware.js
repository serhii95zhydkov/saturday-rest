const jwt = require("jsonwebtoken");

module.exports = (rolesArr) => {
  return (req, res, next) => {
    try {
      // console.log(req.headers.authorization)
      const [tokenType, token] = req.headers.authorization.split(" ");
      if (tokenType !== "Bearer") {
        return res
          .status(400)
          .json({ code: 400, message: "No Bearer token providet" });
      }
      if (!token) {
        return res
          .status(400)
          .json({ code: 400, message: "No token providet" });
      }

      const decodet = jwt.verify(token, "pizza");
      // console.log(decodet)
      //   req.user = decodet;
      let hasRole = false;
      decodet.roles.forEach((role) => {
        if (rolesArr.includes(role)) {
          hasRole = true;
        }
      });
      if (!hasRole) {
        return res.status(403).json({ code: 403, message: "Forbidden" });
      }
      next();
    } catch (error) {
      return res.status(401).json({ code: 401, message: "Not authorized" });
    }
  };
};
