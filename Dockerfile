FROM node:18-alpine

ENV PORT 80

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install
RUN pnpm run generate

COPY . .

EXPOSE 80

CMD ["pnpm", "start"]