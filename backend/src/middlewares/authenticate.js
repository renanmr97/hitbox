const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role } ficam disponíveis nos controllers
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
}

module.exports = authenticate;