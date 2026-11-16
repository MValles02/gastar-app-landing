FROM nginx:1.31.8-alpine@sha256:fed7e14be83cbd2661a75cdc5b872d936cf155d46c327084d30b8df19ae88d72
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html favicon.ico icon.svg apple-touch-icon-180x180.png /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY privacidad /usr/share/nginx/html/privacidad
COPY terminos /usr/share/nginx/html/terminos
ARG GIT_SHA=dev
RUN printf '{"status":"ok","sha":"%s"}\n' "$GIT_SHA" > /usr/share/nginx/html/health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO /dev/null http://127.0.0.1/ || exit 1
