# Dockerfile for Frontend
FROM node:18-alpine

# Create app directory
WORKDIR /src/main

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the app
# RUN npm run build

# Install a simple http server to serve the static content
# RUN npm install -g serve

# Expose port
EXPOSE 5173

# Start the app
# CMD ["serve", "-s", "build", "-l", "3000"]
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
CMD ["npm", "run", "dev"]