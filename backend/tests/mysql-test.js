// Script de teste para verificar a funcionalidade da aplicação com MySQL
const { sequelize, connectDB } = require('../config/db');
const { Usuario, Cliente, Categoria, Subcategoria, Produto } = require('../models');
const logger = require('../utils/logger');

// Função para testar a conexão com o banco de dados
const testarConexao = async () => {
  try {
    await sequelize.authenticate();
    logger.info('✅ Conexão com MySQL estabelecida com sucesso');
    return true;
  } catch (error) {
    logger.error(`❌ Erro ao conectar ao MySQL: ${error.message}`);
    return false;
  }
};

// Função para testar a criação de um usuário
const testarCriacaoUsuario = async () => {
  try {
    const usuario = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
      tipo: 'cliente'
    });
    
    logger.info(`✅ Usuário criado com sucesso: ID ${usuario.id}`);
    return usuario;
  } catch (error) {
    logger.error(`❌ Erro ao criar usuário: ${error.message}`);
    return null;
  }
};

// Função para testar a busca de um usuário
const testarBuscaUsuario = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
      logger.info(`✅ Usuário encontrado: ${usuario.nome}`);
      return true;
    } else {
      logger.error('❌ Usuário não encontrado');
      return false;
    }
  } catch (error) {
    logger.error(`❌ Erro ao buscar usuário: ${error.message}`);
    return false;
  }
};

// Função para testar a atualização de um usuário
const testarAtualizacaoUsuario = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      logger.error('❌ Usuário não encontrado para atualização');
      return false;
    }
    
    usuario.nome = 'Usuário Atualizado';
    await usuario.save();
    
    logger.info(`✅ Usuário atualizado com sucesso: ${usuario.nome}`);
    return true;
  } catch (error) {
    logger.error(`❌ Erro ao atualizar usuário: ${error.message}`);
    return false;
  }
};

// Função para testar a exclusão de um usuário
const testarExclusaoUsuario = async (id) => {
  try {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      logger.error('❌ Usuário não encontrado para exclusão');
      return false;
    }
    
    await usuario.destroy();
    
    logger.info('✅ Usuário excluído com sucesso');
    return true;
  } catch (error) {
    logger.error(`❌ Erro ao excluir usuário: ${error.message}`);
    return false;
  }
};

// Função para testar a criação de uma categoria
const testarCriacaoCategoria = async () => {
  try {
    const categoria = await Categoria.create({
      nome: 'Categoria Teste',
      descricao: 'Descrição da categoria de teste'
    });
    
    logger.info(`✅ Categoria criada com sucesso: ID ${categoria.id}`);
    return categoria;
  } catch (error) {
    logger.error(`❌ Erro ao criar categoria: ${error.message}`);
    return null;
  }
};

// Função para testar a criação de uma subcategoria
const testarCriacaoSubcategoria = async (categoriaId) => {
  try {
    const subcategoria = await Subcategoria.create({
      nome: 'Subcategoria Teste',
      categoria_id: categoriaId
    });
    
    logger.info(`✅ Subcategoria criada com sucesso: ID ${subcategoria.id}`);
    return subcategoria;
  } catch (error) {
    logger.error(`❌ Erro ao criar subcategoria: ${error.message}`);
    return null;
  }
};

// Função para testar a criação de um produto
const testarCriacaoProduto = async (categoriaId, subcategoriaId) => {
  try {
    const produto = await Produto.create({
      nome: 'Produto Teste',
      descricao: 'Descrição do produto de teste',
      preco: 99.99,
      estoque: 10,
      categoria_id: categoriaId,
      subcategoria_id: subcategoriaId,
      imagem_principal: 'imagem_teste.jpg'
    });
    
    logger.info(`✅ Produto criado com sucesso: ID ${produto.id}`);
    return produto;
  } catch (error) {
    logger.error(`❌ Erro ao criar produto: ${error.message}`);
    return null;
  }
};

// Função para testar a busca de um produto com relações
const testarBuscaProdutoComRelacoes = async (id) => {
  try {
    const produto = await Produto.findByPk(id, {
      include: [
        { model: Categoria },
        { model: Subcategoria }
      ]
    });
    
    if (produto) {
      logger.info(`✅ Produto encontrado com relações: ${produto.nome}`);
      logger.info(`   Categoria: ${produto.Categoria.nome}`);
      logger.info(`   Subcategoria: ${produto.Subcategoria.nome}`);
      return true;
    } else {
      logger.error('❌ Produto não encontrado');
      return false;
    }
  } catch (error) {
    logger.error(`❌ Erro ao buscar produto com relações: ${error.message}`);
    return false;
  }
};

// Função principal para executar todos os testes
const executarTestes = async () => {
  logger.info('🔍 Iniciando testes da aplicação com MySQL...');
  
  // Testar conexão com o banco de dados
  const conexaoOk = await testarConexao();
  if (!conexaoOk) {
    logger.error('❌ Falha na conexão com o banco de dados. Abortando testes.');
    return false;
  }
  
  // Testar operações CRUD com usuário
  const usuario = await testarCriacaoUsuario();
  if (usuario) {
    await testarBuscaUsuario(usuario.id);
    await testarAtualizacaoUsuario(usuario.id);
  }
  
  // Testar criação de categoria e subcategoria
  const categoria = await testarCriacaoCategoria();
  let subcategoria = null;
  if (categoria) {
    subcategoria = await testarCriacaoSubcategoria(categoria.id);
  }
  
  // Testar criação de produto e busca com relações
  if (categoria && subcategoria) {
    const produto = await testarCriacaoProduto(categoria.id, subcategoria.id);
    if (produto) {
      await testarBuscaProdutoComRelacoes(produto.id);
    }
  }
  
  // Limpar dados de teste (opcional)
  if (usuario) {
    await testarExclusaoUsuario(usuario.id);
  }
  
  logger.info('✅ Testes concluídos!');
  return true;
};

// Executar testes
(async () => {
  try {
    // Conectar ao banco de dados
    await connectDB();
    
    // Executar testes
    await executarTestes();
    
    // Fechar conexão
    await sequelize.close();
    logger.info('Conexão com o banco de dados fechada.');
  } catch (error) {
    logger.error(`Erro durante os testes: ${error.message}`);
  }
})();
