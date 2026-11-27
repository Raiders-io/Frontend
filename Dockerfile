FROM node:24.16.0-bookworm-slim AS base

WORKDIR /app

COPY package*.json ./
RUN npm clean-install --include=dev

CMD ["npm", "run", "build"]
