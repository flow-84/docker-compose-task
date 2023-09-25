FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source 
COPY . .

# Expose port 3000
EXPOSE 3000

# Run app
CMD [ "node", "app.js" ]
