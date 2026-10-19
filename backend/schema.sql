-- Part A: ONE table - products (Question 5: Tech Product Showcase)
CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  product_name VARCHAR(150) NOT NULL,
  brand        VARCHAR(100),
  category     VARCHAR(80),
  price        DECIMAL(10,2) DEFAULT 0,
  stock        INTEGER DEFAULT 0,
  description  TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data: 10 records, loaded automatically only when the table is empty
-- SEED_DATA_BELOW
INSERT INTO products (product_name, brand, category, price, stock, description) VALUES
('iPhone 15',            'Apple',     'Smartphone', 999.00, 25, '6.1-inch OLED display, A16 Bionic chip'),
('Galaxy S24',           'Samsung',   'Smartphone', 899.00, 30, '6.2-inch AMOLED, Snapdragon 8 Gen 3'),
('MacBook Air M2',       'Apple',     'Laptop',    1199.00, 12, '13.6-inch Liquid Retina, 18-hour battery'),
('ThinkPad X1 Carbon',   'Lenovo',    'Laptop',    1549.00,  8, 'Ultra-light business laptop, 14-inch'),
('XPS 13',               'Dell',      'Laptop',    1099.00, 10, 'Compact 13-inch laptop with InfinityEdge display'),
('WH-1000XM5',           'Sony',      'Headphones', 399.00, 40, 'Noise-cancelling wireless headphones'),
('AirPods Pro 2',        'Apple',     'Earbuds',    249.00, 55, 'Active noise cancellation, USB-C case'),
('iPad Air',             'Apple',     'Tablet',     599.00, 18, '10.9-inch tablet with M1 chip'),
('Echo Dot (5th Gen)',   'Amazon',    'Smart Home',  49.99, 80, 'Smart speaker with Alexa'),
('Pixel Watch 2',        'Google',    'Wearable',   349.00, 20, 'Smartwatch with heart-rate and sleep tracking');
