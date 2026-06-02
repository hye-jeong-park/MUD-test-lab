# MUD detection test lab - inert test bed (no real malicious behavior)
FROM node:20-alpine

WORKDIR /app

# Install production deps first (better layer caching)
COPY package.json ./
RUN npm install --omit=dev

# Copy application
COPY . .

ENV PORT=18080
EXPOSE 18080

CMD ["node", "server.js"]
