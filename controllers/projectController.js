const { Project } = require('../models');

// Crear un nuevo proyecto
const createProject = async (req, res) => {
  try {
    const { nombre, codigo } = req.body;

    const nuevoProyecto = await Project.create({
      nombre,
      codigo,
      userId: req.user.id, // Id del usuario autenticado
    });

    res.status(201).json(nuevoProyecto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear proyecto' });
  }
};



// Obtener todos los proyectos del usuario autenticado
const getMyProjects = async (req, res) => {
    try {
      const userId = req.user.id; // Lo saca del token
  
      const proyectos = await Project.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']], // opcional: ordenar por fecha
      });
  
      res.status(200).json(proyectos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener proyectos' });
    }
  };

module.exports = {
  createProject,
  getMyProjects,
};
