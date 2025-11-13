Báo cáo Đề tài: Bảo mật container web (Docker/Kubernetes)

Demo Hardening Image và Secret Management

1. Giới thiệu ngắn gọn về đề tài

Dự án này là một bài demo thực hành cho môn Phát triển phần mềm web an toàn, tập trung vào hai khía cạnh quan trọng của bảo mật container:

Image Hardening (Hãng cứng Image): Minh họa sự khác biệt giữa một Dockerfile tiêu chuẩn (không an toàn) và một Dockerfile đã được "hãng cứng" (hardened) bằng cách áp dụng các best practice như multi-stage builds, sử dụng minimal base image, và chạy với non-root user.

Secret Management (Quản lý Bí mật): Trình diễn cách quản lý các thông tin nhạy cảm (như API key, mật khẩu database) một cách an toàn trong môi trường Docker và Kubernetes, tránh việc hardcode "bí mật" vào trong source code hoặc image.

2. Công nghệ sử dụng

Ngôn ngữ: JavaScript (Node.js)

Framework: Express.js

Containerization: Docker, Docker Compose

Orchestration: Kubernetes (demo qua Minikube)

Base Image: Node.js (Alpine)

3. Cấu trúc thư mục dự án

/
├── app/ # Thư mục chứa mã nguồn ứng dụng web
│ ├── index.js # File server Express chính
│ └── package.json # Quản lý các gói phụ thuộc Node.js
├── Dockerfile.vulnerable # (Demo) Dockerfile chưa được tối ưu, không an toàn
├── Dockerfile.hardened # (Demo) Dockerfile đã được hãng cứng, an toàn
├── docker-compose.yml # (Demo) File cấu hình Docker Compose để demo secret management
├── k8s-demo.yaml # (Demo) File manifest Kubernetes (Secret, Deployment, Service)
└── README.md # File hướng dẫn này

4. Hướng dẫn cài đặt & chạy chương trình

Yêu cầu môi trường

Node.js: v18.x hoặc mới hơn

Docker & Docker Compose: Phiên bản ổn định mới nhất

Kubernetes Cluster: Minikube (để demo local) hoặc bất kỳ cluster K8s nào.

Git: Để clone project.

Cài đặt

Clone repository này về máy (Bạn cần tạo một repo Git public và đẩy các file này lên):

git clone [Link-Git-public-cua-ban]
cd [ten-thu-muc-project]

(Không bắt buộc) Cài đặt phụ thuộc local cho thư mục app:

cd app
npm install
cd ..

Database

Đề tài này tập trung vào secret management chứ không phải vào hoạt động của database.

Ứng dụng demo sẽ đọc một biến môi trường tên là MY_SECRET (coi như đây là mật khẩu DB hoặc API Key) và hiển thị nó ra trình duyệt.

Do đó, không cần import database.

Demo 1: Image Hardening (So sánh Vulnerable vs. Hardened)

Mục tiêu là so sánh 2 images được build từ 2 Dockerfile.

Bước 1: Build 2 images

# 1. Build image không an toàn

docker build -t vulnerable-app -f Dockerfile.vulnerable .

# 2. Build image đã được hãng cứng

docker build -t hardened-app -f Dockerfile.hardened .

Bước 2: So sánh kết quả

Chạy lệnh docker images để so sánh kích thước:

docker images | grep "-app"

Kết quả (Minh họa):
Bạn sẽ thấy hardened-app (sử dụng multi-stage build và alpine) có kích thước nhỏ hơn đáng kể so với vulnerable-app (sử dụng image node:18 đầy đủ).

hardened-app cũng an toàn hơn vì nó chạy với non-root user (appuser), giảm thiểu bề mặt tấn công nếu container bị xâm nhập.

Demo 2: Secret Management (Docker Compose)

Mục tiêu là chạy app hardened-app và inject secret vào từ docker-compose.yml (thay vì hardcode).

Bước 1: Chạy Docker Compose

# Lệnh này sẽ build image (nếu chưa có) và khởi chạy container

docker-compose up

Bước 2: Kiểm tra kết quả

Truy cập http://localhost:3000 trên trình duyệt.

Bạn sẽ thấy dòng chữ: Secret của bạn là: Day la secret tu Docker Compose!

Điều này chứng tỏ secret đã được inject thành công từ docker-compose.yml vào môi trường của container.

Dọn dẹp:
Nhấn Ctrl + C và chạy docker-compose down.

Demo 3: Secret Management (Kubernetes)

Mục tiêu là deploy app lên K8s và inject secret từ một đối tượng Secret của K8s.

Bước 1: Khởi động Minikube
(Chỉ cần nếu bạn dùng Minikube)

minikube start

Bước 2: Build và tải image vào Minikube

Kubernetes (Minikube) cần phải "thấy" được image hardened-app của bạn.

# Trỏ Docker CLI của bạn vào Docker daemon bên trong Minikube

eval $(minikube docker-env)

# Build lại image 'hardened-app' (bây giờ image này sẽ nằm trong Minikube)

docker build -t hardened-app -f Dockerfile.hardened .

# (Tùy chọn) Kiểm tra xem image đã có trong Minikube chưa

docker images | grep "hardened-app"

Bước 3: Deploy ứng dụng lên Kubernetes

File k8s-demo.yaml đã định nghĩa sẵn 3 thứ:

kind: Secret: Tạo một secret K8s tên my-app-secret (đã được mã hóa base64).

kind: Deployment: Deploy ứng dụng, lấy image hardened-app và inject secret từ my-app-secret vào biến môi trường MY_SECRET.

kind: Service: Mở port 30080 (NodePort) để truy cập ứng dụng.

# Áp dụng file manifest

kubectl apply -f k8s-demo.yaml

Bước 4: Kiểm tra kết quả

Chờ pod khởi động (khoảng 30 giây):

kubectl get pods

Lấy URL để truy cập service:

minikube service my-app-service

Lệnh trên sẽ tự động mở trình duyệt.

Bạn sẽ thấy dòng chữ: Secret của bạn là: Day la secret tu Kubernetes!

Điều này chứng tỏ app đã đọc thành công secret từ đối tượng Secret của K8s.

Dọn dẹp (Rất quan trọng):

# Xóa service, deployment, và secret

kubectl delete -f k8s-demo.yaml

# Tắt Minikube

minikube stop

# Trả Docker CLI về máy host

eval $(minikube docker-env -u)

5. Tài khoản demo để đăng nhập

Ứng dụng demo này không có chức năng đăng nhập/xác thực.

Mục tiêu của ứng dụng chỉ là hiển thị "secret" mà nó nhận được từ môi trường (environment).

6. Kết quả và hình ảnh minh họa

(Bạn hãy chụp ảnh màn hình các bước demo và dán vào đây)

1. Hình ảnh so sánh kích thước image (Demo 1)
   [Dán ảnh chụp terminal lệnh docker images của bạn vào đây]

2. Hình ảnh kết quả chạy Docker Compose (Demo 2)
   [Dán ảnh chụp trình duyệt http://localhost:3000 hiển thị secret của Compose vào đây]

3. Hình ảnh kết quả chạy Kubernetes (Demo 3)
   [Dán ảnh chụp trình duyệt hiển thị secret của Kubernetes (từ Minikube) vào đây]
