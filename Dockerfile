FROM node:20-alpine AS b
WORKDIR /app
ARG API_URL=http://api:4000
ENV API_URL=$API_URL
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=b /app/.next/standalone ./
COPY --from=b /app/.next/static ./.next/static
COPY --from=b /app/public ./public
EXPOSE 3000
CMD ["node","server.js"]
