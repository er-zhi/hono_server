# hono_server

## Stack:
1. Node.js v23,
2. TypeScript
3. postgres,
4. hono framework,
5. Redis as cache.

## Instruction:
1. nvm install 23 && nvm use 23
2. git clone https://github.com/er-zhi/hono_server/
3. cd hono_server
4. docker-compose up -d  or docker run --name redis -p 6379:6379 -d redis
5. npm ci
6. cp .env.example .env
7. npm run seed
8. npm start

## Task 1: Registration, Authentication, Password Change

### 1. POST /register
- **Description**: Registers a new user with the provided username, email, and password.
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

### 2. POST /login
- **Description**: Authenticates a user by checking the provided email and password. Returns a session or token.
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### 3. POST /logout
- **Description**: Logs out the current user, destroying the session or token.

### 4. POST /change-password
- **Description**: Allows the user to change their password.
- **Body**:
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```

## Task 2: Display Product Prices (Tradable and Non-tradable)

### 5. GET /items
- **Description**: Fetches items with their prices from the Skinport API, and filters to show two items with the lowest tradable and non-tradable prices.
- **Query Parameters**:
  - `app_id`: (default)
  - `currency`: (default)

### 6. GET /cache/items
- **Description**: Retrieves the list of items with cached prices from Redis. If not in cache, fetches from Skinport API and stores the data in cache.
- **Cache TTL**: Data should expire after a set amount of time (e.g., 60 seconds).

## Task 3: Implement Product Purchase

### 7. GET /products
- **Description**: Fetches the list of products available for purchase.
- **Response**:
  ```json
  [
    {
      "id": "integer",
      "name": "string",
      "price": "float"
    }
  ]
  ```

### 8. POST /purchase
- **Description**: Allows a user to purchase a product. Deducts the price from the user's balance and updates the `purchases` table.
- **Body**:
  ```json
  {
    "userId": "integer",
    "productId": "integer"
  }
  ```

### 9. GET /balance
- **Description**: Returns the current balance of the logged-in user.
- **Response**:
  ```json
  {
    "balance": "float"
  }
  ```

## Other Utility Endpoints

### 10. GET /users/{userId}
- **Description**: Fetches the user's profile information.
- **Parameters**: `userId` (Path parameter)
- **Response**:
  ```json
  {
    "userId": "integer",
    "username": "string",
    "email": "string"
  }
  ```

### 11. GET /products/{productId}
- **Description**: Fetches the details of a specific product.
- **Parameters**: `productId` (Path parameter)
- **Response**:
  ```json
  {
    "id": "integer",
    "name": "string",
    "price": "float"
  }
  ```
## Task:
Стек: strict TypeScript, postgres.js
Фреймворк на выбор: hono/elysia/fastify/express
Запрещено использовать: Nest, JWT, ORM
Таблицы в базе данных: users, products, purchases. Схему необходимо добавить в репозиторий.

Задача 1:
Регистрация, аутентификация, смена пароля

Задача 2:
Нужно отобразить массив объектов с двумя минимальными ценами на предмет (одна цена — tradable, другая — нет)
Получить данные можно через API: https://docs.skinport.com/#items
Параметры app_id и currency — default
Postgres здесь использовать не нужно
В отдачу предметов необходимо добавить кэширование через Redis

Задача 3:
Нужно реализовать покупку выдуманного товара из таблицы products.
Таблицу надо заполнить самостоятельно (несколько предметов, цена должна быть float).
У пользователя должен быть баланс.
В ответе должен быть обновленный баланс пользователя.

Если у вас возникнут вопросы, постарайтесь разобраться с ними самостоятельно. Мы обращаем внимание на вашу внимательность, умение работать с документацией и находить решения.
