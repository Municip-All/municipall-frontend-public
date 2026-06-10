# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_BACKOFFICE_URL=https://mairie.municipall.dev
ENV NEXT_PUBLIC_BACKOFFICE_URL=$NEXT_PUBLIC_BACKOFFICE_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve static export
FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
