FROM node:24.16.0-bookworm-slim AS base

WORKDIR /app

CMD ["sh", "-c", "npm install --include=dev && npm run build"]
