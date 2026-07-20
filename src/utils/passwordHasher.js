const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const PasswordHasher = {
  hash(senhaPura) {
    return bcrypt.hash(senhaPura, SALT_ROUNDS);
  },

  comparar(senhaPura, hash) {
    return bcrypt.compare(senhaPura, hash);
  },
};

module.exports = PasswordHasher;
