// app/index.js
const express = require('express');
const app = express();
const port = 3000;

// Đọc "bí mật" từ biến môi trường.
// Đây là mấu chốt của Secret Management.
// Nếu biến môi trường MY_SECRET không được set, nó sẽ dùng một giá trị mặc định (không an toàn).
const MY_SECRET =
  process.env.MY_SECRET || 'Day la secret MAC DINH (Khong an toan!)';

app.get('/', (req, res) => {
  // Hiển thị secret ra trình duyệt
  res.send(`
    <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
      <h1>Demo Bảo mật Container</h1>
      <p>Ứng dụng này đang chạy bên trong một container.</p>
      <p>Nó được cấu hình để đọc một "secret" từ biến môi trường.</p>
      <hr>
      <p style="font-size: 1.2em;">
        Secret của bạn là: 
        <strong style="color: #d9534f; background-color: #f9f2f4; padding: 5px; border-radius: 4px;">
          ${MY_SECRET}
        </strong>
      </p>
    </div>
  `);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`Current secret is: ${MY_SECRET}`);
});
