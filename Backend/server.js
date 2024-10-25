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


// Middleware
app.use(cookieParser());
app.use(express.json());

// Configuración de CORS
const corsOptions = {
  origin: ['http://localhost:8080', 'https://sututeh.isoftuthh.com'], // Orígenes permitidos
  methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  credentials: true // Permitir credenciales (cookies)
};

app.use(cors(corsOptions)); // Aplicar CORS con las opciones definidas

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

// Ruta de registro sin reCAPTCHA
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
});

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

  // Verificar el token reCAPTCHA con Google
  const secretKey = '6LdkUWIqAAAAALb-T3v7NgI8esXjmpdwns3jG729'; // Reemplazar con tu clave secreta de reCAPTCHA
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  axios.post(verificationUrl)
    .then(response => {
      if (!response.data.success) {
        return res.status(400).send('reCAPTCHA fallido. Inténtalo nuevamente.');
      }

      // Si reCAPTCHA es válido, continuar con el proceso de inicio de sesión
      const sql = 'SELECT * FROM users WHERE usuarios = ?';
      pool.query(sql, [usuarios], (err, results) => {
        if (err || results.length === 0) {
          return res.status(400).send('Usuario no encontrado');
        }

        const user = results[0];

        // Verificar si la cuenta está bloqueada
        if (user.bloqueadoHasta && new Date(user.bloqueadoHasta) > new Date()) {
          return res.status(403).send('Cuenta bloqueada. Intenta de nuevo más tarde.');
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
                return res.status(500).send('Error al actualizar los intentos fallidos.');
              }
              return res.status(400).send('Contraseña incorrecta');
            });
          } else {
            // Reiniciar intentos fallidos y bloqueos si la contraseña es correcta
            const sqlReset = 'UPDATE users SET intentosFallidos = 0, bloqueadoHasta = NULL WHERE usuarios = ?';
            pool.query(sqlReset, [usuarios], (err) => {
              if (err) {
                return res.status(500).send('Error al reiniciar los intentos fallidos.');
              }

              // Regenerar la sesión después de un inicio de sesión exitoso
              req.session.regenerate(function (err) {
                if (err) {
                  return res.status(500).send('Error al regenerar la sesión.');
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
