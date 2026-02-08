# Elysia Production Ready API

Backend API production-ready berbasis Bun + TypeScript + Elysia.js dengan PostgreSQL, Sequelize, PASETO, Yup, Winston, dan Swagger (khusus non-production).

## Stack
- Bun runtime + package manager
- Node.js 22 (untuk tooling/compatibility saat diperlukan)
- TypeScript (strict)
- Elysia.js
- PostgreSQL
- Sequelize ORM + sequelize-cli (migration & seeder)
- PASETO (access + refresh token)
- bcrypt
- Winston logger
- Yup validation
- Swagger OpenAPI otomatis dari Elysia

## Aturan Arsitektur yang Dipenuhi
- Flow endpoint: `route -> controller -> service -> repository`
- Env memakai `dotenv` + file `.env.*` tanpa `env.ts`
- `dotenv` hanya di-load sekali di `src/index.ts`
- Konfigurasi Sequelize berada di root: `sequelize.config.js`
- `sequelize-cli` selalu memakai `--config sequelize.config.js`
- Folder migration/seeder default: `migrations/` dan `seeders/`
- Semua import source code menggunakan module alias (`@config`, `@routes`, dst)
- Selain Sequelize Model dan `BaseError`, seluruh logic function-based (tanpa class)
- Model hanya di `src/schemas/models/`
- Relasi hanya di `src/relations/`
- Type/interface/enum module-specific berada di `src/modules/<feature>/types/`
- Service pattern: 1 file = 1 fungsi, tanpa `index.ts` di `services`
- Repository pattern: 1 file = 1 method + `index.ts` module repository
- Route pattern: 1 file = 1 endpoint, compose via `index.ts`
- Controller pattern: 1 file = 1 controller function
- Middleware, validation, auth guard, role check dilakukan di layer route
- Response formatting dan logging endpoint dilakukan di layer controller
- Swagger aktif hanya pada `development` dan `staging`

## Struktur Folder
```text
.
├── package.json
├── tsconfig.json
├── sequelize.config.js
├── docker-compose.yml
├── Dockerfile
├── migrations/          # Database migrations
├── seeders/             # Database seeders
├── src/
│   ├── index.ts
│   ├── common/          # Shared utilities (BaseError, errorFactory)
│   ├── config/          # App configuration (app, database, logger, bootstrap)
│   ├── middlewares/     # Global middlewares (errorHandler, rateLimit, requireAuth)
│   ├── modules/         # Feature-based modules
│   │   ├── auth/        # Authentication feature
│   │   │   ├── controllers/
│   │   │   ├── repositories/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   │   ├── validators/
│   │   │   └── relations/
│   │   ├── users/       # User management feature
│   │   └── health/      # Health check feature
│   ├── plugins/         # Elysia plugins
│   ├── routes/          # Route orchestration (v1/index.ts)
│   ├── schemas/         # Database models (RefreshToken, Role, User)
│   ├── relations/       # Sequelize associations
│   └── utils/           # Utility functions (token, hash, pagination, response, dll)
└── tests/               # Test suite (unit & integration)
```

### Architecture Pattern
Flow endpoint: `route -> controller -> service -> repository`

Setiap module menggunakan struktur yang konsisten:
- **controllers/** - Handle HTTP request/response
- **services/** - Business logic layer (1 file = 1 function)
- **repositories/** - Database access layer (1 file = 1 method)
- **routes/** - Route definitions dengan middleware & validation
- **types/** - TypeScript types & enums (module-specific)
- **validators/** - Yup validation schemas
- **relations/** - Sequelize associations (auth module)

## Environment
File environment tersedia:
- `.env.development`
- `.env.staging`
- `.env.production`
- `.env.test`

Jalankan dengan `NODE_ENV` yang sesuai agar file env tepat dipakai.

Auth env utama:
- `ACCESS_TOKEN_TTL=8h`
- `REFRESH_TOKEN_TTL=8h`
- `SESSION_MAX_AGE=8h`

Perilaku:
- Endpoint `POST /api/v1/auth/login` mengembalikan token di body response dengan format `token` dan `refreshToken`.
- Cookie HTTP-only (`token`, `refreshToken`, `expiredToken`) juga dikirim otomatis.
- Sesi hard-stop 8 jam (`SESSION_MAX_AGE`), sehingga setelah lewat 8 jam user harus login ulang.

## Script Bun
- `bun run dev`
- `bun run build`
- `bun run start`
- `bun run db:migrate`
- `bun run db:seed`
- `bun run db:reset`
- `bun run test`
- `bun run test:unit`
- `bun run test:integration`

Semua command sequelize-cli memakai:
`--config sequelize.config.js`

## Membuat Migration & Seeder Baru
Gunakan `sequelize-cli` dan selalu sertakan config root project:

1. Buat migration baru:
   - `bunx sequelize-cli migration:generate --name create-example-table --config sequelize.config.js`
2. Buat seeder baru:
   - `bunx sequelize-cli seed:generate --name seed-example-data --config sequelize.config.js`
3. Jalankan migration:
   - `bun run db:migrate`
4. Jalankan seeder:
   - `bun run db:seed`

Catatan:
- File migration otomatis dibuat di folder default `migrations/`.
- File seeder otomatis dibuat di folder default `seeders/`.
- Environment ditentukan oleh `NODE_ENV` dan nilai `process.env` yang aktif.

## Endpoint
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/users` (datatable, admin only)
- `GET /api/v1/health`

Contoh data response auth (`register/login/refresh`):
```json
{
  "user": {
    "id": 1,
    "name": "System Admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "token": "v3.local....",
  "refreshToken": "v3.local....",
  "expiredToken": 28800
}
```

## Auth & Security
- Access token PASETO: 8 jam (`ACCESS_TOKEN_TTL`)
- Refresh token PASETO: 8 jam (`REFRESH_TOKEN_TTL`)
- Absolute session expiry: 8 jam (`SESSION_MAX_AGE`) untuk auto-logout
- Refresh token rotation aktif
- Refresh token disimpan hash di database
- Token dikirim via HTTP-only cookie: `token`, `refreshToken`, dan `expiredToken`
- Response auth (`register/login/refresh`) mengembalikan `token`, `refreshToken`, dan `expiredToken` (detik)
- bcrypt untuk password/hash token
- Rate limit aktif di endpoint login dan refresh
- Global error handler dengan format error standar

## Logging
- Log disimpan ke folder root: `logs/`
- File info harian: `logs/info-YYYY-MM-DD.log`
- File error harian: `logs/error-YYYY-MM-DD.log`
- Retensi file error: 7 hari (otomatis dibersihkan saat app start)
- Retensi file info: 30 hari (otomatis dibersihkan saat app start)
- Console logging tetap aktif untuk observability saat development/container runtime

## Base Response Standard
### Success
```json
{
  "status": 200,
  "success": true,
  "message": "string",
  "data": {},
  "meta": {
    "currentPage": 1,
    "pageSize": 10,
    "total": 100,
    "totalPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error
```json
{
  "status": 400,
  "success": false,
  "message": "string",
  "data": null,
  "meta": {
    "currentPage": 0,
    "pageSize": 0,
    "total": 0,
    "totalPage": 0,
    "hasNext": false,
    "hasPrev": false
  }
}
```

## Swagger
- Aktif saat `NODE_ENV !== production` (`/docs`, `/docs/json`)
- Nonaktif di production
- Akses `/docs` atau `/docs/json` di production akan `404`
- Dokumentasi endpoint sudah berisi:
  - summary + description fungsi endpoint
  - contoh request payload
  - contoh response sukses
  - contoh response error (validasi, unauthorized, forbidden, rate limit, dll)

## Menjalankan Project
1. Install dependency:
   - `bun install`
2. Siapkan PostgreSQL sesuai `.env.<environment>`
3. Jalankan migrasi:
   - `bun run db:migrate`
4. Jalankan seeder:
   - `bun run db:seed`
5. Jalankan app:
   - `bun run dev`

## Docker
Jalankan dengan docker compose:
```bash
docker compose up --build
```

## Testing Strategy
- Unit test (`bun:test`):
  - utility
  - service dengan repository di-mock
  - repository dengan dependency mock
- Integration test (`bun:test`):
  - full HTTP flow
  - middleware + validation
  - DB test via `.env.test`
  - migration + seeder dijalankan sebelum flow test


