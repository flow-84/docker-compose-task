# Build stage
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Production stage
FROM node:18 AS production
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --only=production
COPY --from=build /usr/src/app ./
EXPOSE 3000
CMD [ "node", "app.js" ]
