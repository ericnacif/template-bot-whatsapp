FROM node:20-slim

# Chromium e dependências de sistema usados pelo whatsapp-web.js (Puppeteer).
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        chromium \
        ca-certificates \
        fonts-liberation \
        libnss3 \
        libatk1.0-0 \
        libatk-bridge2.0-0 \
        libcups2 \
        libdrm2 \
        libgbm1 \
        libasound2 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libxkbcommon0 \
        libxcomposite1 \
        libxdamage1 \
        libxfixes3 \
        libxrandr2 \
    && rm -rf /var/lib/apt/lists/*

# Usa o Chromium do sistema e evita o download do Chromium pelo Puppeteer.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app

COPY package*.json ./
# O lifecycle "prepare" é usado apenas pelo Husky em desenvolvimento.
RUN npm ci --omit=dev --ignore-scripts

COPY . .

RUN chown -R node:node /app
USER node

CMD ["node", "index.js"]
