FROM oven/bun:1.2.2 AS app

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .
RUN bun run build

EXPOSE 5000

CMD ["bun", "run", "start"]
