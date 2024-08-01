# Use the official Node.js 14 image as the base image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Remove the source code
RUN rm -rf ./src

# Expose the port that the application will run on
EXPOSE 8080

# Start the application
CMD [ "npm", "run", "start:prod" ]