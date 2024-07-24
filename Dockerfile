FROM node:20-slim as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

COPY src ./src
RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:latest

WORKDIR /var/task

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules


CMD ["dist/handler.handler"]