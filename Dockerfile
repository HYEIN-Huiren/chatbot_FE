FROM node:16 as builder
RUN mkdir /app
WORKDIR /app
COPY ./ .

ENV VITE_STD_FE_APP_URL=http://

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm build

FROM nginx:alpine   
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist .

ENTRYPOINT ["nginx", "-g", "daemon off;"]
