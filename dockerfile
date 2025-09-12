
# Stage 1: Build

FROM node:20-alpine AS builder

# set working directory
WORKDIR /usr/src/app

# Update npm to 11.6.0
RUN npm install -g npm@11.6.0


# Copy package.json files
COPY package*.json ./

# Install all dependencies
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build NestJS app
RUN npm run build

# Stage 2: Production

FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy only needed files from builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Set environment
ENV NODE_ENV=production

# Expose NestJS port
EXPOSE 3000

# Start app
CMD ["node", "dist/main"]
