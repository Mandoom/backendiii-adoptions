# Backendiii Adoptions – Technical Reference

This document distills the backend into the pieces another language model (or any newcomer) needs to reason about the codebase. It captures the runtime stack, request lifecycle, directory anatomy, and every REST endpoint with the controller/service hand-offs.

## Runtime Stack & Configuration
- **Platform:** Node.js + Express (see `src/app.js`).
- **Database:** MongoDB via Mongoose ODM.
- **Authentication:** Cookie-based session using JSON Web Tokens (`jsonwebtoken`).
- **File uploads:** `multer` writes pet images under `src/public/img`.
- **Passwords:** Hashed with `bcrypt` helpers in `src/utils/index.js`.
- **Environment variables:**
  - `PORT` (defaults to `8080`).
  - `MONGODB_URI` (defaults to `mongodb://127.0.0.1:27017/adoptme`).

The Express server is configured in `src/app.js`, connects to MongoDB, enables JSON and cookie parsing middleware, and mounts the resource routers under `/api/*` prefixes.

## Request Lifecycle Overview
1. **Router layer** – Files in `src/routes/*.router.js` declare REST endpoints and map them to controller functions.
2. **Controller layer** – `src/controllers/*.controller.js` files validate inputs, enforce workflow rules, and call the service layer.
3. **Service / Repository layer** – `src/services/index.js` wires repositories that encapsulate Mongoose DAOs. Generic CRUD lives in `src/repository/GenericRepository.js`, while resource-specific repositories add helper lookups.
4. **DAO layer** – `src/dao/*.js` exposes persistence operations backed by the Mongoose models defined in `src/dao/models/*.js`.
5. **Utilities** – `src/utils` holds cross-cutting helpers such as password hashing, JWT DTO mapping, and Multer storage configuration.

## Directory Map
```
backendiii-adoptions/
├── package.json                 # NPM scripts (start, dev) and dependencies
├── README.md                    # Contributor-oriented setup and API walkthroughs
├── docs/
│   └── TECHNICAL_OVERVIEW.md    # (This file)
├── src/
│   ├── app.js                   # Express entrypoint
│   ├── controllers/
│   │   ├── adoptions.controller.js
│   │   ├── pets.controller.js
│   │   ├── sessions.controller.js
│   │   └── users.controller.js
│   ├── dao/
│   │   ├── Adoption.js          # DAO wrappers exposing CRUD helpers
│   │   ├── Pets.dao.js
│   │   ├── Users.dao.js
│   │   └── models/
│   │       ├── Adoption.js      # Mongoose schemas
│   │       ├── Pet.js
│   │       └── User.js
│   ├── dto/
│   │   ├── Pet.dto.js           # Shape inputs/outputs for persistence and tokens
│   │   └── User.dto.js
│   ├── public/
│   │   └── img/                 # Multer upload target (created at runtime)
│   ├── repository/
│   │   ├── AdoptionRepository.js
│   │   ├── GenericRepository.js
│   │   ├── PetRepository.js
│   │   └── UserRepository.js
│   ├── routes/
│   │   ├── adoption.router.js
│   │   ├── pets.router.js
│   │   ├── sessions.router.js
│   │   └── users.router.js
│   ├── services/
│   │   └── index.js             # Instantiates repositories with concrete DAOs
│   └── utils/
│       ├── index.js             # Bcrypt helpers + __dirname export
│       └── uploader.js          # Multer storage configuration
└── .env.example                 # Sample environment configuration
```

## Data Model Schemas
| Model | Collection | Fields |
| --- | --- | --- |
| **User** (`src/dao/models/User.js`) | `Users` | `first_name`, `last_name`, `email` (unique), `password`, `role` (`user` by default), `pets` (array of ObjectId references to `Pets`). |
| **Pet** (`src/dao/models/Pet.js`) | `Pets` | `name`, `specie`, `birthDate` (Date), `adopted` (Boolean flag), `owner` (User ObjectId), `image` (string path). |
| **Adoption** (`src/dao/models/Adoption.js`) | `Adoptions` | `owner` (User ObjectId), `pet` (Pet ObjectId). |

DTO helpers normalize payloads: `PetDTO.getPetInputFrom` ensures defaults, and `UserDTO.getUserTokenFrom` exposes token-safe fields.

## Services & Repositories
`src/services/index.js` instantiates one repository per aggregate:
- `usersService` → `UserRepository` → `Users` DAO → `Users` Mongoose model.
- `petsService` → `PetRepository` → `Pet` DAO → `Pets` Mongoose model.
- `adoptionsService` → `AdoptionRepository` → `Adoption` DAO → `Adoptions` Mongoose model.

`UserRepository` adds lookup helpers (`getUserByEmail`, `getUserById`). All repositories inherit CRUD methods (`getAll`, `getBy`, `create`, `update`, `delete`) from `GenericRepository`.

## Controllers at a Glance
- **Users** (`users.controller.js`): list, fetch, update, and delete users via `usersService`.
- **Pets** (`pets.controller.js`): list, create, update, delete pets; handle image uploads by augmenting DTO payloads with a filesystem path.
- **Adoptions** (`adoptions.controller.js`): guard adoption flow by verifying the user/pet, toggling adoption status, and persisting an adoption record.
- **Sessions** (`sessions.controller.js`): register/login flows with hashed passwords, JWT issuance, and cookie-based session introspection (`coderCookie` and `unprotectedCookie`).

## REST Surface
Every route is mounted under `/api`. The table links routes to their controllers and downstream service calls.

### Users Router (`/api/users` → `src/routes/users.router.js`)
| Method | Path | Controller | Service interaction | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/` | `getAllUsers` | `usersService.getAll()` | Returns `{ status, payload: User[] }`. |
| `GET` | `/:uid` | `getUser` | `usersService.getUserById(uid)` | 404 if user missing. |
| `PUT` | `/:uid` | `updateUser` | `usersService.getUserById` + `usersService.update` | Expects JSON body with fields to overwrite. |
| `DELETE` | `/:uid` | `deleteUser` | `usersService.getUserById` (intended) | Controller currently responds success without deleting (TODO). |

### Pets Router (`/api/pets` → `src/routes/pets.router.js`)
| Method | Path | Controller | Service interaction | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/` | `getAllPets` | `petsService.getAll()` | Lists catalog. |
| `POST` | `/` | `createPet` | `petsService.create(PetDTO...)` | Requires `name`, `specie`, `birthDate`. |
| `POST` | `/withimage` | `createPetWithImage` | `petsService.create(PetDTO...)` | Uses Multer `uploader.single('image')`; stores file path in payload. |
| `PUT` | `/:pid` | `updatePet` | `petsService.update(pid, body)` | No validation beyond forwarding body. |
| `DELETE` | `/:pid` | `deletePet` | `petsService.delete(pid)` | Deletes by MongoDB ID. |

### Adoptions Router (`/api/adoptions` → `src/routes/adoption.router.js`)
| Method | Path | Controller | Service interaction | Notes |
| --- | --- | --- | --- | --- |
| `GET` | `/` | `getAllAdoptions` | `adoptionsService.getAll()` | Lists adoption records. |
| `GET` | `/:aid` | `getAdoption` | `adoptionsService.getBy({ _id: aid })` | 404 if missing. |
| `POST` | `/:uid/:pid` | `createAdoption` | Validates via `usersService`, `petsService`; updates user/pet, creates adoption. | Ensures pet not already adopted. |

### Sessions Router (`/api/sessions` → `src/routes/sessions.router.js`)
| Method | Path | Controller | Service interaction | Notes |
| --- | --- | --- | --- | --- |
| `POST` | `/register` | `register` | `usersService.getUserByEmail`, `usersService.create` | Hashes password before persistence. |
| `POST` | `/login` | `login` | `usersService.getUserByEmail`, `passwordValidation` | Issues JWT (`coderCookie`) containing `UserDTO` data. |
| `GET` | `/current` | `current` | `jwt.verify(coderCookie)` | Returns token claims when cookie present. |
| `GET` | `/unprotectedLogin` | `unprotectedLogin` | `usersService.getUserByEmail`, `passwordValidation` | Emits raw user in `unprotectedCookie`; GET with JSON body (idiosyncratic). |
| `GET` | `/unprotectedCurrent` | `unprotectedCurrent` | `jwt.verify(unprotectedCookie)` | Returns decoded user document. |

## Operational Notes & Future Enhancements
- **Error handling:** Controllers rely on direct `await` calls without try/catch; add centralized error middleware for robustness.
- **Validation:** JSON schemas (e.g., with `Joi`/`zod`) would tighten payload validation beyond basic presence checks.
- **Testing:** No automated tests are included; Supertest + a MongoDB test harness are recommended.
- **Security:** Consider environment-driven JWT secrets and HTTPS-only cookies for production.

Share this file with other LLMs to provide a concise yet deep understanding of how the backend is wired.
