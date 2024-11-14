const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const zxcvbn = require('zxcvbn');
const { pwnedPassword } = require('hibp');
const axios = require('axios'); // Importar axios para hacer solicitudes HTTP
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const multer = require('multer');
const validator = require('validator'); // Importar validator
//const csrf = require('csurf');


// Middleware
app.use(cookieParser());
app.use(express.json());

// Middleware CSRF
//const csrfProtection = csrf({ cookie: true });

// Rutas donde quieres aplicar la protección CSRF
//app.use(csrfProtection);

// Ruta para obtener el token CSRF
/*app.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
);*/
/*
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Token CSRF inválido
    res.status(403).json({ message: 'Token CSRF inválido o faltante' });
  } else {
    next(err);
  }
});*/

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:8080', 'https://sututeh.isoftuthh.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions)); // Aplicar CORS con las opciones definidas

// Configuración de las rutas y del servidor
/*app.get('/csrf-token', (req, res) => {
  // Genera y envía el token CSRF aquí
  res.json({ csrfToken: 'tu-token-csrf' });
});*/

// Manejo de solicitudes preflight (OPTIONS)
app.options('*', cors(corsOptions)); // Usar CORS para manejar las solicitudes preflight


const pool = mysql.createPool({
  host: '193.203.166.102',
  user: 'u666156220_Sindicato',
  password: 'Jesusisrael120@#',
  database: 'u666156220_Proyectosin',
  waitForConnections: true,
  port: 3306,
  connectionLimit: 10, // Número máximo de conexiones en el pool
  queueLimit: 0 // Número máximo de consultas en la cola (0 = sin límite)
});

// Configuración de multer para almacenar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Cuando necesites realizar una query
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al obtener la conexión del pool:', err);
    return;
  }

  console.log('Conexión al pool de MySQL establecida');

  // Libera la conexión después de usarla
  connection.release();
});


// Exportar el pool para usarlo en otras partes de tu aplicación
module.exports = pool;

// Objeto para almacenar intentos de inicio de sesión
const intentosLogin = {};

// Configurar la sesión con cookies seguras en producción
app.use(session({
  secret: 'tu_secreto',
  resave: false, // No guardar la sesión si no ha cambiado
  saveUninitialized: false, // No crear sesiones vacías
  cookie: {
    httpOnly: true,   // No accesible desde el navegador
    secure: false,    // Solo en HTTPS en producción
    sameSite: 'Lax',  // Evitar que se envíe la cookie en peticiones de sitios cruzados
    maxAge: 60 * 60 * 1000 // 1 hora de duración
  }
}));

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: '20221042@uthh.edu.mx',
    pass: 'izbq sext sumd xkcu',
  },
});


async function enviarCodigoVerificacion(correo, codigo) {
  const mailOptions = {
    from: '20221042@uthh.edu.mx',  // Asegúrate de usar la dirección correcta
    to: correo,
    subject: 'Código de verificación',
    text: `Tu código de verificación es: ${codigo}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado: ', info.response);
    return { success: true, message: 'Código de verificación enviado', info };
  } catch (error) {
    console.error('Error al enviar el correo: ', error);
    return { success: false, message: 'Error al enviar el correo de verificación', error };
  }
}

async function enviarEmailVerificacion(correo, userId) {
  const token = crypto.randomBytes(20).toString('hex');
  const expiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

  // Actualizar el usuario en la base de datos con el token y su expiración
  await pool.query(
    'UPDATE users SET email_verification_token = ?, email_verification_expiration = ? WHERE id = ?',
    [token, expiration, userId]
  );

  // Crear el correo electrónico con el enlace de verificación
  const mailOptions = {
    from: '20221042@uthh.edu.mx',  // Tu correo
    to: correo,
    subject: 'Verificación de correo electrónico',
    text: `Por favor, verifica tu correo electrónico haciendo clic en el siguiente enlace. Este enlace expirará en 15 minutos:
    http://localhost:8080/verify-email?token=${token}&userId=${userId}`
  };

  // Enviar el correo utilizando el transporter existente
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de verificación enviado: ', info.response);
    return { success: true, message: 'Correo de verificación enviado', info };
  } catch (error) {
    console.error('Error al enviar el correo de verificación: ', error);
    return { success: false, message: 'Error al enviar el correo de verificación', error };
  }
}

// Middleware para verificar si el usuario es administrador
function verifyAdmin(req, res, next) {
  const token = req.headers.authorization.split(' ')[1]; // Tomar el token de la cabecera

  jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto', (err, decoded) => {
    if (err || decoded.role !== 'admin') {
      return res.status(403).send('Acceso denegado. No tienes permisos de administrador.');
    }
    next(); // Si es administrador, continuar
  });
}

// Middleware para verificar si el usuario está autenticado
function verifyUser(req, res, next) {
  const token = req.headers.authorization.split(' ')[1]; // Tomar el token de la cabecera

  jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto', (err, decoded) => {
    if (err) {
      return res.status(401).send('No autenticado');
    }
    req.user = decoded; // Guardar los datos del usuario en la solicitud
    next(); // Si está autenticado, continuar
  });
}


app.use((req, res, next) => {
  console.log('Cookies: ', req.cookies);
  next();
});

// Ruta para guardar o actualizar el logo en la base de datos como binario
app.post('/upload-logo', upload.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }

  const logoData = req.file.buffer;

  pool.query('UPDATE configuracion_empresa SET logo = ? WHERE id = 1', [logoData], (err) => {
    if (err) {
      console.error('Error al guardar el logo en la base de datos:', err);
      return res.status(500).json({ message: 'Error al guardar el logo en la base de datos' });
    }
    res.status(200).json({ message: 'Logo guardado correctamente' });
  });
});

// Ruta para actualizar el eslogan
app.post('/slogan', (req, res) => {
  const { slogan } = req.body;

  console.log('Slogan recibido:', slogan);  // Verifica si el valor de slogan es correcto

  if (!slogan || slogan.trim() === '') {
    return res.status(400).send('El eslogan está vacío o es nulo');
  }

  const sql = `UPDATE configuracion_empresa SET eslogan = ? WHERE id = 1`;

  pool.query(sql, [slogan], (err, results) => {
    if (err) {
      console.error('Error al actualizar el slogan:', err);
      return res.status(500).send('Error al actualizar el slogan.');
    }
    res.status(200).send('Slogan actualizado correctamente.');
  });
});


// Ruta para actualizar la dirección de contacto
// Ruta para actualizar los datos de contacto (puede ser uno o más campos)
app.post('/update-contact-info', (req, res) => {
  const { direccion_contacto, correo_contacto, telefono_contacto } = req.body;
  
  let sql = 'UPDATE configuracion_empresa SET ';
  const fields = [];
  const values = [];

  // Solo agregamos los campos que no sean nulos o vacíos
  if (direccion_contacto) {
    fields.push('direccion_contacto = ?');
    values.push(direccion_contacto);
  }
  if (correo_contacto) {
    fields.push('correo_contacto = ?');
    values.push(correo_contacto);
  }
  if (telefono_contacto) {
    fields.push('telefono_contacto = ?');
    values.push(telefono_contacto);
  }

  // Si no hay campos para actualizar, devolver un error
  if (fields.length === 0) {
    return res.status(400).json({ message: 'No se enviaron campos para actualizar.' });
  }

  sql += fields.join(', ') + ' WHERE id = 1';

  pool.query(sql, values, (err) => {
    if (err) {
      console.error('Error al actualizar los datos de contacto:', err);
      return res.status(500).json({ message: 'Error al actualizar los datos de contacto.' });
    }
    res.status(200).json({ message: 'Datos de contacto actualizados correctamente.' });
  });
});


// Ruta para guardar enlaces de redes sociales (solo accesible para admin)
app.post('/update-social-links', (req, res) => {
  const socialLinks = req.body;

  // Inicializar los valores de facebook e instagram
  let facebook = "";
  let instagram = "";

  // Recorrer el array para extraer las URLs correspondientes
  socialLinks.forEach(link => {
    if (link.platform === 'Facebook') {
      facebook = link.url;
    }
    if (link.platform === 'Instagram') {
      instagram = link.url;
    }
  });

  // Ahora actualizamos la base de datos
  const sql = `UPDATE configuracion_empresa SET facebook = ?, instagram = ? WHERE id = 1`;
  pool.query(sql, [facebook, instagram], (err, results) => {
    if (err) {
      console.error('Error al actualizar enlaces de redes sociales:', err);
      return res.status(500).send('Error al actualizar enlaces de redes sociales.');
    }
    res.status(200).send('Enlaces de redes sociales actualizados correctamente.');
  });
});

// Ruta para actualizar el título de la página
app.post('/update-title', verifyAdmin, (req, res) => {
  const { title } = req.body;

  console.log('Título recibido:', title);  // Verifica si el valor del título es correcto

  if (!title || title.trim() === '') {
    return res.status(400).send('El título está vacío o es nulo');
  }

  const sql = `UPDATE configuracion_empresa SET nombre_empresa = ? WHERE id = 1`;

  pool.query(sql, [title], (err, results) => {
    if (err) {
      console.error('Error al actualizar el título de la página:', err);
      return res.status(500).send('Error al actualizar el título de la página.');
    }
    res.status(200).send('Título de la página actualizado correctamente.');
  });
});

// Ruta para obtener el nombre de la empresa y el slogan
app.get('/company-name', (req, res) => {
  const sql = 'SELECT nombre_empresa, eslogan FROM configuracion_empresa WHERE id = 1';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los datos de la empresa:', err);
      return res.status(500).json({ message: 'Error al obtener los datos de la empresa.' });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]); // Retorna el nombre y el slogan
    } else {
      res.status(404).json({ message: 'Datos de la empresa no encontrados.' });
    }
  });
});


// Ruta para obtener la información de contacto
// Ruta para obtener la información de contacto de la empresa
app.get('/contact-info', (req, res) => {
  const sql = `SELECT direccion_contacto, correo_contacto, telefono_contacto FROM configuracion_empresa WHERE id = 1`;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener la información de contacto:', err);
      return res.status(500).json({ message: 'Error al obtener la información de contacto.' });
    }
    
    if (results.length > 0) {
      res.status(200).json(results[0]);  // Devolver la primera fila con los datos de contacto
    } else {
      res.status(404).json({ message: 'No se encontró la información de contacto.' });
    }
  });
});


// Ruta para obtener los enlaces de redes sociales
app.get('/social-links', (req, res) => {
  const sql = 'SELECT facebook, instagram FROM configuracion_empresa WHERE id = 1';
  
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los enlaces de redes sociales:', err);
      return res.status(500).json({ message: 'Error al obtener los enlaces de redes sociales.' });
    }

    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).json({ message: 'No se encontraron enlaces de redes sociales.' });
    }
  });
});
// Ruta para obtener el logo de la empresa
app.get('/logo', (req, res) => {
  const sql = `SELECT logo FROM configuracion_empresa WHERE id = 1`;

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener el logo:', err);
      return res.status(500).send('Error al obtener el logo.');
    }

    if (results.length > 0 && results[0].logo) {
      res.setHeader('Content-Type', 'image/png');
      res.send(results[0].logo);  // Enviar el logo como archivo binario
    } else {
      res.status(404).send('Logo no encontrado.');
    }
  });
});

// Ruta para subir el documento
// Ruta para subir un nuevo documento y marcar los anteriores como "no vigentes"
app.post('/upload-document', upload.single('file'), (req, res) => {
  const { validUntil } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }

  const fileData = req.file.buffer;  // El archivo binario
  const createdAt = new Date();  // Fecha de creación

  // Buscar la versión del último documento vigente
  const getLastVersionSql = `SELECT version FROM deslinde_legal WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1`;
  pool.query(getLastVersionSql, (err, results) => {
    if (err) {
      console.error('Error al obtener la última versión:', err);
      return res.status(500).json({ message: 'Error al obtener la última versión' });
    }

    let newVersion = "1.0"; // Versión inicial si no hay documentos previos
    if (results.length > 0 && results[0].version) {
      newVersion = (parseFloat(results[0].version) + 1.0).toFixed(1); // Incrementar la versión del último documento
    }

    // Marcar el último documento vigente como no vigente (deleted = 1)
    const markOldDocumentsSql = `UPDATE deslinde_legal SET deleted = 1 WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1`;
    pool.query(markOldDocumentsSql, (err) => {
      if (err) {
        console.error('Error al marcar el documento anterior como no vigente:', err);
        return res.status(500).json({ message: 'Error al marcar el documento anterior como no vigente' });
      }

      // Insertar el nuevo documento con la nueva versión
      const insertNewDocumentSql = `INSERT INTO deslinde_legal (version, file, createdAt, validUntil, deleted) VALUES (?, ?, ?, ?, 0)`;
      pool.query(insertNewDocumentSql, [newVersion, fileData, createdAt, validUntil], (err, result) => {
        if (err) {
          console.error('Error al guardar el nuevo documento en la base de datos:', err);
          return res.status(500).json({ message: 'Error al guardar el nuevo documento en la base de datos' });
        }
        res.status(200).json({ message: 'Documento subido exitosamente', documentId: result.insertId, version: newVersion });
      });
    });
  });
});


// Ruta para obtener un documento por ID (descargar)
// Ruta para obtener y descargar un documento por ID
app.get('/documents/:id', (req, res) => {
  const { id } = req.params;

  const sql = `SELECT file, version FROM deslinde_legal WHERE id = ?`;
  pool.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el documento:', err);
      return res.status(500).json({ message: 'Error al obtener el documento' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    const document = results[0];

    // Configurar el encabezado para la descarga del archivo
    res.setHeader('Content-Disposition', `attachment; filename="documento_version_${document.version}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(document.file); // Enviamos el archivo binario
  });
});

// Ruta para obtener todos los documentos (vigentes y no vigentes)
app.get('/documents', (req, res) => {
  const sql = `SELECT id, version, createdAt, validUntil, deleted FROM deslinde_legal`;
  
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los documentos:', err);
      return res.status(500).json({ message: 'Error al obtener los documentos' });  // Si hay un error, lo devolvemos al cliente
    }
    res.status(200).json(results);  // Devolvemos todos los documentos en formato JSON
  });
});

// Ruta para marcar un documento como no vigente (deleted = 1)
app.post('/delete-document/:id', (req, res) => {
  const { id } = req.params;

  const sql = `UPDATE deslinde_legal SET deleted = 1 WHERE id = ?`;
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al marcar el documento como no vigente:', err);
      return res.status(500).json({ message: 'Error al marcar el documento como no vigente' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    res.status(200).json({ message: 'Documento marcado como no vigente exitosamente' });
  });
});

app.post('/upload-aviso-privacidad', upload.single('file'), (req, res) => {
  const { validUntil } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }

  const fileData = req.file.buffer;
  const createdAt = new Date();

  const getLastVersionSql = `SELECT version FROM politica_privacidad WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1`;
  pool.query(getLastVersionSql, (err, results) => {
    if (err) {
      console.error('Error al obtener la última versión:', err);
      return res.status(500).json({ message: 'Error al obtener la última versión' });
    }

    let newVersion = "1.0";
    if (results.length > 0 && results[0].version) {
      newVersion = (parseFloat(results[0].version) + 1.0).toFixed(1);
    }

    const markOldDocumentsSql = `UPDATE politica_privacidad SET deleted = 1 WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1`;
    pool.query(markOldDocumentsSql, (err) => {
      if (err) {
        console.error('Error al marcar el documento anterior como no vigente:', err);
        return res.status(500).json({ message: 'Error al marcar el documento anterior como no vigente' });
      }

      const insertNewDocumentSql = `INSERT INTO politica_privacidad (version, file, createdAt, validUntil, deleted) VALUES (?, ?, ?, ?, 0)`;
      pool.query(insertNewDocumentSql, [newVersion, fileData, createdAt, validUntil], (err, result) => {
        if (err) {
          console.error('Error al guardar el nuevo documento en la base de datos:', err);
          return res.status(500).json({ message: 'Error al guardar el nuevo documento en la base de datos' });
        }
        res.status(200).json({ message: 'Documento de Aviso de Privacidad subido exitosamente', documentId: result.insertId, version: newVersion });
      });
    });
  });
});


app.get('/documents-aviso-privacidad', (req, res) => {
  const sql = `SELECT id, version, createdAt, validUntil, deleted FROM politica_privacidad`;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los documentos de Aviso de Privacidad:', err);
      return res.status(500).json({ message: 'Error al obtener los documentos' });
    }
    res.json(results); // Enviar la lista de documentos
  });
});

app.get('/documents-aviso-privacidad/:id', (req, res) => {
  const { id } = req.params;

  const sql = `SELECT file, version FROM politica_privacidad WHERE id = ?`;
  pool.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el documento:', err);
      return res.status(500).json({ message: 'Error al obtener el documento' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    const document = results[0];

    // Configurar los encabezados para la descarga del archivo
    res.setHeader('Content-Disposition', `attachment; filename="aviso_privacidad_version_${document.version}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(document.file); // Enviar el archivo binario
  });
});
app.post('/delete-aviso-privacidad/:id', (req, res) => {
  const { id } = req.params;

  const sql = `UPDATE politica_privacidad SET deleted = 1 WHERE id = ?`;
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al marcar el documento como no vigente:', err);
      return res.status(500).json({ message: 'Error al marcar el documento como no vigente' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    res.status(200).json({ message: 'Documento de Aviso de Privacidad marcado como no vigente exitosamente' });
  });
});


app.post('/upload-terminos-condiciones', upload.single('file'), (req, res) => {
  const { validUntil } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }

  const fileData = req.file.buffer; // Archivo binario
  const createdAt = new Date();     // Fecha de creación

  // Buscar la versión del último documento vigente
  const getLastVersionSql = `SELECT version FROM terminos_condiciones WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1`;
  pool.query(getLastVersionSql, (err, results) => {
    if (err) {
      console.error('Error al obtener la última versión:', err);
      return res.status(500).json({ message: 'Error al obtener la última versión' });
    }

    let newVersion = "1.0"; // Versión inicial si no hay documentos previos
    if (results.length > 0 && results[0].version) {
      newVersion = (parseFloat(results[0].version) + 1.0).toFixed(1); // Incrementar la versión del último documento
    }

    // Marcar el último documento vigente como no vigente (deleted = 1)
    const markOldDocumentsSql = `UPDATE terminos_condiciones SET deleted = 1 WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1`;
    pool.query(markOldDocumentsSql, (err) => {
      if (err) {
        console.error('Error al marcar el documento anterior como no vigente:', err);
        return res.status(500).json({ message: 'Error al marcar el documento anterior como no vigente' });
      }

      // Insertar el nuevo documento con la nueva versión
      const insertNewDocumentSql = `INSERT INTO terminos_condiciones (version, file, createdAt, validUntil, deleted) VALUES (?, ?, ?, ?, 0)`;
      pool.query(insertNewDocumentSql, [newVersion, fileData, createdAt, validUntil], (err, result) => {
        if (err) {
          console.error('Error al guardar el nuevo documento en la base de datos:', err);
          return res.status(500).json({ message: 'Error al guardar el nuevo documento en la base de datos' });
        }
        res.status(200).json({ message: 'Documento de Términos y Condiciones subido exitosamente', documentId: result.insertId, version: newVersion });
      });
    });
  });
});


app.get('/documents-terminos-condiciones', (req, res) => {
  const sql = `SELECT id, version, createdAt, validUntil, deleted FROM terminos_condiciones`;
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los documentos de Términos y Condiciones:', err);
      return res.status(500).json({ message: 'Error al obtener los documentos' });
    }
    res.json(results); // Enviar la lista de documentos
  });
});

app.get('/documents-terminos-condiciones/:id', (req, res) => {
  const { id } = req.params;

  const sql = `SELECT file, version FROM terminos_condiciones WHERE id = ?`;
  pool.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error al obtener el documento:', err);
      return res.status(500).json({ message: 'Error al obtener el documento' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    const document = results[0];

    // Configurar los encabezados para la descarga del archivo
    res.setHeader('Content-Disposition', `attachment; filename="terminos_condiciones_version_${document.version}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(document.file); // Enviar el archivo binario
  });
});

app.post('/delete-terminos-condiciones/:id', (req, res) => {
  const { id } = req.params;

  const sql = `UPDATE terminos_condiciones SET deleted = 1 WHERE id = ?`;
  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al marcar el documento como no vigente:', err);
      return res.status(500).json({ message: 'Error al marcar el documento como no vigente' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }

    res.status(200).json({ message: 'Documento de Términos y Condiciones marcado como no vigente exitosamente' });
  });
});

// Ruta para descargar el documento de Términos y Condiciones
app.get('/download-terminos-condiciones', (req, res) => {
  const sql = 'SELECT file, version FROM terminos_condiciones WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1';
  
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener Términos y Condiciones:', err);
      return res.status(500).json({ message: 'Error al obtener Términos y Condiciones' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró un documento vigente' });
    }

    const document = results[0];
    res.setHeader('Content-Disposition', `attachment; filename="terminos_condiciones_v${document.version}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(document.file);
  });
});

// Ruta para descargar el documento de Política de Privacidad
app.get('/download-politica-privacidad', (req, res) => {
  const sql = 'SELECT file, version FROM politica_privacidad WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1';
  
  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener Política de Privacidad:', err);
      return res.status(500).json({ message: 'Error al obtener Política de Privacidad' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró un documento vigente' });
    }

    const document = results[0];
    res.setHeader('Content-Disposition', `attachment; filename="politica_privacidad_v${document.version}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(document.file);
  });
});

// Ruta para descargar el documento de Deslinde Legal
app.get('/download-deslinde-legal', (req, res) => {
  const sql = 'SELECT file, version FROM deslinde_legal WHERE deleted = 0 ORDER BY createdAt DESC LIMIT 1';

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener el documento de Deslinde Legal:', err);
      return res.status(500).json({ message: 'Error al obtener el documento de Deslinde Legal' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró un documento vigente' });
    }

    const document = results[0];
    res.setHeader('Content-Disposition', `attachment; filename="deslinde_legal_v${document.version}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(document.file);
  });
});


// Funciones de sanitización y validación
function sanitizeText(text, maxLength = 50) {
  if (!text || typeof text !== 'string') return '';
  return validator.escape(text.trim()).substring(0, maxLength);
}

function isValidEmail(email) {
  return validator.isEmail(email);
}

function isValidPhoneNumber(phone) {
  return validator.isMobilePhone(phone, 'es-MX'); // Ejemplo para números de México
}

function sanitizeNumber(input, maxLength = 20) {
  return validator.whitelist(input.toString(), '0-9').substring(0, maxLength);
}

app.post('/register', csrfProtection, async (req, res) => {
  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    correo,
    puesto,
    tieneMaestria,
    nombreMaestria,
    tieneDoctorado,
    nombreDoctorado,
    estatus,
    numeroTrabajador,
    numeroSindicalizado,
    usuarios,
    password,
  } = req.body;

  // Sanitizar entradas
  const sanitizedNombre = sanitizeText(nombre);
  const sanitizedApellidoPaterno = sanitizeText(apellidoPaterno);
  const sanitizedApellidoMaterno = sanitizeText(apellidoMaterno);
  const sanitizedTelefono = sanitizeNumber(telefono, 10);
  const sanitizedCorreo = correo.trim().toLowerCase();
  const sanitizedPuesto = sanitizeText(puesto, 100);
  const sanitizedNumeroTrabajador = sanitizeNumber(numeroTrabajador);
  const sanitizedNumeroSindicalizado = sanitizeNumber(numeroSindicalizado);
  const sanitizedUsuarios = sanitizeText(usuarios, 30);
  const sanitizedPassword = password.trim();

  // Validar campos requeridos
  if (!sanitizedUsuarios || !sanitizedPassword || !sanitizedNombre || !sanitizedApellidoPaterno || !sanitizedApellidoMaterno || !sanitizedTelefono || !sanitizedCorreo || !sanitizedPuesto) {
    return res.status(400).send('Todos los campos son requeridos.');
  }

  // Validaciones específicas
  // Validar nombre y apellidos
  if (!/^[a-zA-Z\s]+$/.test(sanitizedNombre) || sanitizedNombre.length < 2 || sanitizedNombre.length > 50) {
    return res.status(400).send('Nombre inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.');
  }
  if (!/^[a-zA-Z\s]+$/.test(sanitizedApellidoPaterno) || sanitizedApellidoPaterno.length < 2 || sanitizedApellidoPaterno.length > 50) {
    return res.status(400).send('Apellido paterno inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.');
  }
  if (!/^[a-zA-Z\s]*$/.test(sanitizedApellidoMaterno) || sanitizedApellidoMaterno.length > 50) {
    return res.status(400).send('Apellido materno inválido. Debe contener solo letras y tener hasta 50 caracteres.');
  }

  // Validar teléfono
  if (!isValidPhoneNumber(sanitizedTelefono)) {
    return res.status(400).send('Teléfono inválido. Debe ser un número de 10 dígitos.');
  }

  // Validar correo electrónico
  if (!isValidEmail(sanitizedCorreo)) {
    return res.status(400).send('Correo electrónico inválido.');
  }

  // Validar puesto
  if (!/^[a-zA-Z\s]+$/.test(sanitizedPuesto) || sanitizedPuesto.length < 2 || sanitizedPuesto.length > 100) {
    return res.status(400).send('Puesto inválido. Debe contener solo letras y tener entre 2 y 100 caracteres.');
  }

  // Validar estatus
  const validEstatus = ['Titulado', 'Pasante'];
  if (!validEstatus.includes(estatus)) {
    return res.status(400).send(`Estatus inválido. Debe ser uno de los siguientes: ${validEstatus.join(', ')}`);
  }

  // Validar número de trabajador y sindicalizado
  if (!/^\d+$/.test(sanitizedNumeroTrabajador) || sanitizedNumeroTrabajador.length < 1 || sanitizedNumeroTrabajador.length > 20) {
    return res.status(400).send('Número de trabajador inválido. Debe ser un número.');
  }
  if (!/^\d+$/.test(sanitizedNumeroSindicalizado) || sanitizedNumeroSindicalizado.length < 1 || sanitizedNumeroSindicalizado.length > 20) {
    return res.status(400).send('Número de sindicalizado inválido. Debe ser un número.');
  }

  // Validación de la fortaleza de la contraseña
  const passwordStrength = zxcvbn(sanitizedPassword);
  if (passwordStrength.score < 3) {
    return res.status(400).send('La contraseña es demasiado débil.');
  }

  // Verificar si la contraseña ha sido comprometida usando HIBP
  try {
    const pwnedCount = await pwnedPassword(sanitizedPassword);
    if (pwnedCount > 0) {
      return res.status(400).send(`La contraseña ha sido comprometida en ${pwnedCount} filtraciones. Por favor, elige una diferente.`);
    }
  } catch (error) {
    console.error('Error al verificar la contraseña en HIBP:', error);
    return res.status(500).send('Error al verificar la seguridad de la contraseña.');
  }

  // Encriptar contraseña
  bcrypt.hash(sanitizedPassword, 10, (err, hash) => {
    if (err) return res.status(500).send('Error al encriptar la contraseña');

    const sql = `INSERT INTO users 
    (nombre, apellido_paterno, apellido_materno, telefono, correo, puesto, tiene_maestria, maestrias, tiene_doctorado, doctorados, esta_titulado, numero_trabajador, numero_sindicalizado, usuarios, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(sql, [
      sanitizedNombre, sanitizedApellidoPaterno, sanitizedApellidoMaterno, sanitizedTelefono, sanitizedCorreo, sanitizedPuesto,
      tieneMaestria, sanitizeText(nombreMaestria), tieneDoctorado, sanitizeText(nombreDoctorado), estatus,
      sanitizedNumeroTrabajador, sanitizedNumeroSindicalizado, sanitizedUsuarios, hash
    ], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send('El usuario ya está registrado.');
        }
        console.error('Error en la consulta a la base de datos:', err);
        return res.status(500).send('Error en la base de datos');
      }
      //res.status(200).send('Usuario registrado con éxito');

      const userId = result.insertId;
      // Llamar a la función de envío de correo de verificación
      enviarEmailVerificacion(sanitizedCorreo, userId)
        .then((emailResult) => {
          if (!emailResult.success) {
            return res.status(500).send('Error al enviar el correo de verificación');
          }
          return res.status(200).send('Usuario registrado con éxito. Se ha enviado un correo de verificación.');
        })
        .catch((error) => {
          console.error('Error al enviar el correo de verificación:', error);
          return res.status(500).send('Error al enviar el correo de verificación');
        });
    });
  });
});
/*// Ruta de registro sin reCAPTCHA
app.post('/register', async (req, res) => {

  const {
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    correo,
    puesto,
    tieneMaestria,
    nombreMaestria,
    tieneDoctorado,
    nombreDoctorado,
    estatus,
    numeroTrabajador,
    numeroSindicalizado,
    usuarios,
    password,
  } = req.body;

  // Validar campos requeridos
  if (!usuarios || !password || !nombre || !apellidoPaterno || !apellidoMaterno || !telefono || !correo || !puesto) {
    return res.status(400).send('Todos los campos son requeridos.');
  }

  // Validaciones específicas
  // 1. Validar nombre (debe ser alfabético y tener una longitud razonable)
  if (!/^[a-zA-Z\s]+$/.test(nombre) || nombre.length < 2 || nombre.length > 50) {
    return res.status(400).send('Nombre inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.');
  }

  // 2. Validar apellidos (similares al nombre)
  if (!/^[a-zA-Z\s]+$/.test(apellidoPaterno) || apellidoPaterno.length < 2 || apellidoPaterno.length > 50) {
    return res.status(400).send('Apellido paterno inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.');
  }

  if (!/^[a-zA-Z\s]*$/.test(apellidoMaterno) || apellidoMaterno.length > 50) {
    return res.status(400).send('Apellido materno inválido. Debe contener solo letras y tener hasta 50 caracteres.');
  }

  // 3. Validar teléfono (asegúrate de que sea un número y tenga una longitud específica)
  if (!/^\d{10}$/.test(telefono)) {
    return res.status(400).send('Teléfono inválido. Debe ser un número de 10 dígitos.');
  }

  // 4. Validar correo (puedes usar una expresión regular básica)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).send('Correo electrónico inválido.');
  }

  // 5. Validar puesto (longitud y caracteres permitidos)
  if (!/^[a-zA-Z\s]+$/.test(puesto) || puesto.length < 2 || puesto.length > 100) {
    return res.status(400).send('Puesto inválido. Debe contener solo letras y tener entre 2 y 100 caracteres.');
  }

  // 6. Validar estatus (si es un valor específico, como "titulado" o "pasante")
  const validEstatus = ['Titulado', 'Pasante'];
  if (!validEstatus.includes(estatus)) {
    return res.status(400).send(`Estatus inválido. Debe ser uno de los siguientes: ${validEstatus.join(', ')}`);
  }

  // 7. Validar el número de trabajador y sindicalizado (números, longitud específica)
  if (!/^\d+$/.test(numeroTrabajador) || numeroTrabajador.length < 1 || numeroTrabajador.length > 20) {
    return res.status(400).send('Número de trabajador inválido. Debe ser un número.');
  }

  if (!/^\d+$/.test(numeroSindicalizado) || numeroSindicalizado.length < 1 || numeroSindicalizado.length > 20) {
    return res.status(400).send('Número de sindicalizado inválido. Debe ser un número.');
  }

  // Validaciones de entrada
  if (!usuarios || !password) {
    return res.status(400).send('Usuario y contraseña son requeridos.');
  }

  // Validación de la fortaleza de la contraseña
  const passwordStrength = zxcvbn(password);
  if (passwordStrength.score < 3) {
    console.warn('Advertencia: La contraseña es débil.');

  }
  // Verificar si la contraseña ha sido comprometida usando HIBP
  try {
    const pwnedCount = await pwnedPassword(password);
    if (pwnedCount > 0) {
      return res.status(400).send(`La contraseña ha sido comprometida en ${pwnedCount} filtraciones. Por favor, elige una diferente.`);
    }
  } catch (error) {
    console.error('Error al verificar la contraseña en HIBP:', error);
    return res.status(500).send('Error al verificar la seguridad de la contraseña.');
  }

  // Encriptar contraseña
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).send('Error al encriptar la contraseña');

    const sql = `INSERT INTO users 
    (nombre, apellido_paterno, apellido_materno, telefono, correo, puesto, tiene_maestria, maestrias, tiene_doctorado, doctorados, esta_titulado, numero_trabajador, numero_sindicalizado, usuarios, password) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;


    pool.query(sql, [
      nombre, apellidoPaterno, apellidoMaterno, telefono, correo, puesto,
      tieneMaestria, nombreMaestria, tieneDoctorado, nombreDoctorado, estatus,
      numeroTrabajador, numeroSindicalizado, usuarios, hash
    ], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).send('El usuario ya está registrado.');
        }
        console.error('Error en la consulta a la base de datos:', err);
        return res.status(500).send('Error en la base de datos');
      }
      res.status(200).send('Usuario registrado con éxito');
    });
  });
});*/

// Ruta protegida para administradores
app.get('/admin-dashboard', verifyAdmin, (req, res) => {
  res.send('Bienvenido al panel de administración');
});

// Ruta protegida para usuarios regulares
app.get('/user-dashboard', verifyUser, (req, res) => {
  res.send('Bienvenido al panel de usuario');
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
  const { usuarios, password, recaptchaToken } = req.body;

   // Verificación básica de entradas
   if (!usuarios || !password || !recaptchaToken) {
    return res.status(400).json({ message: 'Todos los campos son requeridos.' });
  }

  // Sanitización del usuario
  const sanitizedUsuarios = validator.escape(usuarios.trim());

  // Validar longitud y formato de usuario (e.g., longitud mínima de 4 caracteres)
  if (sanitizedUsuarios.length < 4 || sanitizedUsuarios.length > 50) {
    return res.status(400).json({ message: 'Credenciales incorrectas.' });
  }

  // Verificar el token reCAPTCHA con Google
  const secretKey = '6LdkUWIqAAAAALb-T3v7NgI8esXjmpdwns3jG729'; // Reemplazar con tu clave secreta de reCAPTCHA
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  axios.post(verificationUrl)
    .then(response => {
      if (!response.data.success) {
        return res.status(400).json({ message: 'Error de autenticación. Inténtalo nuevamente.' });
      }

      // Si reCAPTCHA es válido, continuar con el proceso de inicio de sesión
      const sql = 'SELECT * FROM users WHERE usuarios = ?';
      pool.query(sql, [usuarios], (err, results) => {
        if (err || results.length === 0) {
          return res.status(400).json({ message: 'Usuario no encontrado.' });
        }

        const user = results[0];

        // Verificar si la cuenta está bloqueada
        if (user.bloqueadoHasta && new Date(user.bloqueadoHasta) > new Date()) {
          return res.status(403).json({ message: 'Cuenta temporalmente bloqueada. Inténtalo más tarde.' });
        }

        // Comparar contraseñas
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (!isMatch) {
            // Incrementar el contador de intentos fallidos
            const intentosFallidos = user.intentosFallidos ? user.intentosFallidos + 1 : 1;

            // Bloquear la cuenta si se superan los intentos permitidos
            let bloqueadoHasta = null;
            if (intentosFallidos >= 5) {
              bloqueadoHasta = new Date(Date.now() + 30 * 60 * 1000); // Bloquear por 30 minutos
            }

            // Actualizar los intentos fallidos y el estado de bloqueo
            const sqlUpdate = 'UPDATE users SET intentosFallidos = ?, bloqueadoHasta = ? WHERE usuarios = ?';
            pool.query(sqlUpdate, [intentosFallidos, bloqueadoHasta, usuarios], (err) => {
              if (err) {
                return res.status(500).json({ message: 'Error en el servidor.' });
              }
              return res.status(400).json({ message: 'Credenciales incorrectas.' });
            });
          } else {
            // Reiniciar intentos fallidos y bloqueos si la contraseña es correcta
            const sqlReset = 'UPDATE users SET intentosFallidos = 0, bloqueadoHasta = NULL WHERE usuarios = ?';
            pool.query(sqlReset, [usuarios], (err) => {
              if (err) {
                return res.status(500).json({ message: 'Error al reiniciar los intentos fallidos.' });
              }

              // Regenerar la sesión después de un inicio de sesión exitoso
              req.session.regenerate(function (err) {
                if (err) {
                  return res.status(500).json({ message: 'Error al regenerar la sesion.' });
                }
                console.log('ID de sesión generado:', req.sessionID);

                // Almacenar información relevante en la sesión
                req.session.userId = user.id; // Almacena el ID del usuario
                req.session.username = user.usuarios; // Almacena el nombre de usuario

                // Generar el código de verificación
                const codigoVerificacion = Math.floor(100000 + Math.random() * 900000);
                const expiracion = new Date(Date.now() + 5 * 60 * 1000);

                // Actualiza la base de datos con el código y la expiración
                const sqlUpdate = 'UPDATE users SET codigo_verificacion = ?, codigo_expiracion = ? WHERE usuarios = ?';
                pool.query(sqlUpdate, [codigoVerificacion, expiracion, usuarios], async (err) => {
                  if (err) {
                    return res.status(500).send('Error al actualizar el código de verificación.');
                  }

                  // Llama a la función enviarCodigoVerificacion
                  const result = await enviarCodigoVerificacion(user.correo, codigoVerificacion);

                  if (!result.success) {
                    return res.status(500).send(result.message);
                  }
                  // Almacenar información relevante en la sesión
                  req.session.userId = user.id;
                  req.session.username = user.usuarios;

                  // Establecer el tiempo de expiración de la sesión
                  req.session.cookie.expires = new Date(Date.now() + 30 * 60 * 1000);  // 30 minutos
                  req.session.cookie.maxAge = 30 * 60 * 1000;  // Sesiones basadas en actividad

                  // Generar el token incluyendo el rol
                  const token = jwt.sign({ id: user.id, usuarios: user.usuarios, role: user.role }, process.env.JWT_SECRET || 'mi_secreto', {
                    expiresIn: '1h',
                  });

                  // Retornar el token al cliente
                  return res.status(200).json({
                    token, // El token JWT
                    message: 'Inicio de sesión exitoso',
                    userId: user.id
                  });
                });
              });
            });
          }
        });
      });
    })
    .catch(error => {
      console.error('Error en la verificación de reCAPTCHA:', error);
      res.status(500).send('Error en la verificación de reCAPTCHA');
    });
});

// Ruta para verificar si el token JWT es válido
// Ruta para verificar si el token JWT es válido
app.get('/check-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado

  if (!token) {
    return res.status(401).json({ valid: false, message: 'Token no proporcionado' });
  }

  // Verificar el token
  jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto', (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false, message: 'Token inválido' });
    }

    // Si el token es válido, devolver una respuesta positiva
    return res.status(200).json({ valid: true, userId: decoded.id });
  });
});



app.get('/check-session', (req, res) => {
  console.log('Sesión actual:', req.session); // Esto imprimirá la sesión actual en cada solicitud
  if (req.session && req.session.userId) {
    return res.status(200).json({ loggedIn: true, userId: req.session.userId });
  }
  return res.status(200).json({ loggedIn: false });
});


// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
  // Destruir la sesión de connect.sid
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }

    // Limpiar la cookie del token JWT
    res.clearCookie('token'); // Asegúrate de que este nombre coincida con el que usas para el token
    res.status(200).send('Sesión cerrada con éxito');
  });
});

// Ruta para verificar el código de verificación
app.post('/verify-code', (req, res) => {
  const { usuarios, codigoVerificacion } = req.body;

  const sql = 'SELECT codigo_verificacion, codigo_expiracion FROM users WHERE usuarios = ?';
  pool.query(sql, [usuarios], (err, results) => {
    if (err) {
      return res.status(500).send('Error en la consulta de la base de datos.');
    }

    if (results.length === 0) {
      return res.status(400).send('Usuario no encontrado.');
    }

    const user = results[0];

    // Comprobar si el código de verificación es correcto
    if (user.codigo_verificacion !== codigoVerificacion) {
      return res.status(400).send('Código de verificación incorrecto.');
    }

    // Comprobar si el código ha expirado
    if (new Date() > new Date(user.codigo_expiracion)) {
      return res.status(400).send('El código de verificación ha expirado.');
    }


    return res.status(200).send('Código de verificación correcto. Bienvenido!');
  });
});

// Ruta para cambiar contraseña
// Ruta para solicitar la recuperación de contraseña
app.post('/recover-password', (req, res) => {
  const { email } = req.body;

  console.log("Recibiendo solicitud de recuperación para:", email);

  // Buscar al usuario por correo electrónico
  const userQuery = 'SELECT * FROM users WHERE correo = ?';
  pool.query(userQuery, [email], (err, results) => {
    if (err) {
      console.error('Error en la consulta de la base de datos:', err);
      return res.status(500).json({ message: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      console.log("Usuario no encontrado para:", email);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Generar un token de restablecimiento
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora de expiración
    const formattedExpires = expires.toISOString().slice(0, 19).replace('T', ' ');

    console.log("Token generado:", token);
    console.log("Fecha de expiración:", formattedExpires);

    // Actualizar la base de datos con el token y la fecha de expiración
    const updateQuery = 'UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?';
    pool.query(updateQuery, [token, formattedExpires, user.id], (err) => {
      if (err) {
        console.error('Error al actualizar el token de recuperación:', err);
        return res.status(500).json({ message: 'Error al actualizar la base de datos' });
      }

      // Configurar nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: '20221042@uthh.edu.mx',
          pass: 'izbq sext sumd xkcu',
        },
      });

      // Enviar el correo electrónico
      const mailOptions = {
        from: '20221042@uthh.edu.mx',
        to: email,
        subject: 'Recuperación de Contraseña',
        text: `Haz clic en el siguiente enlace para restablecer tu contraseña: https://sututeh.isoftuthh.com/new-password?token=${token}`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error al enviar el correo:', err);
          return res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
        }

        console.log("Correo enviado con éxito a:", email);
        res.status(200).json({ message: 'Correo de recuperación enviado' });
      });
    });
  });
});



// Ruta para establecer una nueva contraseña
// Ruta para establecer una nueva contraseña
app.post('/reset-password', (req, res) => {
  const { token, newPassword } = req.body;  // Aquí recibimos el token y la nueva contraseña

  // Verificar que ambos campos estén presentes
  if (!token || !newPassword) {
    return res.status(400).send('Token y nueva contraseña son requeridos.');
  }

  // Verificar el token y que no haya expirado
  const sql = 'SELECT * FROM users WHERE reset_token = ? AND reset_expires > NOW()';
  pool.query(sql, [token], (err, results) => {
    if (err) {
      console.error('Error en la consulta a la base de datos:', err);
      return res.status(500).send('Error en la base de datos');
    }

    if (results.length === 0) {
      return res.status(400).send('Token inválido o expirado.');
    }
    const userId = results[0].id;  // Extraemos el ID del usuario
    console.log('ID del usuario encontrado:', userId);  // Asegurarnos de que el ID se obtiene correctamente

    // Encriptar la nueva contraseña
    // Encriptar la nueva contraseña
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) {
        console.error('Error al encriptar la contraseña:', err);
        return res.status(500).send('Error al encriptar la contraseña.');
      }

      // Actualizar la contraseña, borrar el token, su expiración y restablecer intentosFallidos y bloqueadoHasta
      const updateSql = `UPDATE users 
                         SET password = ?, 
                             reset_token = NULL, 
                             reset_expires = NULL, 
                             intentosFallidos = 0, 
                             bloqueadoHasta = NULL 
                         WHERE id = ?`;

      pool.query(updateSql, [hash, userId], (err, updateResult) => {
        if (err) {
          console.error('Error al actualizar los campos:', err);
          return res.status(500).send('Error al actualizar la base de datos.');
        }

        // Verifica si la consulta afectó alguna fila
        if (updateResult.affectedRows === 0) {
          console.warn('No se encontró el usuario o no se pudo actualizar.');
          return res.status(400).send('No se encontró el usuario o no se pudo actualizar.');
        }

        console.log('Contraseña actualizada y campos reiniciados con éxito.');
        res.status(200).send('Contraseña actualizada y cuenta desbloqueada con éxito.');
      });
    });
  });
});

// Puerto del servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
