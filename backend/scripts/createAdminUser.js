const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Conectar ao MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => {
  console.error('Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});

// Importar o modelo de Usuário
const Usuario = require('../models/Usuario');

// Dados do usuário administrador
const adminData = {
  nome: 'Administrador',
  email: 'admin@casadasmaquinas.com.br',
  senha: 'admin123456',
  tipo: 'admin'
};

// Função para criar o usuário administrador
async function createAdminUser() {
  try {
    // Verificar se já existe um usuário com este email
    const existingUser = await Usuario.findOne({ email: adminData.email }).select('+senha');
    
    if (existingUser) {
      console.log('Um usuário administrador com este email já existe.');
      console.log('Atualizando a senha do usuário existente...');
      
      // Atualizar a senha do usuário existente
      existingUser.senha = adminData.senha;
      await existingUser.save();
      
      console.log('Senha do usuário administrador atualizada com sucesso!');
      console.log('Email:', adminData.email);
      console.log('Senha:', adminData.senha);
      console.log('IMPORTANTE: Altere esta senha após o primeiro login por motivos de segurança.');
      
      process.exit(0);
    }
    
    // Criar o novo usuário administrador
    const admin = new Usuario(adminData);
    await admin.save();
    
    console.log('Usuário administrador criado com sucesso!');
    console.log('Email:', adminData.email);
    console.log('Senha:', adminData.senha);
    console.log('IMPORTANTE: Altere esta senha após o primeiro login por motivos de segurança.');
    
    process.exit(0);
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    process.exit(1);
  }
}

// Executar a função
createAdminUser();
