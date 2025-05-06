# Use official Node.js base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Expose port 3000
EXPOSE 3000

# Default command
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
