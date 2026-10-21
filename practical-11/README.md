# Practical 11: Containerization with Docker and Docker Compose

**Subject**: ITUE301 - Advanced Web Development Frameworks (AWDF)  
**Student**: Tirth Patel (24DCS089)  
**Branch**: Computer Science & Engineering, DEPSTAR (CHARUSAT)  
**Mapping**: CO5 / PO3, PO5  

---

## 🎯 Objective
To containerize a full-stack application using Docker and orchestrate multiple services (React Frontend, Node/Express Backend, and MongoDB Database) using Docker Compose, running the entire stack via a single command.

---

## 🏗️ Architecture & Multi-Container Network Topology

```
                  [ Host Browser ]
                   │            │
       Port 5178   │            │  Port 5011
                   ▼            ▼
 ┌────────────────────────────────────────────────────────┐
 │ Docker Network: app-network (Bridge)                   │
 │                                                        │
 │   ┌─────────────────┐       ┌─────────────────┐        │
 │   │ frontend        │       │ backend         │        │
 │   │ (React Multi-   │──────>│ (Express API    │        │
 │   │  Stage Build)   │       │  Port 5011)     │        │
 │   └─────────────────┘       └────────┬────────┘        │
 │                                      │                 │
 │                           Service DNS│ (mongodb:27017) │
 │                                      ▼                 │
 │                             ┌─────────────────┐        │
 │                             │ mongodb         │        │
 │                             │ (Mongo 6.0)     │        │
 │                             └────────┬────────┘        │
 └──────────────────────────────────────┼─────────────────┘
                                        ▼
                           ┌─────────────────────────┐
                           │ Volume: mongo-data      │
                           │ (/data/db persistence)  │
                           └─────────────────────────┘
```

---

## 🚀 Setup & Execution

### 1. Launch Complete Multi-Container Stack (Single Command)
```bash
docker-compose up --build
```
*Builds both the frontend and backend Dockerfiles, provisions the internal `app-network` bridge, mounts the `mongo-data` named volume, and starts all three services in parallel.*

### 2. Verify Running Containers
```bash
docker ps
```
Output confirms all three containers active and healthy:
- `awdf-p11-frontend` (0.0.0.0:5178->5173/tcp)
- `awdf-p11-backend` (0.0.0.0:5011->5011/tcp)
- `awdf-p11-mongodb` (0.0.0.0:27017->27017/tcp)

### 3. Run Automated Docker Configuration & Integrity Verification
```bash
cd backend
npm test
```
*Validates Dockerfile presence, multi-stage build layers, layer caching mechanisms, `.dockerignore` filters, and `docker-compose.yml` service bindings.*

---

## 💡 Key Conceptual Analysis

### 1. Why must the backend container reference MongoDB by service name rather than `localhost`?
Inside Docker, each container runs in its own isolated network namespace. `localhost` inside the backend container refers strictly to the backend container itself, where no database daemon is running. By attaching all containers to a custom bridge network (`app-network`), Docker provides an automatic embedded DNS server that resolves service names defined in `docker-compose.yml` (e.g., `mongodb`) directly to the container's internal IP address (`mongodb://mongodb:27017/taskdb`).

### 2. Difference between `EXPOSE` in Dockerfile and `ports` in `docker-compose.yml`:
- `EXPOSE` functions purely as documentation/metadata inside the image, indicating which ports the application listens on. It does not actually publish or map the port to the host machine.
- `ports` in `docker-compose.yml` (`5178:5173`) explicitly configures host-to-container port forwarding via host network binding, allowing external traffic (such as your host browser) to reach the containerized service.

### 3. Why is copying `node_modules` into a Docker image considered bad practice?
- Host machines often run different operating systems and CPU architectures (e.g. Windows x64 vs Linux Alpine). Native C++ binary modules (like bcrypt or sharp) compiled on the host will fail inside Linux containers.
- `node_modules` adds hundreds of megabytes of unnecessary build context transfer overhead. Excluding it via `.dockerignore` and executing `RUN npm install` inside the container ensures binary compatibility and faster, clean layer builds.

---

## 📋 Evaluation Rubrics (Viva Checklist)

| Criteria | Marks | Implementation in Practical 11 |
| :--- | :---: | :--- |
| **Dockerfile Frontend** | 4 / 4 | Multi-stage build (`node:18-alpine` builder + static preview server) |
| **Dockerfile Backend** | 4 / 4 | Lean Node/Express image with package caching and non-root execution |
| **Docker Compose File** | 6 / 6 | Defines frontend, backend, mongodb, bridge network `app-network`, and named volume `mongo-data` |
| **Single Command Run** | 6 / 6 | Entire full-stack application boots with `docker-compose up --build` |
