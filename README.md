# Bản đồ Việt Nam với OpenStreetMap

Ứng dụng web cho phép người dùng nhập tên một địa điểm ở Việt Nam và hiển thị 5 điểm quan tâm (points of interest) trên bản đồ.

## Tính năng

- 🔍 Tìm kiếm địa điểm tại Việt Nam
- 🗺️ Hiển thị bản đồ tương tác với OpenStreetMap
- 📍 Hiển thị 5 điểm quan tâm xung quanh vị trí tìm kiếm
- 💡 Thông tin chi tiết về từng điểm quan tâm
- 📱 Giao diện thân thiện và responsive
- 🌤️ Hiển thị thời tiết hiện tại của địa điểm được tìm
- 🧭 Giao diện bản đồ toàn màn hình, nổi bật như Google Maps
- 🔐 Đăng kí/đăng nhập bằng Google thông qua Firebase Authentication

## Cài đặt

1. Cài đặt các dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm start
```

3. Mở trình duyệt tại: `http://localhost:3000`

## Cấu hình đăng nhập Google (Firebase)

1. Tạo project Firebase và bật **Google** trong `Authentication -> Sign-in method`.
2. Tạo app Web trong Firebase và lấy cấu hình.
3. Tạo file `.env.local` (hoặc cập nhật `.env`) theo mẫu `.env.example`:
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
```
4. Khởi động lại `npm start` sau khi thêm biến môi trường.

## Công nghệ sử dụng

- **React** - Thư viện JavaScript để xây dựng giao diện
- **React Leaflet** - Thư viện React cho Leaflet maps
- **Leaflet** - Thư viện JavaScript cho bản đồ tương tác
- **OpenStreetMap** - Dữ liệu bản đồ mở
- **Nominatim API** - API geocoding để tìm kiếm địa điểm
- **Overpass API** - API để lấy dữ liệu điểm quan tâm từ OpenStreetMap
- **OpenWeatherMap API** - Dữ liệu thời tiết thời gian thực
- **Axios** - HTTP client
- **Firebase Authentication** - Đăng nhập/đăng kí bằng Google

## Cách sử dụng

1. Nhập tên địa điểm bạn muốn tìm (ví dụ: Hà Nội, Sài Gòn, Đà Nẵng, Hội An, etc.)
2. Nhấn nút "Tìm kiếm" hoặc Enter
3. Bản đồ sẽ hiển thị vị trí và 5 điểm quan tâm xung quanh
4. Click vào marker để xem thông tin chi tiết
5. Gói thông tin thời tiết hiện tại nằm ở góc trên cùng bên phải của bản đồ

## Lưu ý

- Ứng dụng sử dụng các API công cộng miễn phí, vui lòng sử dụng có trách nhiệm
- Kết quả tìm kiếm phụ thuộc vào dữ liệu có sẵn trên OpenStreetMap
