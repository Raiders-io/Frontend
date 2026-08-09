FROM node:24.16.0-bookworm-slim AS base

WORKDIR /app

# ----------------------------
# Stage : Prepare dependencies for production build at runtime
# ----------------------------
FROM base AS deps
COPY package*.json ./
RUN npm install --include=dev

CMD ["sh", "-c", "cp -a /src/. /app/ && npm run build"]
