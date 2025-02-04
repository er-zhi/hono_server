# hono_server

### Stack:
1. Node.js v23,
2. Postgres,
3. Hono framework,
4. Redis as cache,
5. Docker.

### Key points: 
1. TypeScript
2. Linter: EsLint + airbnb,
3. Minimum dependencies, no dotenv, no nodemon...,
4. Lightweight framework,
5. Lightweight docker images,

## Instruction:
1. use latest node.js v23 (not LTS!) to use built-in TS compiler, dotenv and sqlite `nvm install 23 && nvm use 23`,
2. `git clone https://github.com/er-zhi/hono_server.git`,
3. `cd hono_server`,
4. `docker compose up -d`,
5. `npm ci`,
6. `cp .env.example .env`,
7. `npm run seed`,
8. `npm start`.

## Result: 
### Task 1: Minimal CRUD for Authorization
* Data Validation: Utilized zod for input validation.
* E2E Testing: Implemented using Node.js's built-in test and assert modules.

POST /register
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
POST /login
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
POST /change-password
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```

### Task 2: Caching with Redis
* mplemented a simpleCache middleware using Redis.
* Added response header: X-Cache-Status to indicate cache status (HIT or MISS).
GET http://localhost:3000/products
Fetches the lowest priced items, with results cached for performance.

## Task 3: Product Purchase with Balance Check
* E2E Testing:
 * Dynamically creates a user.
 * Fetches all available products from the database.
 * Makes purchases and verifies balance updates and boundary conditions.
* Database:
 * Ensure the database is seeded with test data for users and products.
  ```json
  {
    "userId": 42,
    "productId": 42
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
