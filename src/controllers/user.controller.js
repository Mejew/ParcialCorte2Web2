import { connection } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const saltRounds = 10;
const secretKey = "123456789";

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

  // Busca el usuario en la base de datos
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

      if (rows.length <= 0) {
        return res.status(400).json({
          msg: "Usuario no encontrado",
        });
      }

      // Compara la contraseña ingresada con la almacenada
      bcrypt.compare(password, rows[0].password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            estado: false,
            msg: "Comuníquese con el administrador",
          });
        }

        // Genera y firma el token JWT
        let tokenPayload = { username: rows[0].username, esAdm: rows[0].esAdm };
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });

        if (rows[0].esAdm) {
          res.json({
            msg: "Inicio de sesión exitoso como administrador",
            token,
            isAdmin: true,
          });
        } else {
          res.json({
            msg: "Inicio de sesión exitoso como asesor",
            token,
            isAdmin: false,
          });
        }
      });
    }
  );
};
