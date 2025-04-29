// const app = require('./app');
// const http = require('http');
// const { Server } = require('socket.io');
// const logger = require('./logger');   // ✅ Agregado Winston

// const PORT = process.env.PORT || 4000;

// // Crear servidor HTTP
// const server = http.createServer(app);

// // Configurar Socket.IO con CORS abierto (ajustar en producción)
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// // Almacén de datos por sala
// const roomCodes = {};        // Para el editor de código
// const roomElements = {};     // Para los elementos del lienzo
// const roomMetadata = {};     // 🔹 NUEVO: Metadatos de la sala

// // Conexión de clientes
// io.on('connection', (socket) => {
//     console.log('🟢 Cliente conectado:', socket.id);
//     logger.info(`🟢 Cliente conectado: ${socket.id}`);

//     // Unirse a una sala específica
//     socket.on('join-room', (roomid) => {
//         socket.join(roomid);
//         console.log(`✅ Cliente ${socket.id} se unió a la sala ${roomid}`);
//         logger.info(`✅ Cliente ${socket.id} se unió a la sala ${roomid}`);

//         // Enviar código si existe
//         if (roomCodes[roomid]) {
//             socket.emit("load_code", roomCodes[roomid]);
//         }

//         // Enviar elementos del lienzo si existen
//         if (roomElements[roomid]) {
//             socket.emit("load-elements", roomElements[roomid]);
//         } else {
//             roomElements[roomid] = [];
//             socket.emit("load-elements", []);
//         }

//         // 🔹 Enviar metadatos de la sala
//         if (roomMetadata[roomid]) {
//             socket.emit("room-metadata", roomMetadata[roomid]);
//         } else {
//             // Inicializar con valores por defecto si no existe
//             roomMetadata[roomid] = { 
//                 name: `Sala ${roomid}`, 
//                 description: "Sin descripción", 
//                 owner: socket.id, 
//                 createdAt: new Date().toISOString() 
//             };
//             socket.emit("room-metadata", roomMetadata[roomid]);
//         }
//     });

//     // Manejo de cambios en el editor de código
//     socket.on('code-change', ({ roomid, code }) => {
//         roomCodes[roomid] = code;
//         socket.to(roomid).emit('receive-code', code);
//         logger.info(`💻 Código actualizado en sala ${roomid}`);
//     });

//     // Manejo de cambios en el lienzo
//     socket.on('update-elements', ({ roomid, elements }) => {
//         roomElements[roomid] = elements;
//         io.to(roomid).emit('receive-elements', elements);
//         console.log(`📡 Elementos sincronizados en sala ${roomid}:`, elements.length);
//         logger.info(`📡 Elementos sincronizados en sala ${roomid}: ${elements.length}`);
//     });

//     // 🔹 NUEVO: Editar los metadatos de la sala
//     socket.on('edit-room', ({ roomid, newMetadata }) => {
//         if (!roomMetadata[roomid]) {
//             roomMetadata[roomid] = {};
//         }

//         roomMetadata[roomid] = { 
//             ...roomMetadata[roomid], 
//             ...newMetadata 
//         };

//         // Notificar a todos los usuarios de la sala sobre el cambio
//         io.to(roomid).emit('room-updated', roomMetadata[roomid]);

//         console.log(`✏️ Sala ${roomid} actualizada:`, roomMetadata[roomid]);
//         logger.info(`✏️ Sala ${roomid} actualizada con: ${JSON.stringify(newMetadata)}`);
//     });

//     // Desconexión del cliente
//     socket.on('disconnect', () => {
//         console.log('🔴 Cliente desconectado:', socket.id);
//         logger.warn(`🔴 Cliente desconectado: ${socket.id}`);
//     });
// });

// // Iniciar servidor
// server.listen(PORT, () => {
//     console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
//     logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
// });




const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const logger = require('./logger');   // ✅ Agregado Winston
const db = require('./models');       // ✅ Agregado para sincronizar modelos

const PORT = process.env.PORT || 4000;

// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.IO con CORS abierto (ajustar en producción)
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Almacén de datos por sala
const roomCodes = {};        // Para el editor de código
const roomElements = {};     // Para los elementos del lienzo
const roomMetadata = {};     // 🔹 NUEVO: Metadatos de la sala

// Conexión de clientes
io.on('connection', (socket) => {
    console.log('🟢 Cliente conectado:', socket.id);
    logger.info(`🟢 Cliente conectado: ${socket.id}`);

    // Unirse a una sala específica
    socket.on('join-room', (roomid) => {
        socket.join(roomid);
        console.log(`✅ Cliente ${socket.id} se unió a la sala ${roomid}`);
        logger.info(`✅ Cliente ${socket.id} se unió a la sala ${roomid}`);

        // Enviar código si existe
        if (roomCodes[roomid]) {
            socket.emit("load_code", roomCodes[roomid]);
        }

        // Enviar elementos del lienzo si existen
        if (roomElements[roomid]) {
            socket.emit("load-elements", roomElements[roomid]);
        } else {
            roomElements[roomid] = [];
            socket.emit("load-elements", []);
        }

        // 🔹 Enviar metadatos de la sala
        if (roomMetadata[roomid]) {
            socket.emit("room-metadata", roomMetadata[roomid]);
        } else {
            // Inicializar con valores por defecto si no existe
            roomMetadata[roomid] = { 
                name: `Sala ${roomid}`, 
                description: "Sin descripción", 
                owner: socket.id, 
                createdAt: new Date().toISOString() 
            };
            socket.emit("room-metadata", roomMetadata[roomid]);
        }
    });

    // Manejo de cambios en el editor de código
    socket.on('code-change', ({ roomid, code }) => {
        roomCodes[roomid] = code;
        socket.to(roomid).emit('receive-code', code);
        logger.info(`💻 Código actualizado en sala ${roomid}`);
    });

    // Manejo de cambios en el lienzo
    socket.on('update-elements', ({ roomid, elements }) => {
        roomElements[roomid] = elements;
        io.to(roomid).emit('receive-elements', elements);
        console.log(`📡 Elementos sincronizados en sala ${roomid}:`, elements.length);
        logger.info(`📡 Elementos sincronizados en sala ${roomid}: ${elements.length}`);
    });

    // 🔹 NUEVO: Editar los metadatos de la sala
    socket.on('edit-room', ({ roomid, newMetadata }) => {
        if (!roomMetadata[roomid]) {
            roomMetadata[roomid] = {};
        }

        roomMetadata[roomid] = { 
            ...roomMetadata[roomid], 
            ...newMetadata 
        };

        // Notificar a todos los usuarios de la sala sobre el cambio
        io.to(roomid).emit('room-updated', roomMetadata[roomid]);

        console.log(`✏️ Sala ${roomid} actualizada:`, roomMetadata[roomid]);
        logger.info(`✏️ Sala ${roomid} actualizada con: ${JSON.stringify(newMetadata)}`);
    });

    // Desconexión del cliente
    socket.on('disconnect', () => {
        console.log('🔴 Cliente desconectado:', socket.id);
        logger.warn(`🔴 Cliente desconectado: ${socket.id}`);
    });
});

// Iniciar sincronización de la base de datos y servidor
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Modelos sincronizados correctamente');

    // Iniciar servidor
    server.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al sincronizar modelos:', error);
  });

