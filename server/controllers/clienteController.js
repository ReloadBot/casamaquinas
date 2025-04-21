const Cliente = require('../models/Cliente');
const Usuario = require('../models/Usuario');

const getCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ usuario_id: req.usuario.id })
      .populate('usuario_id', '-senha');

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const updateCliente = async (req, res) => {
  const { cpf, telefone, endereco, complemento, cidade, estado, cep } = req.body;

  try {
    let cliente = await Cliente.findOne({ usuario_id: req.usuario.id });
    
    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado' });
    }

    // Atualizar dados do cliente
    cliente.cpf = cpf || cliente.cpf;
    cliente.telefone = telefone || cliente.telefone;
    cliente.endereco = endereco || cliente.endereco;
    cliente.complemento = complemento || cliente.complemento;
    cliente.cidade = cidade || cliente.cidade;
    cliente.estado = estado || cliente.estado;
    cliente.cep = cep || cliente.cep;

    await cliente.save();

    // Atualizar dados do usuário se necessário
    if (req.body.nome || req.body.email) {
      const usuario = await Usuario.findById(req.usuario.id);
      if (req.body.nome) usuario.nome = req.body.nome;
      if (req.body.email) usuario.email = req.body.email;
      await usuario.save();
    }

    const updatedCliente = await Cliente.findOne({ usuario_id: req.usuario.id })
      .populate('usuario_id', '-senha');

    res.json(updatedCliente);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find()
      .populate('usuario_id', '-senha')
      .sort({ data_cadastro: -1 });

    res.json(clientes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

const getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id)
      .populate('usuario_id', '-senha');

    if (!cliente) {
      return res.status(404).json({ msg: 'Cliente não encontrado' });
    }

    res.json(cliente);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Cliente não encontrado' });
    }
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  getCliente,
  updateCliente,
  getClientes,
  getClienteById
};