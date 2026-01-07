FROM node:20.19.0-alpine as dependencies

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --only=production

FROM node:20.19.0-alpine as builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20.19.0-alpine as runtime

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json .

EXPOSE 4173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]