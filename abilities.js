// abilities.js
const { AbilityBuilder, Ability } = require('@casl/ability');

function defineAbilitiesFor(role) {
  const { can, cannot, rules } = new AbilityBuilder(Ability);

  switch (role) {
    case 'admin':
      can('manage', 'all');  // Admin puede hacer todo
      break;
    case 'diseñador':
      can(['read', 'update'], 'Post');  // Editor puede leer y editar posts
      cannot('delete', 'Post');         // No puede eliminar
      break;
    case 'colaborador':
      can('read', 'Post');   // Viewer solo puede leer
      break;
    default:
      cannot('manage', 'all');  // Sin permisos
  }

  return new Ability(rules);
}

module.exports = { defineAbilitiesFor };
