# Stage 1: Build (Create React App → dossier build/)
FROM node:20-alpine AS builder
WORKDIR /app

ARG REACT_APP_API_URL=https://api.municipall.dev/api/v1/
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve static build via nginx
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
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
