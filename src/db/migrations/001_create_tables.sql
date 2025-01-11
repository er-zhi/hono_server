-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     balance FLOAT DEFAULT 0.0
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price FLOAT NOT NULL
);

-- Create Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
     id SERIAL PRIMARY KEY,
     user_id INT NOT NULL,
     product_id INT NOT NULL,
     purchase_date TIMESTAMP DEFAULT NOW(),
     FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
     FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

