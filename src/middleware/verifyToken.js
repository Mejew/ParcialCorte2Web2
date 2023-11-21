import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;

    jwt.verify(req.token, "secretkey", (error, authData) => {
      if (error) {
        console.error("Error al verificar el token:", error);
        res.sendStatus(403);
      } else {
        req.user = authData.user; // Añade el usuario autenticado a la solicitud
        console.log("Usuario autenticado:", req.user);
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};
