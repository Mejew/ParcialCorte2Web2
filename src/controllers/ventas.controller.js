import { connection } from "../db.js";

export const getVentas = async (req, res) => {
  console.log("Usuario autenticado:", req.user);
  console.log("esAdm:", req.user.esAdm);
  if (req.user && req.user.esAdm === 0) {
    console.log("Acceso permitido para no administrador");

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
  } else {
    console.log("Acceso no autorizado");

    res.status(403).json({
      estado: false,
      msg: "Acceso no autorizado",
    });
  }
};

export const getVenta = async (req, res) => {
  const codigo = req.params.codigo;
  if (req.user && req.user.esAdm === 0) {
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
              msg: "Venta no encontrada",
            });
          } else {
            res.send(rows[0]);
          }
        }
      }
    );
  } else {
    console.log("Acceso no autorizado");

    res.status(403).json({
      estado: false,
      msg: "Acceso no autorizado",
    });
  }
};

export const crearVentas = async (req, res) => {
  console.log(req.body);
  if (req.user && req.user.esAdm === 0) {
    const {
      codigo_producto,
      nombre_cliente,
      telefono_cliente,
      fecha_venta,
      cantidad_vendida,
      total_venta,
    } = req.body;

    connection.query(
      "INSERT INTO ventas (codigo_producto, nombre_cliente, telefono_cliente, fecha_venta, cantidad_vendida, total_venta) VALUES (?,?,?,?,?,?)",
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
          const codigoInsertado = results.insertId;
          console.log(`Código insertado: ${codigoInsertado}`);
          console.log(results);
          res.send({
            codigo: codigoInsertado,
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
  } else {
    console.log("Acceso no autorizado");

    res.status(403).json({
      estado: false,
      msg: "Acceso no autorizado",
    });
  }
};

export const actualizarVentas = async (req, res) => {
  const codigo = req.params.codigo;
  if (req.user && req.user.esAdm === 0) {
    const {
      codigo_producto,
      nombre_cliente,
      telefono_cliente,
      fecha_venta,
      cantidad_vendida,
      total_venta,
    } = req.body;

    connection.query(
      "UPDATE ventas SET codigo_producto=IFNULL(?,codigo_producto), nombre_cliente=IFNULL(?,nombre_cliente), telefono_cliente=IFNULL(?,telefono_cliente), fecha_venta=IFNULL(?,fecha_venta), cantidad_vendida=IFNULL(?,cantidad_vendida), total_venta=IFNULL(?,total_venta) WHERE codigo=?",
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
  } else {
    console.log("Acceso no autorizado");

    res.status(403).json({
      estado: false,
      msg: "Acceso no autorizado",
    });
  }
};

export const eliminarVentas = async (req, res) => {
  const codigo = req.params.codigo;
  if (req.user && req.user.esAdm === 0) {
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
          res.sendStatus(204);
        }
      }
    );
  } else {
    console.log("Acceso no autorizado");
    res.status(403).json({ estado: false, msg: "Acceso no autorizado" });
  }
};
