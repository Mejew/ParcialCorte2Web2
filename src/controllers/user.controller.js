import { connection } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

export const getuser = async (req, res) => {
  connection.query("SELECT * FROM usuarios", (error, rows) => {
    if (error) {
      console.error(error);
      res.status(500).json({
        estado: false,
        msg: "Comuníquese con el administrador",
      });
    } else {
      res.send(rows);
    }
  });
};

export const registerUser = (req, res) => {
  const { username, password, esAdm } = req.body;

  // Verifica si el usuario ya existe
  connection.query(
    "SELECT * FROM usuarios WHERE username = ?",
    [username],
    (error, rows) => {
      if (error) {
        console.error(error);
        return res.status(500).json({
          estado: false,
          msg: "Comuníquese con el administrador",
        });
      }

      if (rows.length > 0) {
        return res.status(400).json({
          msg: "El usuario ya existe",
        });
      }

      // Hash del password
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            estado: false,
            msg: "Comuníquese con el administrador",
          });
        }

        // Inserta el nuevo usuario en la base de datos
        connection.query(
          "INSERT INTO usuarios(username, password, esAdm) VALUES (?, ?, ?)",
          [username, hashedPassword, esAdm],
          (error, results) => {
            if (error) {
              console.error(error);
              return res.status(500).json({
                estado: false,
                msg: `Error en la base de datos: ${error.message}`,
              });
            }

            res.json({ msg: "Usuario registrado exitosamente" });
          }
        );
      });
    }
  );
};
export const loginUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      mensaje: "Debe completar los campos",
    });
  }

  connection.query(
    "SELECT * FROM usuarios WHERE username = ?",
    [username],
    (error, rows) => {
      if (error) {
        return res.status(500).json({
          estado: false,
          msg: "Comuníquese con el administrador",
        });
      }

      if (rows.length === 0) {
        return res.status(401).json({
          mensaje: "Usuario o contraseña incorrectos",
        });
      }

      // Compara la contraseña ingresada con la almacenada
      bcrypt.compare(password, rows[0].password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            estado: false,
            msg: "Error al comparar contraseñas. Comuníquese con el administrador",
          });
        }

        if (result) {
          const user = {
            id: rows[0].id,
            username: rows[0].username,
            esAdm: rows[0].esAdm,
          };

          jwt.sign(
            { user },
            "secretkey",
            { expiresIn: "1h" },
            (error, token) => {
              if (error) {
                console.error(error);
                return res.status(500).json({
                  estado: false,
                  msg: "Error al generar el token. Comuníquese con el administrador",
                });
              }

              res.cookie("token", token, { httpOnly: true, maxAge: 120000 }); // Almacena el token en la cookie

              if (user.esAdm) {
                res.json({
                  mensaje: "Inicio de sesión exitoso como administrador",
                  isAdmin: true,
                  token,
                });
              } else {
                res.json({
                  mensaje: "Inicio de sesión exitoso como asesor",
                  isAdmin: false,
                  token,
                });
              }
            }
          );
        } else {
          res.status(401).json({
            mensaje: "Usuario o contraseña incorrectos",
          });
        }
      });
    }
  );
};
export const protectedRoute = (req, res) => {
  jwt.verify(req.token, "secretkey", (error, authData) => {
    if (error) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Ruta protegida",
        authData,
      });
    }
  });
};

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
