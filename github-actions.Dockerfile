FROM node:24.16.0-bookworm-slim AS base

WORKDIR /app

# ----------------------------
# Stage : Install all dependencies
# ----------------------------
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ----------------------------
# Stage : Build the application
# ----------------------------
FROM deps AS build
COPY . .
RUN npm run build

CMD ["echo Build seems to work"]
