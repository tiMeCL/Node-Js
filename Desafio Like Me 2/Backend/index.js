import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pkg from 'pg';
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const { Pool } = pkg;

const app = express();
const port = 3000;

// Configuración para ingresar a la base de datos usando variables de entorno
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Habilitar CORS

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Bienvenido a la API de Like Me");
});

// Ruta GET para devolver los registros de la tabla posts
app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// Ruta POST para recibir y almacenar un nuevo registro en la tabla posts
app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion, likes } = req.body; 
  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, url, descripcion, likes] 
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// Ruta DELETE para eliminar un post por su ID
app.delete("/posts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    // Verificar si el post existe
    const postExistente = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (postExistente.rows.length === 0) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Eliminar el post de la base de datos
    await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

    res.status(200).json({ message: "Post eliminado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// Ruta PUT para dar "like" a un post por su ID
app.put("/posts/like/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    // Verificar si el post existe
    const postExistente = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
    if (postExistente.rows.length === 0) {
      return res.status(404).json({ message: "Post no encontrado" });
    }

    // Incrementar el número de "likes"
    const result = await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *', [postId]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error del servidor');
  }
});

// Escuchar en el puerto definido
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
