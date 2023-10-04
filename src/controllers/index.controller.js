import { connection } from "../db.js";
export const prueba = async (req, res) => {
  try {
    connection.query(
      "SELECT 'Hola mundo' as  result, 'hola mundo 2' as messages",
      (err, results) => {
        if (err) {
          console.log(err);
          res.status(400).json({
            estado: false,
            msg: "Comuniquese con el administrador",
          });
          return;
        }
        console.log(results);
        res.json({ estado: true, results });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({
      estado: false,
      msg: "Comuniquese con el administrador",
    });
  }
};
