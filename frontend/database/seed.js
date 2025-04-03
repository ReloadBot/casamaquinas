const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./frontend/database/app.db');

// Dados iniciais para cache de categorias
const seedCategories = [
  { category_id: 1, name: 'Roçadeiras', image_url: '/images/categories/rocadeiras.jpg' },
  { category_id: 2, name: 'Cortadores de Grama', image_url: '/images/categories/cortadores.jpg' },
  { category_id: 3, name: 'Geradores', image_url: '/images/categories/geradores.jpg' },
  { category_id: 4, name: 'Peças', image_url: '/images/categories/pecas.jpg' }
];

// Dados iniciais para cache de produtos
const seedProducts = [
  { product_id: 1, name: 'Roçadeira Elétrica 1500W', price: 899.90, category_id: 1, image_url: '/images/products/rocadeira-eletrica.jpg' },
  { product_id: 2, name: 'Cortador de Grama a Gasolina', price: 1299.00, category_id: 2, image_url: '/images/products/cortador-gasolina.jpg' },
  { product_id: 3, name: 'Gerador 5500W', price: 4599.00, category_id: 3, image_url: '/images/products/gerador-5500w.jpg' },
  { product_id: 4, name: 'Kit de Facas para Roçadeira', price: 89.90, category_id: 4, image_url: '/images/products/kit-facas.jpg' }
];

// Criar tabelas e inserir dados iniciais
db.serialize(() => {
  // Criar tabelas
  db.run(`CREATE TABLE IF NOT EXISTS categories_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    image_url TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products_cache (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category_id INTEGER NOT NULL,
    image_url TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Inserir categorias
  const insertCategory = db.prepare('INSERT OR REPLACE INTO categories_cache (category_id, name, image_url) VALUES (?, ?, ?)');
  seedCategories.forEach(category => {
    insertCategory.run(category.category_id, category.name, category.image_url);
  });
  insertCategory.finalize();

  // Inserir produtos
  const insertProduct = db.prepare('INSERT OR REPLACE INTO products_cache (product_id, name, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)');
  seedProducts.forEach(product => {
    insertProduct.run(product.product_id, product.name, product.price, product.category_id, product.image_url);
  });
  insertProduct.finalize();

  console.log('Banco de dados do frontend inicializado com dados de exemplo');
});

db.close();