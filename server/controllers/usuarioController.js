// Exemplo de controlador atualizado para Usuários usando Sequelize
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// @desc    Registrar um novo usuário
// @route   POST /api/usuarios
// @access  Público
exports.registrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    // Verificar se o usuário já existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criar o usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo: tipo || 'cliente'
    });

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (err) {
    logger.error(`Erro ao registrar usuário: ${err.message}`);
    res.status(500).json({ message: 'Erro ao registrar usuário', error: err.message });
  }
};

// @desc    Login de usuário
// @route   POST /api/usuarios/login
// @access  Público
exports.loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ 
      where: { email },
      attributes: { include: ['senha'] } // Incluir o campo senha que normalmente é excluído
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Atualizar último acesso
    usuario.ultimo_acesso = new Date();
    await usuario.save();

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, tipo: usuario.tipo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (err) {
    logger.error(`Erro no login: ${err.message}`);
    res.status(500).json({ message: 'Erro no login', error: err.message });
  }
};

// @desc    Obter perfil do usuário atual
// @route   GET /api/usuarios/perfil
// @access  Privado
exports.getPerfilUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({
      success: true,
      usuario
    });
  } catch (err) {
    logger.error(`Erro ao obter perfil: ${err.message}`);
    res.status(500).json({ message: 'Erro ao obter perfil', error: err.message });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/usuarios/perfil
// @access  Privado
exports.atualizarPerfilUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizar campos
    if (req.body.nome) usuario.nome = req.body.nome;
    if (req.body.email) usuario.email = req.body.email;
    if (req.body.senha) usuario.senha = req.body.senha;

    await usuario.save();

    res.status(200).json({
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });
  } catch (err) {
    logger.error(`Erro ao atualizar perfil: ${err.message}`);
    res.status(500).json({ message: 'Erro ao atualizar perfil', error: err.message });
  }
};

// @desc    Listar todos os usuários (apenas admin)
// @route   GET /api/usuarios
// @access  Privado/Admin
exports.listarUsuarios = async (req, res) => {
  try {
    // Verificar se é admin
    if (req.usuario.tipo !== 'admin') {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }

    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] }
    });

    res.status(200).json({
      success: true,
      count: usuarios.length,
      usuarios
    });
  } catch (err) {
    logger.error(`Erro ao listar usuários: ${err.message}`);
    res.status(500).json({ message: 'Erro ao listar usuários', error: err.message });
  }
};
