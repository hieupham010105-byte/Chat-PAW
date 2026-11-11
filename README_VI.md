# ChatPaw 2.0 – bản nâng cấp

## Chạy trong VS Code
1. Cài Node.js 20 trở lên.
2. Mở thư mục dự án trong VS Code.
3. Mở Terminal và chạy `npm install`.
4. Sao chép `server/.env.example` thành `server/.env`, sau đó dán Gemini API Key mới vào `GEMINI_API_KEY`.
5. Chạy `npm run dev` để mở giao diện tại `http://localhost:5173`.
6. Mở Terminal thứ hai, chạy `npm run server` để bật API tại cổng 5000.

Không gửi file `server/.env` lên GitHub. API key trong file `.env` chỉ dùng cho backend, không đặt trong `src`.

## Những gì đã cập nhật
- Bỏ nút “Bắt đầu học” ở trang chủ.
- Audio có 6 câu chuyện theo 6 chủ đề: Daily Life, Travel, Food, School, Family, Shopping.
- Mỗi câu chuyện có 20 lượt thoại, có nhiều nhân vật, hiển thị câu tiếng Anh và nghĩa tiếng Việt.
- Nút “Tiếp theo” chuyển sang lượt thoại kế tiếp và tự đọc câu mới; có thể nghe lại hoặc chọn tốc độ.
- Backend Express có thể phục vụ cả frontend đã build và API trên cùng một domain để triển khai một dịch vụ.

## Lưu ý quan trọng về ngân hàng câu hỏi
Trong ZIP bạn gửi, mã nguồn hiện có **8 câu hỏi tiếng Anh và 8 câu hỏi tiếng Trung**, được dùng lại ở các chủ đề; README cũ cũng ghi 8 câu mỗi ngôn ngữ. Mình không tự ý thay chúng bằng 30 câu khác để tránh làm sai yêu cầu “giữ nguyên 30 câu hỏi”. Cần xác nhận bộ 30 câu nằm ở bản khác hay bạn muốn bổ sung câu hỏi sau.

## Đưa website lên mạng 24/24 với link cố định
Có thể dùng Render Web Service (hoặc dịch vụ Node hosting tương đương):
1. Đẩy thư mục dự án lên một GitHub repository riêng tư hoặc công khai (đảm bảo `server/.env` không được commit).
2. Trên Render, tạo **New → Web Service** và kết nối repository.
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Trong Environment Variables, thêm `GEMINI_API_KEY` với API key mới; có thể thêm `GEMINI_MODEL=gemini-2.5-flash-lite`.
6. Deploy. Render cấp một URL cố định dạng `https://ten-du-an.onrender.com`; có thể gắn domain riêng.

Muốn chạy liên tục 24/24 thì chọn gói hosting luôn bật (always-on). Gói miễn phí của một số nền tảng có thể tự ngủ khi ít truy cập, nên không bảo đảm luôn phản hồi ngay. Link vẫn giữ nguyên; người khác không cần máy tính của bạn bật.

## Bảo mật API key
Một API key thật đã nằm trong file `server/.env` của ZIP bạn gửi. Vì key đã được chia sẻ trong cuộc trò chuyện, hãy vào Google AI Studio thu hồi (revoke) key đó và tạo key mới. Chỉ nhập key mới vào `server/.env` khi chạy local hoặc Environment Variables của hosting khi deploy.
