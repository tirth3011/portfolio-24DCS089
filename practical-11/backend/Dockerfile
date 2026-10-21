# Use official Node.js Alpine base image for minimal footprint
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package dependency manifests first to leverage Docker layer caching
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy entire backend source code into container
COPY . .

# Expose backend application port
EXPOSE 5011

# Define container startup execution command
CMD ["node", "server.js"]
