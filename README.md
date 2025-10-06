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

3. Configure environment variables. Copy the sample file and adjust the values as needed:

   ```bash
   cp .env.example .env
   ```

   By default the server reads `MONGODB_URI` and `PORT` from the environment, falling back to `mongodb://127.0.0.1:27017/adoptme` and `8080` respectively.

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

# Register a user
curl -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Ada","last_name":"Lovelace","email":"ada@example.com","password":"swordfish"}'

# Create a pet
curl -X POST http://localhost:8080/api/pets \
  -H "Content-Type: application/json" \
  -d '{"name":"Cesar","specie":"dog","birthDate":"2018-03-01"}'

# Start an adoption (replace <userId> and <petId> with real IDs from previous calls)
curl -X POST http://localhost:8080/api/adoptions/<userId>/<petId>
```

## Full API reference

All routes are prefixed with `/api`. The payloads below are JSON unless noted otherwise.

### Users

| Method | Path | Description | Request body |
| --- | --- | --- | --- |
| `GET` | `/api/users` | List every user. | None. |
| `GET` | `/api/users/:uid` | Fetch a single user by MongoDB ID. | None. |
| `PUT` | `/api/users/:uid` | Update a user. | Any subset of `first_name`, `last_name`, `email`, or `password`. Values replace the stored document fields. |
| `DELETE` | `/api/users/:uid` | Delete a user and their associated pets array entry. | None. |

> ℹ️ Users are created via the session registration endpoint described below.

### Pets

| Method | Path | Description | Request body |
| --- | --- | --- | --- |
| `GET` | `/api/pets` | List every pet in the catalog. | None. |
| `POST` | `/api/pets` | Create a pet without an image. | `{ "name": string, "specie": string, "birthDate": string (ISO-8601) }` |
| `POST` | `/api/pets/withimage` | Create a pet and upload an image. | `multipart/form-data` with fields `name`, `specie`, `birthDate`, and a file field named `image`. |
| `PUT` | `/api/pets/:pid` | Update a pet. | Any subset of the pet document fields such as `name`, `specie`, `birthDate`, `adopted`, `owner`, or `image`. |
| `DELETE` | `/api/pets/:pid` | Delete a pet. | None. |

### Adoptions

| Method | Path | Description | Request body |
| --- | --- | --- | --- |
| `GET` | `/api/adoptions` | List every adoption record. | None. |
| `GET` | `/api/adoptions/:aid` | Fetch a single adoption by MongoDB ID. | None. |
| `POST` | `/api/adoptions/:uid/:pid` | Link a user and a pet, marking the pet as adopted. | No body. Provide the user ID and pet ID as URL parameters. |

### Sessions & authentication

| Method | Path | Description | Request body |
| --- | --- | --- | --- |
| `POST` | `/api/sessions/register` | Register a new user account. | `{ "first_name": string, "last_name": string, "email": string, "password": string }` |
| `POST` | `/api/sessions/login` | Log in and receive a signed cookie named `coderCookie`. | `{ "email": string, "password": string }` |
| `GET` | `/api/sessions/current` | Return the user information stored in `coderCookie`. | None. Requires the `coderCookie` cookie to be present. |
| `GET` | `/api/sessions/unprotectedLogin` | Log in using an alternative cookie (`unprotectedCookie`). | `{ "email": string, "password": string }` (sent as query/body data; although defined as a GET route, Express will read JSON bodies if provided). |
| `GET` | `/api/sessions/unprotectedCurrent` | Return the decoded user stored in `unprotectedCookie`. | None. Requires the `unprotectedCookie` cookie to be present. |

## Endpoint usage examples

The following recipes show how to call each route and what to expect back. Replace the sample MongoDB IDs with the ones generated in your database. The commands pipe to `jq` for readability—feel free to drop that part if you do not have `jq` installed.

### Users

#### List users

```bash
curl -s http://localhost:8080/api/users | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": [
    {
      "_id": "64f23b02c74c2f527d6a0a11",
      "first_name": "Ada",
      "last_name": "Lovelace",
      "email": "ada@example.com",
      "password": "$2a$10$C83uQIvE5exampleHashedPasswordValue",
      "role": "user",
      "pets": [
        {
          "_id": "64f23b3cc74c2f527d6a0a13"
        }
      ]
    }
  ]
}
```

#### Retrieve a single user

```bash
curl -s http://localhost:8080/api/users/64f23b02c74c2f527d6a0a11 | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": {
    "_id": "64f23b02c74c2f527d6a0a11",
    "first_name": "Ada",
    "last_name": "Lovelace",
    "email": "ada@example.com",
    "password": "$2a$10$C83uQIvE5exampleHashedPasswordValue",
    "role": "user",
    "pets": [
      {
        "_id": "64f23b3cc74c2f527d6a0a13"
      }
    ]
  }
}
```

#### Update a user

```bash
curl -s -X PUT http://localhost:8080/api/users/64f23b02c74c2f527d6a0a11 \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Augusta","role":"admin"}' | jq
```

Sample response:

```json
{
  "status": "success",
  "message": "User updated"
}
```

#### Delete a user

```bash
curl -s -X DELETE http://localhost:8080/api/users/64f23b02c74c2f527d6a0a11 | jq
```

Sample response:

```json
{
  "status": "success",
  "message": "User deleted"
}
```

### Sessions & authentication

#### Register

```bash
curl -s -X POST http://localhost:8080/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
        "first_name": "Ada",
        "last_name": "Lovelace",
        "email": "ada@example.com",
        "password": "swordfish"
      }' | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": "64f23b02c74c2f527d6a0a11"
}
```

#### Login

```bash
curl -i -X POST http://localhost:8080/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"swordfish"}'
```

Look for a `Set-Cookie: coderCookie=...` header. The JSON body looks like:

```json
{
  "status": "success",
  "message": "Logged in"
}
```

#### Current session

```bash
curl -s --cookie "coderCookie=<token>" http://localhost:8080/api/sessions/current | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": "user"
  }
}
```

#### Unprotected login

```bash
curl -i -X GET 'http://localhost:8080/api/sessions/unprotectedLogin' \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"swordfish"}'
```

Sample response body:

```json
{
  "status": "success",
  "message": "Unprotected Logged in"
}
```

#### Unprotected current session

```bash
curl -s --cookie "unprotectedCookie=<token>" http://localhost:8080/api/sessions/unprotectedCurrent | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": {
    "_id": "64f23b02c74c2f527d6a0a11",
    "first_name": "Ada",
    "last_name": "Lovelace",
    "email": "ada@example.com",
    "password": "$2a$10$C83uQIvE5exampleHashedPasswordValue",
    "role": "user",
    "pets": [
      {
        "_id": "64f23b3cc74c2f527d6a0a13"
      }
    ]
  }
}
```

### Pets

#### List pets

```bash
curl -s http://localhost:8080/api/pets | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": [
    {
      "_id": "64f23b3cc74c2f527d6a0a13",
      "name": "Cesar",
      "specie": "dog",
      "birthDate": "2018-03-01T00:00:00.000Z",
      "adopted": true,
      "owner": "64f23b02c74c2f527d6a0a11",
      "image": null
    }
  ]
}
```

#### Create a pet

```bash
curl -s -X POST http://localhost:8080/api/pets \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Cesar",
        "specie": "dog",
        "birthDate": "2018-03-01"
      }' | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": {
    "_id": "64f23b3cc74c2f527d6a0a13",
    "name": "Cesar",
    "specie": "dog",
    "birthDate": "2018-03-01T00:00:00.000Z",
    "adopted": false,
    "owner": null,
    "image": null
  }
}
```

#### Create a pet with an image upload

```bash
curl -s -X POST http://localhost:8080/api/pets/withimage \
  -H "Content-Type: multipart/form-data" \
  -F "name=Coco" \
  -F "specie=cat" \
  -F "birthDate=2020-07-09" \
  -F "image=@/full/path/to/coco.png" | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": {
    "_id": "64f23b55c74c2f527d6a0a15",
    "name": "Coco",
    "specie": "cat",
    "birthDate": "2020-07-09T00:00:00.000Z",
    "adopted": false,
    "owner": null,
    "image": "/workspace/backendiii-adoptions/src/public/img/coco.png"
  }
}
```

#### Update a pet

```bash
curl -s -X PUT http://localhost:8080/api/pets/64f23b3cc74c2f527d6a0a13 \
  -H "Content-Type: application/json" \
  -d '{"adopted":true,"owner":"64f23b02c74c2f527d6a0a11"}' | jq
```

Sample response:

```json
{
  "status": "success",
  "message": "pet updated"
}
```

#### Delete a pet

```bash
curl -s -X DELETE http://localhost:8080/api/pets/64f23b3cc74c2f527d6a0a13 | jq
```

Sample response:

```json
{
  "status": "success",
  "message": "pet deleted"
}
```

### Adoptions

#### List adoptions

```bash
curl -s http://localhost:8080/api/adoptions | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": [
    {
      "_id": "64f23b78c74c2f527d6a0a17",
      "owner": "64f23b02c74c2f527d6a0a11",
      "pet": "64f23b3cc74c2f527d6a0a13"
    }
  ]
}
```

#### Retrieve a single adoption

```bash
curl -s http://localhost:8080/api/adoptions/64f23b78c74c2f527d6a0a17 | jq
```

Sample response:

```json
{
  "status": "success",
  "payload": {
    "_id": "64f23b78c74c2f527d6a0a17",
    "owner": "64f23b02c74c2f527d6a0a11",
    "pet": "64f23b3cc74c2f527d6a0a13"
  }
}
```

#### Create an adoption

```bash
curl -s -X POST http://localhost:8080/api/adoptions/64f23b02c74c2f527d6a0a11/64f23b3cc74c2f527d6a0a13 | jq
```

Sample response:

```json
{
  "status": "success",
  "message": "Pet adopted"
}
```

## Testing strategies

Automated tests are not bundled with the repository yet. To experiment locally you have a few options:

- Use the cURL commands above (or a tool such as Postman/Insomnia) to exercise each endpoint and verify the responses.
- Add your own integration tests with [Supertest](https://github.com/ladjs/supertest). The npm script `npm test` is pre-configured to run `mocha test/supertest.test.js`. Create that file, import your Express app, and write the scenarios you want to cover.
- Inspect the repository layers (`src/repository`, `src/dao`, `src/services`) to understand how data flows so that you can identify good candidates for unit tests in the future.

With MongoDB running and the server started, you now have a fully functioning local environment to explore and extend the adoption platform.
