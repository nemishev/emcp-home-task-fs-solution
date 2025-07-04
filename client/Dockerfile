## Build for local dev
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS development
WORKDIR /usr/share/app
COPY --chown=node:node package*.json ./
RUN npm ci
COPY --chown=node:node . .
USER node

## Build for prod
ARG NODE_VERSION
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /usr/share/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/share/app/node_modules ./node_modules
COPY --chown=node:node . .
RUN npm run build
ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force
USER node

# Prod
FROM nginx:alpine
# Create a non-root user to run nginx
RUN adduser -D -H -u 1001 -s /sbin/nologin webuser
# Create app directory
RUN mkdir -p /app/www
# Copy built assets from build stage
COPY --from=build /usr/share/app /app/www
# Copy nginx config template
COPY nginx.conf /etc/nginx/templates/default.conf.template
# Set correct ownership and permissions
RUN chown -R webuser:webuser /app/www && \
    chmod -R 755 /app/www && \
    # Nginx needs to read and write to these directories
    chown -R webuser:webuser /var/cache/nginx && \
    chown -R webuser:webuser /var/log/nginx && \
    chown -R webuser:webuser /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R webuser:webuser /var/run/nginx.pid && \
    chmod -R 777 /etc/nginx/conf.d

# Expose port (will be overridden by Render)
EXPOSE 80

# Tell nginx's template processing which variables to replace
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
ENV NGINX_ENVSUBST_TEMPLATE_SUFFIX=.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV PORT=80

# Switch to non-root user
USER webuser

# Start nginx
CMD ["nginx", "-g", "daemon off;"]