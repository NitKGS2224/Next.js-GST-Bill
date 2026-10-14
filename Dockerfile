FROM node:20-alpine AS b
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --omit=dev
COPY --from=b /app/dist ./dist
EXPOSE 4000
CMD ["node","dist/main"]
  nitishkgs2224_db_user
  mRO8nIH5J53tyQPO