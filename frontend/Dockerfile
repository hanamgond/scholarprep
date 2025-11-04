# --- Stage 1: The Builder ---
# Use a Node.js 18 image to build our React app
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production-ready static files
RUN npm run build

# --- Stage 2: The Server ---
# Use a lightweight Nginx image to serve the static files
FROM nginx:1.25-alpine

# Copy the built static files from the 'builder' stage
# into the default Nginx public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Tell Nginx to listen on port 80
EXPOSE 80

# The default Nginx command will start the server
CMD ["nginx", "-g", "daemon off;"]