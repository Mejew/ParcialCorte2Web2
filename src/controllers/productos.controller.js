import { connection } from "../db.js";
export const getProductos = async (req, res) => {
  connection.query("SELECT * FROM productos", (error, rows) => {
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

export const getProducto = async (req, res) => {
  const codigo = req.params.codigo;
  connection.query(
    "SELECT * FROM productos WHERE codigo =?",
    [codigo],
    (error, rows) => {
      if (rows.length <= 0) {
        return res.status(400).json({
          msg: "Usuario no encontrado",
        });
      } else if (error) {
        console.error(error);
        res.status(500).json({
          estado: false,
          msg: "Comuníquese con el administrador",
        });
      } else {
        res.send(rows[0]);
      }
    }
  );
};
export const crearProducto = async (req, res) => {
  console.log(req.body);
  const { nombre, descripcion, precio, cantidad_en_stock } = req.body;
  connection.query(
    "INSERT INTO productos(nombre, descripcion, precio, cantidad_en_stock) VALUES (?, ?, ?,?)",
    [nombre, descripcion, precio, cantidad_en_stock],
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
          nombre,
          descripcion,
          precio,
          cantidad_en_stock,
        });
      }
    }
  );
};
export const actualizarProducto = async (req, res) => {
  const codigo = req.params.codigo;
  const { nombre, descripcion, precio, cantidad_en_stock } = req.body;
  connection.query(
    "UPDATE productos SET nombre= IFNULL(?,nombre), descripcion=IFNULL(?,descripcion), precio=IFNULL(?,precio),cantidad_en_stock=IFNULL(?,cantidad_en_stock) WHERE codigo=?",
    [nombre, descripcion, precio, cantidad_en_stock, codigo],
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
            msg: "Producto no encontrado",
          });
        } else {
          connection.query(
            "SELECT * FROM productos WHERE codigo=?",
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

export const eliminarProducto = async (req, res) => {
  const codigo = req.params.codigo;
  connection.query(
    "DELETE FROM productos WHERE codigo =?",
    [codigo],
    (error, results) => {
      if (results.affectedRows <= 0) {
        return res.status(400).json({
          msg: "Producto no encontrado",
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
