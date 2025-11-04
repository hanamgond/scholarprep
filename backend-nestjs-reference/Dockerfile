# Use an official Node.js 18 image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
# This caches our dependencies and speeds up future builds
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's source code
COPY . .

# Run the NestJS build (compiles TypeScript to JavaScript)
RUN npm run build

# Expose the port your app runs on
EXPOSE 3002

# The command to run your application in production mode
CMD ["npm", "run", "start:prod"]