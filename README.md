# Backendiii Adoptions

This project is an Express + MongoDB backend for managing users, pets, and the adoption workflow. The app exposes REST APIs that let you register users, list pets (optionally uploading images), and pair adopters with available pets.

## Prerequisites

Before you start, make sure the following tools are available on your machine:

- **Node.js** 16 or newer and the accompanying **npm** CLI.
- **MongoDB** 5.x or newer running locally (the default connection string expects a server on `mongodb://127.0.0.1:27017`).
- (Optional) **nodemon** if you would like hot reloading while developing. Install it globally with `npm install -g nodemon` or add it as a dev dependency.

## Installation

1. Clone the repository and move into the project directory.
2. Install project dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables. The server currently reads the MongoDB URI from `src/app.js` and falls back to port `8080`. If you want to change either value, create a local `.env` file at the project root with the following content and export the variables before starting the server:

   ```bash
   export MONGODB_URI="mongodb://127.0.0.1:27017/adoptme"
   export PORT=8080
   ```

   Alternatively, edit the `mongoose.connect` line in `src/app.js` to point to your preferred MongoDB instance.

4. Start your MongoDB server (for example, with `mongod --dbpath <path-to-data-directory>`).

## Running the application locally

Run the production build directly with Node:

```bash
npm start
```

For an auto-reloading experience (after installing nodemon):

```bash
npm run dev
```

When the server is running you should see `Listening on 8080` (or your chosen port) in the console.

## API quickstart

The API is rooted at `/api`. A few handy cURL snippets to exercise the service:

```bash
# List all pets
curl http://localhost:8080/api/pets

# Create a user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Ada","last_name":"Lovelace","email":"ada@example.com","password":"swordfish"}'

# Create a pet
curl -X POST http://localhost:8080/api/pets \
  -H "Content-Type: application/json" \
  -d '{"name":"Cesar","species":"dog","age":4,"adopted":false}'

# Start an adoption (replace <userId> and <petId> with real IDs from previous calls)
curl -X POST http://localhost:8080/api/adoptions/<userId>/<petId>
```

Refer to the controllers in `src/controllers` for the full list of accepted payloads and routes.

## Testing strategies

Automated tests are not bundled with the repository yet. To experiment locally you have a few options:

- Use the cURL commands above (or a tool such as Postman/Insomnia) to exercise each endpoint and verify the responses.
- Add your own integration tests with [Supertest](https://github.com/ladjs/supertest). The npm script `npm test` is pre-configured to run `mocha test/supertest.test.js`. Create that file, import your Express app, and write the scenarios you want to cover.
- Inspect the repository layers (`src/repository`, `src/dao`, `src/services`) to understand how data flows so that you can identify good candidates for unit tests in the future.

With MongoDB running and the server started, you now have a fully functioning local environment to explore and extend the adoption platform.
