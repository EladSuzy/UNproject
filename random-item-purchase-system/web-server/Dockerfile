FROM node:18-alpine

WORKDIR /app

# Copy configuration files
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript code
RUN npm run build

# Remove development dependencies
RUN npm prune --production

EXPOSE 4000
CMD ["npm", "start"]
