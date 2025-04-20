// Implementação da solução recomendada para o authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Cliente = require('../models/Cliente');
const { generateToken } = require('../utils/auth');

const register = async (req, res) => {
  // Modificação para aceitar tanto 'senha' quanto 'password'
  const { nome, email, senha, password, tipo, cpf, telefone, endereco, cidade, estado, cep } = req.body;
  const senhaFinal = senha || password; // Aceitar qualquer um dos campos

  if (!senhaFinal) {
    return res.status(400).json({ msg: 'Por favor, forneça uma senha' });
  }

  try {
    let usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedSenha = await bcrypt.hash(senhaFinal, salt);

    usuario = new Usuario({
      nome,
      email,
      senha: hashedSenha,
      tipo: tipo || 'cliente'
    });

    await usuario.save();

    if (tipo === 'cliente' || !tipo) {
      const cliente = new Cliente({
        usuario_id: usuario._id,
        cpf,
        telefone,
        endereco,
        cidade,
        estado,
        cep
      });
      await cliente.save();
    }

    const token = generateToken(usuario._id, usuario.tipo);

    res.status(201).json({
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const login = async (req, res) => {
  // Modificação para aceitar tanto 'senha' quanto 'password'
  const { email, senha, password } = req.body;
  const senhaFinal = senha || password; // Aceitar qualquer um dos campos

  if (!email || !senhaFinal) {
    return res.status(400).json({ msg: 'Por favor, forneça email e senha' });
  }

  try {
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(senhaFinal, usuario.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }

    const token = generateToken(usuario._id, usuario.tipo);

    res.json({
      token,
      usuario: {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const getUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-senha');
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }
    res.json(usuario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const updateUsuario = async (req, res) => {
  // Modificação para aceitar tanto 'senha' quanto 'password'
  const { nome, email, senha, password } = req.body;
  const senhaFinal = senha || password; // Aceitar qualquer um dos campos

  try {
    let usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    if (email && email !== usuario.email) {
      const existingUser = await Usuario.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: 'Email já está em uso' });
      }
      usuario.email = email;
    }

    if (nome) usuario.nome = nome;
    if (senhaFinal) {
      const salt = await bcrypt.genSalt(10);
      usuario.senha = await bcrypt.hash(senhaFinal, salt);
    }

    await usuario.save();

    res.json({
      id: usuario._id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  register,
  login,
  getUsuario,
  updateUsuario
};
