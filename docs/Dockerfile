FROM node:26.13.1-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS build

WORKDIR /workspace

COPY docs/package.json docs/package-lock.json ./docs/
RUN npm clean-install --prefix docs

COPY docs/ ./docs/
RUN npm run build --prefix docs

FROM nginx:1.31.8-alpine3.24-slim@sha256:4c734d33ee731135dc9f2349914a34551c920f4451fca8bb05bf5880eb9079e8

COPY --from=build /workspace/docs/build/ /usr/share/nginx/html/mdtg/
COPY docs/nginx.conf /etc/nginx/conf.d/default.conf
