# ===== Stage 1: Build =====
FROM node:23-alpine AS builder

WORKDIR /app

# Cài đặt Git để pull code (nếu cần, nhưng không khuyến khích)
RUN apk add --no-cache git

# Copy package.json và cài đặt dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy toàn bộ source code
COPY . .

# Chỉ build APP_NAME được truyền vào ARG
ARG APP_NAME
RUN yarn build:$APP_NAME

# ===== Stage 2: Final Image =====
FROM node:23-alpine AS runner

WORKDIR /app

# Copy chỉ các file cần thiết từ builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock

# Cài đặt dependencies chỉ cần cho production
RUN yarn install --production --frozen-lockfile --ignore-optional

# Dọn dẹp dependencies không cần thiết
RUN rm -rf node_modules/rxjs/{src,bundles,_esm5,_esm2015} \
    && rm -rf node_modules/swagger-ui-dist/*.map \
    && rm -rf node_modules/couchbase/src/

# Public thư mục uploads để lưu ảnh
RUN mkdir -p /app/uploads
VOLUME [ "/app/uploads" ]

# Mở cổng cho service
EXPOSE 3000

# Lệnh chạy ứng dụng
CMD ["yarn", "start:prod"]
