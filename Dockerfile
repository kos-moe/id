FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable
RUN corepack prepare pnpm@latest --activate
RUN pnpm install

COPY . .
RUN pnpm run prisma:generate
RUN pnpm run build

EXPOSE 8000

CMD ["pnpm", "start"]