FROM node:26.13.0-alpine@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 AS build

WORKDIR /workspace

COPY docs/package.json docs/package-lock.json ./docs/
RUN npm clean-install --prefix docs

COPY docs/ ./docs/
RUN npm run build --prefix docs

FROM nginx:1.31.8-alpine3.24-slim@sha256:4c734d33ee731135dc9f2349914a34551c920f4451fca8bb05bf5880eb9079e8

COPY --from=build /workspace/docs/build/ /usr/share/nginx/html/mdtg/
COPY docs/nginx.conf /etc/nginx/conf.d/default.conf
