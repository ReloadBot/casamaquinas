-- Tabela de sessão do usuário (client-side)
CREATE TABLE IF NOT EXISTS user_session (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cache de produtos
CREATE TABLE IF NOT EXISTS products_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  category_id INTEGER NOT NULL,
  image_url TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cache de categorias
CREATE TABLE IF NOT EXISTS categories_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  image_url TEXT,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de carrinho offline
CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products_cache (product_id)
);

-- Tabela de dados do usuário para modo offline
CREATE TABLE IF NOT EXISTS user_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  last_sync DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_products_category ON products_cache (category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON cart_items (product_id);
CREATE INDEX IF NOT EXISTS idx_user_session_token ON user_session (token);
CREATE INDEX IF NOT EXISTS idx_user_session_expires ON user_session (expires_at);