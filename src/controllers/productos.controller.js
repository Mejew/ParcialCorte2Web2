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
  if (req.user && (req.user.esAdm === 1 | req.user.esAdm === 0)) {
    connection.query(
      "SELECT * FROM productos WHERE codigo =?",
      [codigo],
      (error, rows) => {
        if (rows.length <= 0) {
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
          res.send(rows[0]);
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

export const crearProducto = async (req, res) => {
  console.log(req.body);
  const { nombre, descripcion, precio, cantidad_en_stock, imagen_url } =
    req.body;
  if (req.user && req.user.esAdm === 1) {
    connection.query(
      "INSERT INTO productos(nombre, descripcion, precio, cantidad_en_stock, imagen_url) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, cantidad_en_stock, imagen_url],
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
            nombre,
            descripcion,
            precio,
            cantidad_en_stock,
            imagen_url,
          });
        }
      }
    );
    console.log("producto agregado");
  } else {
    console.log("Acceso no autorizado");

    res.status(403).json({
      estado: false,
      msg: "Acceso no autorizado para crear producto",
    });
  }
};

export const actualizarProducto = async (req, res) => {
  const codigo = req.params.codigo;
  const { nombre, descripcion, precio, cantidad_en_stock, imagen_url } =
    req.body;
  if (req.user && req.user.esAdm === 1) {
    connection.query(
      "UPDATE productos SET nombre=IFNULL(?,nombre), descripcion=IFNULL(?,descripcion), precio=IFNULL(?,precio), cantidad_en_stock=IFNULL(?,cantidad_en_stock), imagen_url=IFNULL(?,imagen_url) WHERE codigo=?",
      [nombre, descripcion, precio, cantidad_en_stock, imagen_url, codigo],
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
  } else {
    console.log("Acceso no autorizado");

    res.status(403).json({
      estado: false,
      msg: "Acceso no autorizado",
    });
  }
};

export const eliminarProducto = async (req, res) => {
  const codigo = req.params.codigo;
  if (req.user && req.user.esAdm === 1) {
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
          res.sendStatus(204);
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
