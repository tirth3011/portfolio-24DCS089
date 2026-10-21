# ==========================================
# Multi-Stage Dockerfile for React Frontend
# Stage 1: Build production static bundle
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency definitions and install
COPY package*.json ./
RUN npm install

# Copy source code and build production artifact
COPY . .
RUN npm run build

# ==========================================
# Stage 2: Minimal runtime image to preview/serve
# ==========================================
FROM node:18-alpine

WORKDIR /app

# Copy package descriptors and built production assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/vite.config.js ./

# Expose Vite Preview port
EXPOSE 5173

# Serve built bundle in container with host binding
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
