# Sử dụng Node.js image
FROM node:18

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code vào container
COPY . .

# Build source
RUN npm run build

# Chạy server NestJS
CMD ["npm", "run", "start"]
