/**
 * Utilitários de autenticação para o sistema Casa das Máquinas
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('./logger');

/**
 * Gera um token JWT para o usuário
 * @param {Object} user - Objeto do usuário
 * @returns {String} Token JWT
 */
const generateToken = (id, tipo) => {
  return jwt.sign(
    { 
      id: id,
      tipo: tipo 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE 
    }
  );
};

/**
 * Verifica se a senha fornecida corresponde à senha armazenada
 * @param {String} enteredPassword - Senha fornecida pelo usuário
 * @param {String} storedPassword - Senha armazenada no banco de dados
 * @returns {Promise<Boolean>} Resultado da comparação
 */
const matchPassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

/**
 * Criptografa uma senha
 * @param {String} password - Senha a ser criptografada
 * @returns {Promise<String>} Senha criptografada
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

module.exports = {
  generateToken,
  matchPassword,
  hashPassword
};
