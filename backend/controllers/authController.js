// Arquivo de correção para autenticação de administrador
// Este arquivo deve ser salvo como authController.js no diretório controllers do backend

const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// @desc    Autenticar usuário e gerar token
// @route   POST /api/usuarios/login
// @access  Public
const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o email e senha foram fornecidos
    if (!email || !senha) {
      logger.warn('Tentativa de login sem email ou senha');
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor, forneça email e senha' 
      });
    }

    // Verificar se o usuário existe
    const usuario = await Usuario.findOne({ email }).select('+senha');
    
    if (!usuario) {
      logger.warn(`Tentativa de login com email não cadastrado: ${email}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Falha no login. Verifique suas credenciais.' 
      });
    }

    // Verificar se a senha está correta
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    
    if (!senhaCorreta) {
      logger.warn(`Tentativa de login com senha incorreta para: ${email}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Falha no login. Verifique suas credenciais.' 
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario._id, isAdmin: usuario.isAdmin },
      process.env.JWT_SECRET || 'jwt_secret_key_default',
      { expiresIn: '30d' }
    );

    // Log de login bem-sucedido
    logger.info(`Login bem-sucedido: ${email}`);

    // Retornar dados do usuário e token
    res.status(200).json({
      success: true,
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      isAdmin: usuario.isAdmin,
      token
    });
  } catch (error) {
    logger.error(`Erro no login: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Erro no servidor. Tente novamente mais tarde.' 
    });
  }
};

// @desc    Registrar um novo usuário
// @route   POST /api/usuarios
// @access  Public
const registrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se todos os campos foram fornecidos
    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        success: false, 
        message: 'Por favor, preencha todos os campos' 
      });
    }

    // Verificar se o usuário já existe
    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({ 
        success: false, 
        message: 'Usuário já cadastrado' 
      });
    }

    // Criar hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Criar usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      isAdmin: false // Usuários registrados normalmente não são administradores
    });

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario._id, isAdmin: usuario.isAdmin },
      process.env.JWT_SECRET || 'jwt_secret_key_default',
      { expiresIn: '30d' }
    );

    // Log de registro bem-sucedido
    logger.info(`Novo usuário registrado: ${email}`);

    // Retornar dados do usuário e token
    res.status(201).json({
      success: true,
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      isAdmin: usuario.isAdmin,
      token
    });
  } catch (error) {
    logger.error(`Erro no registro: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Erro no servidor. Tente novamente mais tarde.' 
    });
  }
};

// @desc    Obter perfil do usuário
// @route   GET /api/usuarios/perfil
// @access  Private
const getPerfilUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }

    res.status(200).json({
      success: true,
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      isAdmin: usuario.isAdmin
    });
  } catch (error) {
    logger.error(`Erro ao obter perfil: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Erro no servidor. Tente novamente mais tarde.' 
    });
  }
};

// @desc    Atualizar perfil do usuário
// @route   PUT /api/usuarios/perfil
// @access  Private
const atualizarPerfilUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuário não encontrado' 
      });
    }

    // Atualizar campos
    usuario.nome = req.body.nome || usuario.nome;
    usuario.email = req.body.email || usuario.email;

    // Se a senha foi fornecida, atualizar
    if (req.body.senha) {
      const salt = await bcrypt.genSalt(10);
      usuario.senha = await bcrypt.hash(req.body.senha, salt);
    }

    // Salvar alterações
    const usuarioAtualizado = await usuario.save();

    // Gerar novo token JWT
    const token = jwt.sign(
      { id: usuarioAtualizado._id, isAdmin: usuarioAtualizado.isAdmin },
      process.env.JWT_SECRET || 'jwt_secret_key_default',
      { expiresIn: '30d' }
    );

    // Log de atualização bem-sucedida
    logger.info(`Perfil atualizado: ${usuario.email}`);

    // Retornar dados atualizados
    res.status(200).json({
      success: true,
      _id: usuarioAtualizado._id,
      nome: usuarioAtualizado.nome,
      email: usuarioAtualizado.email,
      isAdmin: usuarioAtualizado.isAdmin,
      token
    });
  } catch (error) {
    logger.error(`Erro ao atualizar perfil: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      message: 'Erro no servidor. Tente novamente mais tarde.' 
    });
  }
};

module.exports = {
  loginUsuario,
  registrarUsuario,
  getPerfilUsuario,
  atualizarPerfilUsuario
};
