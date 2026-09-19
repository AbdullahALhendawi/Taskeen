# Taskeen

Housing/accommodation management system. Tracks a physical hierarchy of
**Buildings → Floors → Apartments → Rooms → Beds**, and assigns **Residents**
to individual beds.

## Tech Stack

- **Backend:** ASP.NET Core (.NET 10) + Entity Framework Core
- **Frontend:** React 19 + TypeScript + Vite
- **Database:** Microsoft SQL Server 2022

## Repo Structure

```
backend/    ASP.NET Core Web API (Taskeen.Api)
frontend/   React + Vite SPA
docker-compose.yml   db + backend + frontend services
seed-data.sql        mock/presentation data
```

## Data Model

| Entity | Key Fields |
|---|---|
| Building | Id, Name, CreatedAt |
| Floor | Id, FloorNumber, BuildingId |
| Apartment | Id, ApartmentNumber, FloorId |
| Room | Id, RoomNumber, ApartmentId |
| Bed | Id, BedNumber, RoomId, ResidentId (nullable) |
| Resident | Id, EmployeeId, FullName, Phone, Nationality, JobTitle |

A unique filtered index on `Bed.ResidentId` guarantees at the database level
that no resident can ever be assigned to two beds simultaneously.

## Business Rules

| Rule | Enforcement |
|---|---|
| A bed holds 0 or 1 resident | Application logic + database unique index |
| A resident holds 0 or 1 bed | Same as above |
| Every room has at least 1 bed | Checked before allowing bed removal |
| Cannot delete a building/floor/apartment/room with an occupied bed inside | Checked before every delete |
| Cannot delete a resident who is currently housed | Checked before delete |

## API Overview

Base URL: `http://localhost:5213/api`

| Resource | Endpoints |
|---|---|
| Buildings | `GET /buildings`, `POST /buildings`, `GET /buildings/{id}`, `DELETE /buildings/{id}` |
| Floors | `POST /buildings/{buildingId}/floors`, `DELETE /floors/{id}` |
| Apartments | `POST /floors/{floorId}/apartments`, `DELETE /apartments/{id}` |
| Rooms | `GET /rooms/{id}`, `POST /apartments/{apartmentId}/rooms`, `DELETE /rooms/{id}` |
| Beds | `POST /rooms/{roomId}/beds`, `DELETE /beds/{bedId}`, `POST /beds/{bedId}/assign`, `POST /beds/{bedId}/unassign`, `GET /beds/nearest-empty` |
| Residents | `GET /residents`, `POST /residents`, `GET /residents/{id}`, `PUT /residents/{id}`, `DELETE /residents/{id}` |

## Running with Docker (recommended)

Requires Docker Desktop.

```bash
docker compose up -d --build
```

This starts:
- `db` — SQL Server on `localhost:1433` (`sa` / `YourStrong@Passw0rd`)
- `backend` — API on `http://localhost:5213`
- `frontend` — SPA on `http://localhost:5173`

The database schema isn't created automatically — apply migrations once the
`db` container is up and healthy:

```bash
cd backend
dotnet ef database update
```

### Loading mock data

To populate the database with sample buildings/residents for a demo:

```bash
docker cp seed-data.sql taskeen-db:/seed-data.sql
docker exec -it taskeen-db /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -d TaskeenDb -i /seed-data.sql
```

## Running without Docker

### Prerequisites
- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- A local SQL Server instance

### Backend

```bash
cd backend
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (or the next available port — check
the terminal output). If it runs on a different port, update the CORS policy
in [backend/Program.cs](backend/Program.cs) or requests will be blocked by
the browser.

### Configuration

The connection string lives in [backend/appsettings.json](backend/appsettings.json):

```json
"ConnectionStrings": {
  "TaskeenDb": "Server=localhost,1433;Database=TaskeenDb;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=True;"
}
```

Adjust `Server`/credentials to match your SQL Server instance.

## Known Limitations

- No authentication/authorization — single trusted user assumed for this version
- No automated tests yet
- See [frontend/TECH_DEBT.md](frontend/TECH_DEBT.md) for tracked shortcuts and deferred improvements
