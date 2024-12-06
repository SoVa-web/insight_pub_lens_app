FROM node:20-alpine as build
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

COPY --chown=node:node --from=build /app ./
RUN npm prune --omit=dev

EXPOSE 8000

CMD ["npm", "run", "start:prod"]