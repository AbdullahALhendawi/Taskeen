
| Entity | Key Fields |
|---|---|
| Building | Id, Name, CreatedAt |
| Floor | Id, FloorNumber, BuildingId |
| Apartment | Id, ApartmentNumber, FloorId |
| Room | Id, RoomNumber, ApartmentId |
| Bed | Id, BedNumber, RoomId, ResidentId (nullable) |
| Resident | Id, EmployeeId, FullName, Phone, Nationality, JobTitle |

A unique index on `Bed.ResidentId` guarantees at the database level that no
resident can ever be assigned to two beds simultaneously.

---

## Business Rules

| Rule | Enforcement |
|---|---|
| A bed holds 0 or 1 resident | Application logic + database unique index |
| A resident holds 0 or 1 bed | Same as above |
| Every room has at least 1 bed | Checked before allowing bed removal |
| Cannot delete structure with occupied beds inside | Checked before every delete |
| Cannot delete a resident who is currently housed | Checked before delete |
| Apartment/room numbering stays sequential, no gaps | Automatic renumbering on add/delete |

---

## API Overview

Full endpoint list available in `Taskeen_Architecture_Walkthrough.md`.

Base URL: `http://localhost:5213/api`

| Resource | Endpoints |
|---|---|
| Buildings | `GET`, `POST /buildings`, `GET`, `DELETE /buildings/{id}` |
| Floors | `POST /buildings/{id}/floors`, `DELETE /floors/{id}` |
| Apartments | `POST /floors/{id}/apartments`, `DELETE /apartments/{id}` |
| Rooms | `POST /apartments/{id}/rooms`, `GET`, `DELETE /rooms/{id}` |
| Beds | `POST /rooms/{id}/beds`, `DELETE /beds/{id}`, `POST /beds/{id}/assign`, `POST /beds/{id}/unassign`, `GET /beds/nearest-empty` |
| Residents | `GET`, `POST /residents`, `GET`, `PUT`, `DELETE /residents/{id}` |

---

## How to Run

### Prerequisites
- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- SQL Server (Developer Edition or similar), running locally

### 1. Backend

```bash
cd taskeen-backend
dotnet restore
dotnet ef database update   # creates the database and tables
dotnet run
```

Backend runs at `http://localhost:5213`.

### 2. Frontend

```bash
cd taskeen-frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173` (or the next available port — check
the terminal output).

⚠️ **Note:** if the frontend runs on a different port than `5173`, update the
CORS policy in `taskeen-backend/Program.cs` to match, or requests will be
blocked by the browser.

### 3. Configuration

The database connection string is in `taskeen-backend/appsettings.json`:

```json
"ConnectionStrings": {
  "TaskeenDb": "Server=localhost;Database=TaskeenDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Adjust `Server` if your SQL Server instance is named or hosted differently.

---

## Known Limitations

- No authentication/authorization — single trusted user assumed for this version
- No automated tests yet
- Visual design (colors, typography, spacing) is functional but not final —
  a dedicated design pass is planned separately
- See `TECH_DEBT.md` for a full list of known trade-offs and their reasoning

---

## Project Documentation

- `TECH_DEBT.md` — tracked shortcuts and deferred improvements, with reasoning
- `Taskeen_SRS.pdf` — Software Requirements Specification
- `Taskeen_SDD.pdf` — Software Design Document
- `Taskeen_Architecture_Walkthrough.md` — detailed file-by-file explanation of
  how the frontend and backend are structured and connected