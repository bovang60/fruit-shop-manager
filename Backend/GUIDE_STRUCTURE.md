# Hướng dẫn cấu trúc Project Fruit Shop Manager (Backend)

Tài liệu này hướng dẫn cách tổ chức thư mục và các quy tắc viết code để đảm bảo tính đồng nhất giữa các thành viên trong nhóm.

## 📂 Cấu trúc thư mục (src/main)

Cấu trúc dự án tuân theo mô hình **Layered Architecture** (Kiến trúc phân lớp):

```text
src/main/java/com/fruitshop/backend/
├── config/             # Cấu hình hệ thống (CORS, Security, Swagger,...)
├── controller/         # Tiếp nhận request HTTP, điều hướng luồng dữ liệu
├── dto/                # Data Transfer Object (Dữ liệu trả về cho client hoặc nhận vào)
├── model/              # Entity (Đại diện cho các bảng trong Database) và Enum
├── repository/         # Tương tác trực tiếp với Database (Spring Data JPA)
├── service/            # Chứa Interface định nghĩa các nghiệp vụ (Business Logic)
│   └── impl/          # Triển khai chi tiết các logic của Service
└── FruitShopApplication.java  # File chạy chính của dự án
```

## 🛠 Quy tắc lập trình đồng nhất

### 1. Dependency Injection (Tiêm phụ thuộc)
KHÔNG dùng `@Autowired` trực tiếp trên thuộc tính. Hãy dùng **Constructor Injection** kết hợp với **Lombok**.

**Cách viết chuẩn:**
```java
@RestController
@RequiredArgsConstructor // Tự động tạo constructor luận cho các biến final
public class CategoryController {
    private final CategoryService categoryService; // Biến phải có final
}
```

### 2. Service Layer Pattern
Mỗi Service nên có một **Interface** và một lớp **Implementation**.
- Interface đặt trực tiếp trong package `service`.
- Class thực thi đặt trong package `service.impl` và có hậu tố `Impl`.

### 3. Model & Enums
- Các Entity phải có các annotation của JPA (`@Entity`, `@Table`, `@Id`,...).
- Dùng Lombok (`@Data`, `@NoArgsConstructor`,...) để giảm thiểu code thừa.
- Nếu dùng Enum, hãy viết thêm một **Converter** bên trong hoặc dùng `@Enumerated(EnumType.STRING)` để lưu xuống DB chính xác.

### 4. Controller & CORS
- Luôn có `@RestController` và `@RequestMapping("/api/...")`.
- Để Frontend gọi được API, thêm `@CrossOrigin("*")` (trong môi trường Dev).

---

## 🚀 Cách tạo file mới tương đồng
Khi muốn tạo một chức năng mới (Ví dụ: `Product`):
1. **Model**: Tạo `Product.java` trong `model/`.
2. **Repository**: Tạo `ProductRepository.java` (Interface) kế thừa `JpaRepository`.
3. **DTO**: Tạo `ProductDto.java` để quy định dữ liệu trả về.
4. **Service**:
    - Tạo `ProductService.java` (Interface) trong `service/`.
    - Tạo `ProductServiceImpl.java` trong `service/impl/`.
5. **Controller**: Tạo `ProductController.java` để expose API.

## 📦 Dependencies cần thiết (Maven)
Đảm bảo file `pom.xml` có ít nhất các thư viện sau:
- Spring Boot Starter Data JPA
- Spring Boot Starter Web
- Lombok
- MS SQL Server Driver (hoặc DB tương ứng)
- Validation Starter
