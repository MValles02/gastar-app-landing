FROM nginx:1.31.8-alpine@sha256:785835ea65db4bba6f021acc0f3be91b0fef76a53fe41f8588c6698d2aed0606
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html favicon.ico icon.svg apple-touch-icon-180x180.png /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
ARG GIT_SHA=dev
RUN printf '{"status":"ok","sha":"%s"}\n' "$GIT_SHA" > /usr/share/nginx/html/health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO /dev/null http://127.0.0.1/ || exit 1
