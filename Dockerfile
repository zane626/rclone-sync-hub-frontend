# Build stage
FROM node:20-alpine AS build-stage

WORKDIR /app
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm nrm

RUN nrm use taobao

# Install dependencies
RUN pnpm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Production stage
FROM nginx:latest AS production-stage

# Copy built files
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
