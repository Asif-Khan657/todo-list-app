# TODO List App

A responsive TODO list application built with Angular and ASP.NET Core Web API. Tasks are stored in memory on the backend, so no database setup is required.

## Features

- View all tasks and filter by **All**, **Active**, or **Completed**
- Add tasks, edit task titles, and mark tasks complete/incomplete
- Delete tasks with a confirmation prompt
- See total, remaining, and completed task counts
- Validate task titles (required, maximum 200 characters)
- Display loading, empty-list, and API error states
- Use the interface on desktop and mobile screens
- Shared app header and footer (footer displays the current year)

## Technology

| Area | Technology |
| --- | --- |
| Frontend | Angular 22, TypeScript, Angular reactive forms, signals, SCSS, Bootstrap 5 |
| Backend | .NET 10, ASP.NET Core Web API, C# |
| Storage | In-memory `ConcurrentDictionary<Guid, TodoItem>` |
| Frontend tests | Vitest, Angular TestBed, Angular HTTP testing utilities |
| Backend tests | xUnit, ASP.NET Core `WebApplicationFactory` |

## Prerequisites

- Node.js compatible with Angular 22 (developed with Node.js 24.22.0)
- npm (developed with npm 11.19.1)
- .NET 10 SDK
- Git (for cloning the repository)

## Getting started

Open two terminals at the repository root.

### 1. Run the backend

```powershell
cd backend/TodoListApi
dotnet restore
dotnet run --launch-profile http
```

The API runs at **http://localhost:5133**. For a quick check, open http://localhost:5133/api/todos; on a fresh start it returns `[]`.

The project also includes an HTTPS launch profile at `https://localhost:7199`, but the frontend is currently configured to use the HTTP endpoint. Use the `http` profile for the simplest local setup.

### 2. Run the frontend

From a second terminal at the repository root:

```powershell
cd frontend
npm ci
npm start
```

Open **http://localhost:4200**.

If Chrome unexpectedly reloads the page during local development, try Microsoft Edge or run `npm run start:no-reload`. The latter disables automatic live reload and is a development-only workaround.

### 3. API configuration

The frontend API URL is currently set in `frontend/src/app/services/todo-list.service.ts`:

```typescript
private readonly apiUrl = 'http://localhost:5133/api/todos';
```

If you change the backend port or use HTTPS, update this URL accordingly. The backend CORS policy currently permits requests from `http://localhost:4200`. The backend must be running for the frontend to load or modify tasks.

## API endpoints

Base URL: `http://localhost:5133/api/todos`

| Method | Endpoint | Description | Success response |
| --- | --- | --- | --- |
| GET | `/api/todos` | List tasks | `200 OK` |
| GET | `/api/todos/{id}` | Get one task | `200 OK` |
| POST | `/api/todos` | Create a task | `201 Created` |
| PUT | `/api/todos/{id}` | Update title and completion | `200 OK` |
| DELETE | `/api/todos/{id}` | Delete a task | `204 No Content` |

Example POST request:

```json
{ "title": "Buy milk" }
```

Example PUT request:

```json
{ "title": "Buy groceries", "isCompleted": true }
```

A task includes `id`, `title`, `isCompleted`, `createdAt`, and `updatedAt`. Unknown IDs return `404 Not Found`; invalid request data returns `400 Bad Request`.

## Running tests

### Backend

From the repository root:

```powershell
cd backend
dotnet test TodoListApi.slnx
```

Backend tests cover the in-memory data store, service operations, validation, and API HTTP responses using xUnit and an in-process test server.

### Frontend

From the repository root:

```powershell
cd frontend
npm ci
npm test -- --watch=false
```

Frontend tests cover the list, form, item, header and footer components, filtering, validation, CRUD interactions, error handling, and HTTP requests using Angular TestBed and Vitest.

### Production frontend build

```powershell
cd frontend
npm run build
```

## Project structure

```text
todo-list-app/
├── backend/
│   ├── TodoListApi/             # Controllers, DTOs, models, service, in-memory data
│   ├── TodoListApi.Tests/       # Backend unit and API integration tests
│   └── TodoListApi.slnx
├── frontend/
│   ├── src/app/components/
│   │   ├── todo-list/                # Container: task state, filtering, API actions
│   │   ├── todo-form/                # Create/edit form and validation
│   │   ├── todo-item/                # Task row and action events
│   │   ├── header/                   # Application title
│   │   └── footer/                   # Application name and current year
│   ├── src/app/services/             # HTTP service and tests
│   └── src/app/models/               # Frontend data contracts
└── README.md
```

## Design decisions and limitations

- **In-memory data:** Tasks remain available while the API process is running but are lost when it restarts. This is intentional for the assessment; there is no database or user account system.
- **Separation of concerns:** The Angular list container manages UI state and API actions; the form and item components emit user events; the header and footer are presentational. The Angular service handles HTTP requests. The API controller handles HTTP requests, the application service handles task operations, and the data class stores items.
- **Concurrency:** The backend uses `ConcurrentDictionary` to support concurrent requests without a separate database.
- **Validation:** Angular validates the form, and ASP.NET Core validates request DTOs. Both limit titles to 200 characters.
- **Local development:** The frontend currently uses a fixed localhost API URL and the API has a development-only CORS origin. A deployed version would need environment-specific configuration.
- **No authentication or persistence:** These are outside the requested assessment scope.

## Third-party libraries and references

This project uses the following third-party/open-source dependencies:

- [Angular](https://angular.dev/) and [Angular CLI](https://angular.dev/tools/cli) — frontend framework and tooling
- [Bootstrap](https://getbootstrap.com/) — responsive styling
- [RxJS](https://rxjs.dev/) — observable-based HTTP handling
- [Vitest](https://vitest.dev/) — frontend tests
- [xUnit](https://xunit.net/) — backend tests
- [Microsoft.AspNetCore.Mvc.Testing](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests) — in-process API integration testing
- [coverlet](https://github.com/coverlet-coverage/coverlet) — .NET test coverage tooling

The application follows standard Angular and ASP.NET Core conventions. No external TODO application or third-party example repository is identified as the source of the implementation. If you used any additional tutorials, snippets, or examples while developing the project, add their links here before submission. Follow the assessment provider's requirements regarding disclosure of AI-assisted development.