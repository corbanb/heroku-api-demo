var requireDirectory = require('require-directory');

function rename(name) {
  var newName = name.replace('Service', '');
  return newName.toLowerCase();
}

module.exports = requireDirectory(module, {rename: rename});
