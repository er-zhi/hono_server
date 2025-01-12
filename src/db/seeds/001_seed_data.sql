-- Seed Users
INSERT INTO users (username, email, password, balance) VALUES
    ('test_user', 'test_user@example.com', 'hashed_password', 1000.0);

-- Seed Products
INSERT INTO products (name, price) VALUES
   ('Product 1', 25.0),
   ('Product 2', 50.0),
   ('Product 3', 75.0),
   ('Product 4', 100.0),
   ('Product 5', 9999.0);
