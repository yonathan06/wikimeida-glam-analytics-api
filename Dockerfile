FROM       node:12-alpine

WORKDIR    /usr/wikimedia-glam-analytics-api

# Copy and install production packages
COPY       build build/
COPY       migrations migrations/
COPY       package*.json ./
COPY       production.env ./
RUN        npm ci --production

# Non root user
USER       node

ENV        NODE_ENV="production"
EXPOSE     8080 
# Running port is configured through API_PORT env variable
ENTRYPOINT ["npm"]
CMD        ["start"]
