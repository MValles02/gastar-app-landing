FROM nginx:1.31.8-alpine@sha256:1ef7ca94d7879df82421428ce13bd1eaa412404953859cf7a5b6512c25e67a60
COPY index.html favicon.ico icon.svg apple-touch-icon-180x180.png /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
ARG BUILD_SHA=dev
RUN printf '%s\n' "$BUILD_SHA" > /usr/share/nginx/html/version.txt
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO /dev/null http://127.0.0.1/ || exit 1
