-- Esquema do banco de dados MySQL para Casa das Máquinas
-- Convertido do esquema MongoDB original

-- Criação das tabelas

-- Tabela de Usuários
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('admin', 'cliente') DEFAULT 'cliente',
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultimo_acesso TIMESTAMP NULL,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL UNIQUE,
  cpf VARCHAR(14) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  endereco VARCHAR(255) NOT NULL,
  complemento VARCHAR(100),
  cidade VARCHAR(100) NOT NULL,
  estado CHAR(2) NOT NULL,
  cep VARCHAR(10) NOT NULL,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabela de Categorias
CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE,
  descricao VARCHAR(500),
  imagem VARCHAR(255),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Subcategorias
CREATE TABLE subcategorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL,
  categoria_id INT NOT NULL,
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY nome_categoria (nome, categoria_id),
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

-- Tabela de Produtos
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  estoque INT NOT NULL DEFAULT 0,
  categoria_id INT NOT NULL,
  subcategoria_id INT,
  imagem_principal VARCHAR(255) NOT NULL,
  destaque BOOLEAN DEFAULT FALSE,
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
  FOREIGN KEY (subcategoria_id) REFERENCES subcategorias(id) ON DELETE SET NULL
);

-- Tabela de Imagens Secundárias de Produtos
CREATE TABLE produto_imagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  produto_id INT NOT NULL,
  imagem VARCHAR(255) NOT NULL,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE
);

-- Tabela de Pedidos
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pendente', 'pago', 'enviado', 'entregue', 'cancelado') DEFAULT 'pendente',
  valor_total DECIMAL(10, 2) NOT NULL,
  metodo_pagamento VARCHAR(50),
  id_pagamento VARCHAR(100),
  endereco_entrega VARCHAR(255) NOT NULL,
  rastreamento VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT
);

-- Tabela de Itens de Pedido
CREATE TABLE pedido_itens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

-- Índices para otimização de consultas
CREATE INDEX idx_produtos_nome_descricao ON produtos(nome, descricao(255));
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_subcategoria ON produtos(subcategoria_id);
CREATE INDEX idx_produtos_preco ON produtos(preco);
CREATE INDEX idx_produtos_destaque ON produtos(destaque);

CREATE INDEX idx_clientes_cpf ON clientes(cpf);
CREATE INDEX idx_clientes_usuario ON clientes(usuario_id);

CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_data ON pedidos(data_pedido);

-- Triggers para manter a integridade dos dados

-- Trigger para garantir que o estoque não seja negativo
DELIMITER //
CREATE TRIGGER check_estoque_before_insert
BEFORE INSERT ON produtos
FOR EACH ROW
BEGIN
  IF NEW.estoque < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estoque não pode ser negativo';
  END IF;
END //

CREATE TRIGGER check_estoque_before_update
BEFORE UPDATE ON produtos
FOR EACH ROW
BEGIN
  IF NEW.estoque < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Estoque não pode ser negativo';
  END IF;
END //

-- Trigger para calcular o subtotal dos itens de pedido
CREATE TRIGGER calculate_subtotal_before_insert
BEFORE INSERT ON pedido_itens
FOR EACH ROW
BEGIN
  SET NEW.subtotal = NEW.quantidade * NEW.preco_unitario;
END //

CREATE TRIGGER calculate_subtotal_before_update
BEFORE UPDATE ON pedido_itens
FOR EACH ROW
BEGIN
  SET NEW.subtotal = NEW.quantidade * NEW.preco_unitario;
END //
DELIMITER ;
