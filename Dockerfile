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

# These need to come after the dependencies so we get to use a cache when building
ARG        BUILD_DATE=unspecified
ARG        VCS_BRANCH=unspecified
ARG        VCS_COMMIT=unspecified
ARG        VCS_SHORT_COMMIT=unspecified
ARG        VCS_URL=unspecified
ARG        VERSION=unspecified

# See https://github.com/opencontainers/image-spec/blob/master/annotations.md
# Ack: Short revision is non standard
LABEL      org.opencontainers.image.created=${BUILD_DATE}
LABEL      org.opencontainers.image.ref.name=${VCS_BRANCH}
LABEL      org.opencontainers.image.revision=${VCS_COMMIT}
LABEL      org.opencontainers.image.shortrevision=${VCS_SHORT_COMMIT}
LABEL      org.opencontainers.image.source=${VCS_URL}
LABEL      org.opencontainers.image.version=${VERSION}

# Running port is configured through API_PORT env variable
ENTRYPOINT ["npm"]
CMD        ["start"]
