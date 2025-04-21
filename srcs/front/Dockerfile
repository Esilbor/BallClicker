# ---------- STAGE 1: Build ----------
FROM node:20-alpine as builder

WORKDIR /app

# Copy config
COPY package*.json ./
RUN npm install

# Copy assets and source
COPY . .
RUN npm run build  # will generate /app/dist


# ---------- STAGE 2: Serve ----------
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Generate self-signed certificate for development
RUN apk add --no-cache openssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/nginx.key \
    -out /etc/nginx/ssl/nginx.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
