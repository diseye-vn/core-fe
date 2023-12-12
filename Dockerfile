# Stage 1: Build the Node.js application
FROM node:18.19-slim as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Set the VITE_HOST environment variable
ENV VITE_HOST="https://debe.uom.vn"

# Build the project
RUN npm run build

# Stage 2: Set up Nginx to serve the built files
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose the port Nginx is running on
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
