# LODESTAR Backend Planning

Updated: 29 June 2026

This file tracks backend and database planning decisions for the LODESTAR Dashboard. Decisions will be added one by one in priority order.

## Priority Flow

```text
1. Backend framework
2. Database
3. File / object storage
4. Data ingestion method
5. Authentication and roles
6. Background processing
7. Cache and performance
8. Deployment
9. Monitoring and backups
```

## 1. Backend Framework

Status: Pending decision

| Option | Best For | Notes |
| --- | --- | --- |
| Python + FastAPI | Scientific data, raster processing, ML/data pipelines, GeoTIFF/NetCDF handling | Recommended for LODESTAR |
| Node.js + Express/Fastify | Staying close to the current JavaScript frontend stack | Simple transition from frontend JS |
| Django + Django REST Framework | Built-in admin panel, users, permissions, database models | Heavier but very complete |

Recommended priority choice: **Python + FastAPI**

Reason: LODESTAR will likely handle geospatial data, scientific files, raster processing, forecasts, and model outputs.

## Decisions

| Priority | Decision | Status |
| ---: | --- | --- |
| 1 | Backend framework | Pending |
| 2 | Database | Pending |
| 3 | File / object storage | Pending |
| 4 | Data ingestion method | Pending |
| 5 | Authentication and roles | Pending |
| 6 | Background processing | Pending |
| 7 | Cache and performance | Pending |
| 8 | Deployment | Pending |
| 9 | Monitoring and backups | Pending |
