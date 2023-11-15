import { connection } from "../db.js";
import jwt from "jsonwebtoken";

export const getVentas = async (req, res) => {
  connection.query("SELECT * FROM ventas", (error, rows) => {
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

export const getVenta = async (req, res) => {
  const codigo = req.params.codigo;
  connection.query(
    "SELECT * FROM ventas WHERE codigo =?",
    [codigo],
    (error, rows) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          estado: false,
          msg: "Comuníquese con el administrador",
        });
      } else {
        if (rows.length <= 0) {
          return res.status(400).json({
            msg: "Usuario no encontrado",
          });
        } else {
          res.send(rows[0]);
        }
      }
    }
  );
};
export const crarVentas = async (req, res) => {
  console.log(req.body);
  const {
    codigo_producto,
    nombre_cliente,
    telefono_cliente,
    fecha_venta,
    cantidad_vendida,
    total_venta,
  } = req.body;
  connection.query(
    " INSERT INTO ventas (codigo_producto, nombre_cliente, telefono_cliente, fecha_venta, cantidad_vendida, total_venta) VALUES (?,?,?,?,?,?)",
    [
      codigo_producto,
      nombre_cliente,
      telefono_cliente,
      fecha_venta,
      cantidad_vendida,
      total_venta,
    ],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          estado: false,
          msg: "Comuníquese con el administrador",
        });
      } else {
        const codigoInsetado = results.insertId;
        console.log(`Codigo insertado: ${codigoInsetado}`);
        console.log(results);
        res.send({
          codigo: codigoInsetado,
          codigo_producto,
          nombre_cliente,
          telefono_cliente,
          fecha_venta,
          cantidad_vendida,
          total_venta,
        });
      }
    }
  );
};
export const actualizarVentas = async (req, res) => {
  const codigo = req.params.codigo;
  const {
    codigo_producto,
    nombre_cliente,
    telefono_cliente,
    fecha_venta,
    cantidad_vendida,
    total_venta,
  } = req.body;
  connection.query(
    "UPDATE ventas SET codigo_producto=IFNULL(?,codigo_producto), nombre_cliente= IFNULL(?,nombre_cliente), telefono_cliente=IFNULL(?,telefono_cliente), fecha_venta=IFNULL(?,fecha_venta),cantidad_vendida=IFNULL(?,cantidad_vendida),total_venta=IFNULL(?,total_venta) WHERE codigo=?",
    [
      codigo_producto,
      nombre_cliente,
      telefono_cliente,
      fecha_venta,
      cantidad_vendida,
      total_venta,
      codigo,
    ],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          estado: false,
          msg: "Comuníquese con el administrador",
        });
      } else {
        if (results.affectedRows <= 0) {
          res.status(400).json({
            msg: "Venta no encontrado",
          });
        } else {
          connection.query(
            "SELECT * FROM ventas WHERE codigo=?",
            [codigo],
            (error, rows) => {
              if (error) {
                console.error(error);
                res.status(500).json({
                  estado: false,
                  msg: "Comuníquese con el administrador",
                });
              } else {
                res.json(rows[0]);
              }
            }
          );
        }
      }
    }
  );
};
export const eliminarVentas = async (req, res) => {
  const codigo = req.params.codigo;
  connection.query(
    "DELETE FROM ventas WHERE codigo =?",
    [codigo],
    (error, results) => {
      if (results.affectedRows <= 0) {
        return res.status(400).json({
          msg: "Venta no encontrada",
        });
      } else if (error) {
        console.error(error);
        res.status(500).json({
          estado: false,
          msg: "Comuníquese con el administrador",
        });
      } else {
        console.log(results);
        res.send(204);
      }
    }
  );
};
