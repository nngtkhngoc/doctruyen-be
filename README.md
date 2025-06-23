# 📚 DocTruyen Backend

DocTruyen là một hệ thống backend mạnh mẽ hỗ trợ nền tảng đọc truyện online, cung cấp các tính năng như quản lý người dùng, truyện, chương, thể loại, blog, chatbot, xác thực OAuth, và tạo giọng đọc tự động (Text-to-Speech).

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **ORM:** Prisma + PostgreSQL
* **Authentication:** JWT, Google OAuth2, Cookie
* **Upload:** Cloudinary, Multer
* **Voice Synthesis:** gTTS (Google Text-to-Speech)
* **Other Tools:** Nodemailer, Cron jobs, Swagger, xlsx, Joi

---

## 📁 Folder Structure

```
├— config/               # Cấu hình cloudinary, db, nodemailer
├— controllers/          # Xử lý logic của các tài nguyên (Auth, Story, Blog,...)
├— routes/               # Định tuyến API Express
├— services/             # Logic nghiệp vụ (service layer)
├— prisma/               # Prisma schema & migration
├— middleware/           # Middleware: check auth, ban status, multer,...
├— jobs/                 # Cron job tự động (update hằng ngày, ...)
├— utils/                # Hàm tiện ích (gen token, xử lý excel,...)
├— validation/           # Xác thực dữ liệu đầu vào bằng Joi
├— types/                # Định nghĩa types (TypeScript declaration)
├— asset/chapters/       # Chứa file audio chương truyện (mp3)
├— docs/                 # File tài liệu hoặc danh sách truyện (top50)
├— openai/               # Giao tiếp với OpenAI API (nếu dùng chatbot)
└— server.js             # Entry point chính của server
```

---

## 🚀 Scripts

```bash
npm run dev       # Chạy dev server với nodemon
npm start         # Chạy production server (node --watch)
npm run gen       # Generate Prisma Client
```

---

## 🔐 Authentication

* Đăng nhập truyền thống (JWT + Cookie)
* OAuth2 với Google (`passport-google-oauth20`)
* Middleware kiểm tra quyền admin & trạng thái ban

---

## 📦 Features

* **User Authentication & OAuth**
* **Story Management**: Tạo, sửa, xoá truyện
* **Chapter Upload**: Upload chương + tạo voice đọc truyện (gTTS)
* **Genre & Blog System**
* **Chatbot**: Trả lời tự động thông qua OpenAI 
* **Admin Panel**: Check trạng thái ban, phân quyền
* **Excel Import**: Nhập dữ liệu chương từ Excel
* **Email**: Gửi mail bằng Nodemailer
* **API Documentation**: Swagger UI

---

## 🥪 Testing

Tạm thời có các file:

* `test.js`: viết test thủ công
* `test.txt`: lưu kết quả test

---

## 🔄 Cron Job

* `dailyUpdate.js`: Chạy cập nhật truyện mỗi ngày bằng `node-cron`

---

## 📄 API Docs

* Swagger docs được setup với `swagger-ui-express` & `swagger-jsdoc`

---


## 👥 Team

### Frontend Developer

- **Họ tên**: Nguyễn Cao Quang - **MSSV**: 23521284

### Full-stack Developer

- **Họ tên**: Nguyễn Thị Khánh Ngọc - **MSSV**: 23521032
- **Họ tên**: Ung Quang Trí - **MSSV**: 23521649
- **Họ tên**: Võ Chí Cường - **MSSV**: 23520210
- **Họ tên**: Nguyễn Công Đức - **MSSV**: 23520307

## 📜 License

This project is licensed under the ISC License.

