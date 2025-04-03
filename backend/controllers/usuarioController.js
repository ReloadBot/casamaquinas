const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Cliente = require('../models/Cliente');

const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-senha');
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const obterUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-senha');
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    if (usuario.tipo === 'cliente') {
      const cliente = await Cliente.findOne({ usuario_id: usuario._id });
      return res.json({ usuario, cliente });
    }

    res.json(usuario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const atualizarUsuario = async (req, res) => {
  const { nome, email, tipo, senha } = req.body;

  try {
    let usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    if (email && email !== usuario.email) {
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ msg: 'Email já está em uso' });
      }
      usuario.email = email;
    }

    usuario.nome = nome || usuario.nome;
    usuario.tipo = tipo || usuario.tipo;

    if (senha) {
      const salt = await bcrypt.genSalt(10);
      usuario.senha = await bcrypt.hash(senha, salt);
    }

    await usuario.save();

    const usuarioAtualizado = await Usuario.findById(usuario._id).select('-senha');
    res.json(usuarioAtualizado);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const deletarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    if (usuario.tipo === 'cliente') {
      await Cliente.findOneAndDelete({ usuario_id: usuario._id });
    }

    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Usuário removido com sucesso' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const alterarSenha = async (req, res) => {
  const { senhaAtual, novaSenha } = req.body;

  try {
    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    const isMatch = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Senha atual incorreta' });
    }

    const salt = await bcrypt.genSalt(10);
    usuario.senha = await bcrypt.hash(novaSenha, salt);
    await usuario.save();

    res.json({ msg: 'Senha alterada com sucesso' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  listarUsuarios,
  obterUsuario,
  atualizarUsuario,
  deletarUsuario,
  alterarSenha
};