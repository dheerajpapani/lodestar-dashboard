# LODESTAR Backend & Database Plan

Updated: 29 June 2026

## 0. Clean System View

```text
+--------------------------------------------------------------------------------+
|                         LODESTAR CORE ARCHITECTURE                              |
+--------------------------------------------------------------------------------+

                         +-----------------------------+
                         | Frontend                    |
                         | Dashboard / Maps / Alerts   |
                         +--------------+--------------+
                                        |
                       HTTPS + REST     |     WebSocket live updates
                                        |
                                        v
             +--------------------------+--------------------------+
             | Backend Server                                      |
             | APIs / Auth / Ingestion / File Access / Live Events |
             +-----------+--------------+--------------+-----------+
                         |              |              |
             metadata    |              | files        | cache
             + spatial   |              |              |
                         v              v              v
       +-----------------+--+     +-----+---------+   +-+----------------+
       | Database           |     | Big File      |   | Cache Layer     |
       | structured +       |     | Storage       |   | API + static    |
       | geospatial data    |     | raster/model  |   | acceleration   |
       | users / alerts /   |     | outputs       |   | repeated data   |
       | sites / metadata   |     | large files   |   | live summaries  |
       +--------------------+     +---------------+   +-----------------+
                         ^              ^
                         |              |
                         | metadata     | raw + processed files
                         |              |
              +----------+--------------+-----------+
              | Data Ingestion Layer                |
              | validate -> extract -> upload/index |
              +----------------+--------------------+
                               ^
                               |
                      controlled data input
                               |
                      +--------+---------+
                      | Data Source      |
                      | uploads / sync   |
                      +------------------+
```

## 0.1 Core Data Flow

```text
1. Frontend requests dashboard data
   React Dashboard -> FastAPI REST API -> PostgreSQL/PostGIS -> response

2. Frontend receives live updates
   FastAPI WebSocket -> live alerts / sensor updates / ingestion status -> React Dashboard

3. Large files enter the system
   SFTP/local server -> FastAPI ingestion flow -> object storage + database metadata

4. Large files are displayed or downloaded
   React Dashboard -> FastAPI -> signed object-storage URL / cached public asset

5. Repeated data becomes faster
   React Dashboard -> FastAPI -> Redis/CDN cache -> response
```

---

## 1. Backend Framework

### Priority Choice

```text
1st Priority : Python + FastAPI
2nd Priority : Node.js + Fastify
```

### Recommended Choice

**Python + FastAPI**

### Why FastAPI Fits Best

| Reason | Benefit |
| --- | --- |
| Scientific-data friendly | Better fit for raster, forecast, sensor, and model data processing |
| Geospatial ecosystem | Works well with GeoPandas, Rasterio, xarray, GDAL, NumPy, Pandas |
| Fast APIs | Good performance for dashboard APIs |
| Clean API docs | Auto-generates Swagger/OpenAPI docs |
| Future-ready | Suitable for ML, data pipelines, and background processing |

### Current Decision

```text
Backend direction: Python + FastAPI
Backend role     : API server + data processing entry point
Frontend link    : React dashboard will consume FastAPI REST endpoints
```

### Keep In Mind

FastAPI is the best first choice if LODESTAR expects heavy scientific, geospatial, raster, or forecast data workflows. Node.js is still useful for simple APIs, but FastAPI gives better long-term flexibility for this project.

---

## 2. Database

### Priority Choice

```text
1st Priority : PostgreSQL + PostGIS
2nd Priority : MongoDB
3rd Priority : MySQL
```

### Recommended Choice

**PostgreSQL + PostGIS**

### Why PostgreSQL + PostGIS Fits Best

| Reason | Benefit |
| --- | --- |
| Structured data | Stores alerts, users, study sites, sensors, and metadata cleanly |
| Spatial support | Handles locations, polygons, bounding boxes, and map-based queries |
| Reliable at scale | Strong choice for production dashboards and research systems |
| Data integrity | Better consistency for important scientific and admin data |
| Query flexibility | Works well for filtering by date, hazard type, location, and region |

### Current Decision

```text
Database direction: PostgreSQL + PostGIS
Database role     : Main structured and geospatial data store
Stores            : users, roles, alerts, sites, sensors, dataset metadata
Does not store    : large TIFF, COG, NetCDF, image, or raw forecast files directly
```

### Keep In Mind

Large scientific files should stay in object storage. PostgreSQL should store their metadata, links, location details, processing status, and access rules.

---

## 3. Server / Hosting Strategy

### Available Existing Option

**Local / institutional SFTP server**

```text
Purpose       : Secure file transfer from local server to backend system
Best use      : Raw data ingestion, scheduled sync, researcher uploads
Protocol      : SFTP over SSH
Access style  : User/password or SSH key based access
Data fit      : TIFF, COG, NetCDF, CSV, JSON, images, model outputs
Main role     : Data source / transfer bridge, not main application hosting
```

### SFTP Limitations For This Project

| Limitation | Impact |
| --- | --- |
| No API layer | Frontend cannot query dashboard data directly from SFTP |
| No spatial search | Cannot efficiently filter by map bounds, region, or geometry |
| No metadata indexing | Hard to search by date, hazard type, sensor, model run, or status |
| Weak for concurrent users | Large downloads from many users can overload the server |
| Not application hosting | Cannot run FastAPI routes, auth workflows, or dashboard APIs by itself |
| Limited automation | Needs separate scripts/workers for validation, conversion, and publishing |

### Priority Choice

```text
1st Priority : Cloud VM / VPS with Docker (AWS EC2, Azure VM, DigitalOcean, Hetzner)
2nd Priority : Managed App Hosting (Render, Railway, Fly.io, Azure App Service)
3rd Priority : Kubernetes / Container Platform (AWS EKS, Azure AKS, Google GKE, Rancher)
```

| Priority | Option | Examples |
| --- | --- | --- |
| 1st | Cloud VM / VPS with Docker | AWS EC2, Azure VM, DigitalOcean Droplet, Hetzner VPS |
| 2nd | Managed App Hosting | Render, Railway, Fly.io, Azure App Service |
| 3rd | Kubernetes / Container Platform | AWS EKS, Azure AKS, Google GKE, Rancher |

### Recommended Choice

**Cloud VM / VPS with Docker**

### Why Cloud VM / VPS Fits Best

| Reason | Benefit |
| --- | --- |
| Full control | Can run FastAPI, workers, GDAL, Rasterio, and geospatial libraries |
| Docker support | Easier reproducible deployment for backend and processing jobs |
| Better for large data | Handles file sync, background jobs, and custom storage integration |
| Flexible networking | Can connect to SFTP, database, object storage, and frontend |
| Cost control | Can start small and scale resources as data grows |

### Current Decision

```text
Hosting direction: Cloud VM / VPS with Docker
Application role : Runs FastAPI backend and background workers
SFTP role        : Existing data-transfer source only
Data flow        : SFTP/local server -> backend worker -> object storage + database metadata
```

### Keep In Mind

SFTP is useful as an available bridge for moving data from the local server, but the production application should run on a proper backend hosting server. Large files should be copied into object storage and indexed in PostgreSQL/PostGIS.

---

## 4. Large File Storage

### Why This Is Separate

Large geospatial and scientific files should not be stored directly inside the backend server or database.

```text
Backend server : Runs APIs and processing logic
Database       : Stores structured records, metadata, users, alerts, locations
Object storage : Stores large files like TIFF, COG, NetCDF, CSV, PNG, GIF
```

Keeping these separate makes the system faster, cheaper to scale, easier to back up, and safer for long-term data growth.

### Priority Choice

```text
1st Priority : Managed Object Storage (AWS S3, Cloudflare R2, Azure Blob Storage)
2nd Priority : Self-hosted Object Storage (MinIO)
3rd Priority : File Server Storage (SFTP, NAS, NFS)
```

| Priority | Option | Examples | Pros | Cons |
| --- | --- | --- | --- | --- |
| 1st | Managed Object Storage | AWS S3, Cloudflare R2, Azure Blob Storage | Best for production-scale large files, CDN access, signed URLs, backups, and backend integration | Monthly cloud cost, provider lock-in, needs access-policy setup |
| 2nd | Self-hosted Object Storage | MinIO | S3-compatible, can run on own VPS/local server, more institutional control | You manage uptime, scaling, backups, disk failures, SSL, and security |
| 3rd | File Server Storage | SFTP, NAS, NFS | Simple for local transfer, raw archive, and internal team access | Not ideal for public APIs, map delivery, metadata search, browser access, or many users |

### Recommended Choice

**Managed Object Storage, with AWS S3 as the default first provider**

### Why Managed Object Storage Fits Best

| Reason | Benefit |
| --- | --- |
| Handles huge files | Suitable for TIFF, COG, NetCDF, CSV, forecast images, and model outputs |
| Durable storage | Safer than keeping data only on a VM disk |
| Backend friendly | FastAPI can upload, download, sign, and manage files through SDKs |
| CDN ready | Can connect with CloudFront for faster delivery |
| Common ecosystem | Strong support across Python, GIS tools, and data pipelines |

### Current Decision

```text
Storage direction: Object storage
Preferred option : Managed Object Storage
Default provider : AWS S3
Storage role     : Raw files, processed files, forecast outputs, raster assets
Database role    : Metadata, file paths, bounding boxes, timestamps, status
Backend role     : Upload, validate, process, index, and serve access links
```

### Expected Data Flow

```text
Local / SFTP Server
        |
        v
Backend Worker
        |
        +--> Object Storage: raw + processed large files
        |
        +--> PostgreSQL/PostGIS: metadata + spatial index + status
        |
        v
Frontend Dashboard
```

### Keep In Mind

The database should know what each file is, where it belongs, and how to query it. Object storage should hold the actual heavy files.

---

## 5. Data Ingestion Pipeline

### Why This Is Needed

Large incoming datasets need a controlled path into the system. Files should not be copied randomly into the app server because the dashboard needs clean metadata, validation, search, and processing status.

```text
Raw data source  : SFTP / local server / admin upload
Processing layer : Backend worker
Storage layer    : Object storage
Index layer      : PostgreSQL + PostGIS
Access layer     : FastAPI endpoints for frontend
```

### Priority Choice

```text
1st Priority : Automated Scheduled Ingestion
2nd Priority : Admin Upload Portal
3rd Priority : Manual Backend Script / CLI Import
```

| Priority | Option | Best Use | Pros | Cons |
| --- | --- | --- | --- | --- |
| 1st | Automated Scheduled Ingestion | Pulling new files from SFTP/local server hourly, daily, or weekly | Reliable, repeatable, less manual work, good for regular forecast/sensor data | Needs worker setup, scheduling, retries, and failure alerts |
| 2nd | Admin Upload Portal | Researcher/admin uploads from dashboard | Easy for non-developers, controlled upload flow, can validate before publish | Needs auth, upload limits, progress UI, and permission handling |
| 3rd | Manual Backend Script / CLI Import | Developer/admin imports files manually when needed | Simple to start, useful for one-time migration or emergency import | Not scalable, depends on technical person, easy to forget metadata steps |

### Recommended Choice

**Automated Scheduled Ingestion**

### Why Automated Ingestion Fits Best

| Reason | Benefit |
| --- | --- |
| Handles regular data | Works well for recurring forecast, sensor, raster, and model outputs |
| Reduces manual work | Less dependency on someone uploading files every time |
| Better consistency | Same validation and metadata rules run for every dataset |
| Easier monitoring | Failed imports can be logged, retried, and alerted |
| Dashboard ready | New valid data can become visible after indexing |

### Current Decision

```text
Ingestion direction: Automated Scheduled Ingestion
Main source        : Local / institutional SFTP server
Worker role        : Pull, validate, process, upload, and index data
Storage output     : Object storage
Database output    : PostgreSQL/PostGIS metadata records
Manual fallback    : Admin upload portal or CLI import
```

### Expected Data Flow

```text
SFTP / Local Server
        |
        v
Scheduled Backend Worker
        |
        v
Validate File
        |
        +--> Reject / log invalid files
        |
        v
Process / Convert If Needed
        |
        +--> Object Storage: raw + processed files
        |
        +--> PostgreSQL/PostGIS: metadata, bounds, date, status
        |
        v
FastAPI Endpoint
        |
        v
Frontend Dashboard
```

### Keep In Mind

The ingestion pipeline should track every file with a status such as `pending`, `processing`, `ready`, or `failed`. This makes dashboard data more reliable and easier to debug.

---

## 6. Authentication & Access Control

### Why This Is Needed

The dashboard may contain public data, researcher-only files, admin tools, and internal processing controls. Access control keeps sensitive datasets, uploads, and backend actions protected.

```text
Public users   : View public dashboard data
Researchers    : Access research datasets and internal views
Data managers  : Upload, approve, and manage datasets
Admins         : Manage users, roles, ingestion, and system settings
```

### Priority Choice

```text
1st Priority : JWT / Session Auth with Role-Based Access (FastAPI Users, Authlib, custom JWT)
2nd Priority : OAuth / Institutional Login (Google, Microsoft Entra ID, ORCID, institute SSO)
3rd Priority : Basic Admin Password Access (.env password, htpasswd, simple login table)
```

| Priority | Option | Examples | Pros | Cons |
| --- | --- | --- | --- | --- |
| 1st | JWT / Session Auth with Role-Based Access | FastAPI Users, Authlib, custom JWT/session auth | Flexible, works well with APIs, supports multiple roles, good for dashboard + admin portal | Needs careful token/session security, password reset flow, and role checks |
| 2nd | OAuth / Institutional Login | Google login, Microsoft Entra ID, ORCID, institute SSO | Easier user onboarding, no local password handling, good for universities/research teams | Depends on external identity provider, setup can be complex, may need approval from institute IT |
| 3rd | Basic Admin Password Access | Single `.env` admin password, htpasswd, simple login table | Fastest to implement, useful for early prototype or private demo | Not suitable for many users, weak role control, poor auditability |

### Recommended Choice

**JWT / Session Auth with Role-Based Access**

### Suggested Roles

| Role | Access |
| --- | --- |
| Public Viewer | Public pages, maps, alerts, published datasets |
| Researcher | Research-only datasets, internal visualization layers |
| Data Manager | Dataset upload, ingestion review, metadata editing |
| Admin | User management, roles, system settings, pipeline controls |

### Current Decision

```text
Auth direction : JWT / Session Auth with Role-Based Access
Default roles  : Public Viewer, Researcher, Data Manager, Admin
Public access  : Open dashboard pages and published data
Private access : Uploads, internal files, admin actions, restricted datasets
```

### Keep In Mind

OAuth or institutional login can be added later if the project needs official researcher accounts through Google, Microsoft, ORCID, or institute SSO.

---

## 7. API Design

### Why This Is Needed

The frontend needs clear backend communication for maps, alerts, datasets, files, uploads, and live updates. Since LODESTAR may include live sensor data and alert updates, real-time communication should be considered first.

### Priority Choice

```text
1st Priority : WebSocket / Real-time API (FastAPI WebSocket, Socket.IO, Server-Sent Events)
2nd Priority : REST API (FastAPI REST endpoints, OpenAPI/Swagger)
3rd Priority : GraphQL API (Strawberry GraphQL, Ariadne, Apollo GraphQL)
```

| Priority | Option | Examples | Pros | Cons |
| --- | --- | --- | --- | --- |
| 1st | WebSocket / Real-time API | FastAPI WebSocket, Socket.IO, Server-Sent Events | Best for live alerts, sensor streams, processing progress, and dashboard status updates | More complex than REST, needs reconnect handling, scaling needs extra care |
| 2nd | REST API | `/api/alerts`, `/api/sites`, `/api/datasets`, `/api/files`, OpenAPI/Swagger | Simple, predictable, easy to document, best for normal dashboard CRUD and file metadata | Not ideal for continuous live updates unless frontend polls repeatedly |
| 3rd | GraphQL API | Strawberry GraphQL, Ariadne, Apollo GraphQL | Flexible queries, useful for complex nested frontend data needs | Adds complexity, not necessary for first backend version |

### Recommended Choice

**Hybrid API: WebSocket for live updates + REST API for normal data**

### Current Decision

```text
API direction     : Hybrid API
Live updates      : WebSocket / real-time API
Normal data       : REST API
GraphQL status    : Optional later if queries become complex
API documentation : FastAPI OpenAPI / Swagger
```

### Expected Endpoint Types

```text
WebSocket / Real-time
  |-- live alerts
  |-- sensor updates
  |-- ingestion progress
  |-- backend status

REST API
  |-- GET  /api/sites
  |-- GET  /api/alerts
  |-- GET  /api/datasets
  |-- GET  /api/datasets/{id}
  |-- POST /api/uploads
  |-- GET  /api/files/{id}/download-url
  |-- GET  /api/ingestion/status
```

### Keep In Mind

Use WebSocket only where live behavior is actually needed. REST should still handle most stable dashboard data because it is simpler, easier to cache, and easier to test.

---

## 8. Background Workers / Job Queue

### Status

**Future requirement**

This should be added when data volume grows or when file processing starts taking too long for normal API requests.

### Why This Will Be Needed

Large geospatial workflows should not run directly inside normal API requests.

```text
Avoid:
User uploads large file -> API processes everything -> request timeout

Prefer:
User uploads file -> API creates job -> worker processes in background -> frontend gets progress
```

### Priority Choice

```text
1st Priority : Celery + Redis
2nd Priority : RQ + Redis
3rd Priority : FastAPI BackgroundTasks
```

| Priority | Option | Examples | Pros | Cons |
| --- | --- | --- | --- | --- |
| 1st | Celery + Redis | Celery workers, Redis broker, Celery Beat | Strong for production jobs, retries, scheduled ingestion, heavy processing | More setup and deployment complexity |
| 2nd | RQ + Redis | Python RQ, Redis Queue | Simpler than Celery, good Python fit, easy worker model | Less feature-rich for complex scheduling and orchestration |
| 3rd | FastAPI BackgroundTasks | Built-in FastAPI background task system | Very easy to start, no separate worker stack needed | Not ideal for heavy, long-running, retryable, or distributed jobs |

### Recommended Future Choice

**Celery + Redis**

### Future Use Cases

```text
|-- scheduled SFTP ingestion
|-- GeoTIFF / COG processing
|-- NetCDF parsing
|-- metadata extraction
|-- alert generation
|-- dataset validation
|-- failed job retries
|-- long-running admin uploads
```

### Current Decision

```text
Worker status : Future requirement
First choice  : Celery + Redis
Current need  : Plan now, implement when processing load increases
Frontend link : WebSocket can show job progress later
```

### Keep In Mind

Start simple with the API and ingestion flow. Add Celery + Redis when processing becomes slow, scheduled, retry-heavy, or too large for API request time.

---

## 9. Caching Layer

### Why This Is Needed

As data grows, repeated dashboard requests can become slow and expensive. Caching keeps common results close to the application and reduces pressure on the database, object storage, and backend server.

```text
Without cache:
Frontend -> API -> Database/Object Storage every time

With cache:
Frontend -> API -> Cache first -> Database/Object Storage only when needed
```

### Priority Choice

```text
1st Priority : Redis Cache (Redis, Upstash Redis, AWS ElastiCache)
2nd Priority : CDN Cache (CloudFront, Cloudflare CDN, Azure CDN)
3rd Priority : Database Query Cache / Materialized Views (PostgreSQL materialized views, indexed summary tables)
```

| Priority | Option | Examples | Pros | Cons |
| --- | --- | --- | --- | --- |
| 1st | Redis Cache | Redis, Upstash Redis, AWS ElastiCache | Fast API caching, session storage, job status, live summaries, rate limiting | Extra service to manage, cache invalidation must be planned |
| 2nd | CDN Cache | CloudFront, Cloudflare CDN, Azure CDN | Best for public static files, forecast images, tiles, processed assets | Not suitable for private/user-specific data unless configured carefully |
| 3rd | Database Query Cache / Materialized Views | PostgreSQL materialized views, indexed summary tables | Good for repeated analytics and heavy summary queries | Needs refresh strategy and extra database maintenance |

### Recommended Choice

**Redis Cache + CDN Cache**

### Current Decision

```text
Cache direction : Redis for API/runtime cache + CDN for public assets
Redis use       : alerts, session data, job status, API summaries, live sensor state
CDN use         : public raster images, forecast images, static processed files
Database use    : materialized views later for heavy analytics queries
```

### Suggested Cached Data

```text
Redis
  |-- recent alerts
  |-- live sensor summaries
  |-- API response cache
  |-- ingestion/job status
  |-- session or auth helper data
  |-- rate limiting counters

CDN
  |-- public forecast images
  |-- processed raster previews
  |-- map assets
  |-- static public files
```

### Keep In Mind

Cache should improve speed, but the database remains the source of truth. Any cached data should have clear expiry rules or invalidation triggers.
