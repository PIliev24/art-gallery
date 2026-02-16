# Stage 1: Install dependencies
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build the frontend
FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bunx vite build

# Stage 3: Production
FROM oven/bun:1 AS production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY server ./server
COPY src/data ./src/data
COPY src/types ./src/types
COPY drizzle ./drizzle

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "server/index.ts"]
