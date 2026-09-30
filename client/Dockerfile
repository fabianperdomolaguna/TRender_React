FROM node:24.19.0-bookworm
COPY . /app
WORKDIR /app
RUN corepack enable
RUN pnpm install
CMD ["pnpm", "run", "dev", "--host", "0.0.0.0"]