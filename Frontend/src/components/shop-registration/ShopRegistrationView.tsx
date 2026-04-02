import React from "react";
import "./ShopRegistration.css";
import type { ShippingMethodDto } from "../../services/shippingMethodService";
import Header from "../common/header/Header";

export interface RegistrationStep {
  id: number;
  label: string;
}

export interface ShopRegistrationData {
  shopName: string;
  shopDescription: string;
  pickupAddress: string;
  email: string;
  phone: string;
  selectedShippingMethods: number[];
  businessType: "personal" | "household" | "company";
  companyName: string;
  businessAddress: string;
  taxCode: string;
}

interface Props {
  currentStep: number;
  steps: RegistrationStep[];
  formData: ShopRegistrationData;
  shippingMethods: ShippingMethodDto[];
  isLoadingShipping: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onShippingMethodToggle: (methodId: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onBackToHome: () => void;
  isVerifying?: boolean;
  isSubmitting?: boolean;
  taxStatus?: "" | "checking" | "INVALID" | "VALID" | "taken";
  taxErrorMessage?: string;
  shopNameStatus?: "" | "checking" | "taken" | "available";
  shopNameErrorMessage?: string;
  rejectReason?: string | null;
}

const ShopRegistrationView: React.FC<Props> = ({
  currentStep,
  steps,
  formData,
  shippingMethods,
  isLoadingShipping,
  onInputChange,
  onShippingMethodToggle,
  onNext,
  onPrev,
  onBackToHome,
  isVerifying = false,
  isSubmitting = false,
  taxStatus = "",
  taxErrorMessage = "",
  shopNameStatus = "",
  shopNameErrorMessage = "",
  rejectReason = null,
}) => {
  return (
    <div className="shop-registration-container">
      <header className="profile-header">
        <Header />
      </header>
      {/* Header */}
      {/* <header className="login-header">
                <Header />
            </header> */}
      {/* <header className="registration-header">
                <div className="header-brand">
                    <div className="brand" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#212b36' }}>
                        Trái cây tươi
                    </div>
                    <div className="header-title">Đăng ký trở thành Người bán</div>
                </div>
            </header> */}

      {/* Stepper */}
      <div className="registration-stepper">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <div
              key={step.id}
              className={`step-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
            >
              <div className="step-dot"></div>
              <div className="step-label">{step.label}</div>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <div className="step-connector-fill"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <main className="registration-form-card">
        <div className="form-card-header">
          {currentStep > 1 && (
            <button
              className="btn-back-step-icon"
              onClick={onPrev}
              title="Quay lại bước trước"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
          <h2 className="form-title" style={{ margin: 0, flex: 1 }}>
            {steps.find((s) => s.id === currentStep)?.label || "Thông tin Shop"}
          </h2>
        </div>

        <div className="registration-form-body">
          {rejectReason && (
            <div
              className="alert-error-box"
              style={{
                background: "#fff5f5",
                border: "1px solid #ffcdd2",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "24px",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#e53935" }}
              >
                cancel
              </span>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    color: "#e53935",
                    marginBottom: "4px",
                  }}
                >
                  Đơn đăng ký trước đó bị từ chối
                </div>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>
                  Lý do: {rejectReason}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "#888",
                    marginTop: "8px",
                  }}
                >
                  Vui lòng chỉnh sửa và gửi lại thông tin chính xác.
                </div>
              </div>
            </div>
          )}
          {currentStep === 1 && (
            <>
              {/* Shop Name */}
              <div className="form-group">
                <label className="form-label required">Tên Shop</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    name="shopName"
                    className={`form-input ${shopNameStatus === "taken" ? "error" : ""}`}
                    placeholder="Ví dụ: Trái cây tươi Bốn Mùa"
                    maxLength={30}
                    value={formData.shopName}
                    onChange={onInputChange}
                  />
                  <span className="input-counter">
                    {(formData.shopName || "").length}/30
                  </span>
                  {shopNameStatus === "checking" && (
                    <div className="input-helper" style={{ color: "#888" }}>
                      ⏳ Đang kiểm tra tên shop...
                    </div>
                  )}
                  {shopNameStatus === "taken" && (
                    <div className="input-helper" style={{ color: "#e53935" }}>
                      ⚠️{" "}
                      {shopNameErrorMessage ||
                        "Tên cửa hàng đã tồn tại. Vui lòng chọn tên khác."}
                    </div>
                  )}
                  {shopNameStatus === "available" && (
                    <div className="input-helper" style={{ color: "#2e7d32" }}>
                      ✅ Tên cửa hàng hợp lệ.
                    </div>
                  )}
                </div>
              </div>

              {/* Shop Description */}
              <div className="form-group">
                <label className="form-label required">Mô tả Shop</label>
                <div className="form-input-container">
                  <textarea
                    name="shopDescription"
                    className="form-input"
                    placeholder="Giới thiệu về cửa hàng của bạn"
                    maxLength={500}
                    value={formData.shopDescription}
                    onChange={onInputChange as any}
                    rows={4}
                    style={{ resize: "vertical", fontFamily: "inherit" }}
                  />
                  <span style={{ top: "80%" }} className="input-counter">
                    {(formData.shopDescription || "").length}/500
                  </span>
                </div>
              </div>

              {/* Pickup Address */}
              <div className="form-group">
                <label className="form-label required">Địa chỉ lấy hàng</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    name="pickupAddress"
                    className="form-input"
                    placeholder="Nhập địa chỉ lấy hàng"
                    value={formData.pickupAddress}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label required">Email</label>
                <div className="form-input-container">
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label required">Số điện thoại</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="shipping-settings">
                <h3 className="section-title">Phương thức vận chuyển</h3>
                <p className="section-subtitle">
                  Kích hoạt phương thức vận chuyển phù hợp
                </p>

                <div className="shipping-methods-container">
                  {isLoadingShipping ? (
                    <p
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      Đang tải phương thức vận chuyển...
                    </p>
                  ) : shippingMethods.length === 0 ? (
                    <p
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "#666",
                      }}
                    >
                      Không có phương thức vận chuyển nào.
                    </p>
                  ) : (
                    shippingMethods.map((method) => (
                      <div
                        key={method.methodId}
                        className="shipping-method-item"
                      >
                        <div className="shipping-method-header">
                          <span className="method-name">
                            {method.methodName}
                          </span>
                          <div className="method-actions">
                            <span className="btn-collapse">
                              Thu gọn{" "}
                              <span className="material-symbols-outlined">
                                expand_less
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="method-details">
                          <div
                            className="method-info"
                            style={{ flexDirection: "column" }}
                          >
                            <div>{method.description}</div>
                            <div
                              style={{
                                marginTop: "4px",
                                color: "#666",
                                fontSize: "0.9rem",
                              }}
                            >
                              Phí cố định:{" "}
                              {method.fixedFee.toLocaleString("vi-VN")}đ
                            </div>
                            {!method.isAvailable && (
                              <div
                                className="cod-status"
                                style={{ color: "red", marginTop: "4px" }}
                              >
                                [Ngừng hỗ trợ]
                              </div>
                            )}
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={
                                formData.selectedShippingMethods?.includes(
                                  method.methodId,
                                ) || false
                              }
                              onChange={() =>
                                onShippingMethodToggle(method.methodId)
                              }
                              disabled={!method.isAvailable}
                            />
                            <span className="slider round"></span>
                          </label>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="alert-info-box">
                <span className="material-symbols-outlined">info</span>
                <div>
                  Việc thu thập Thông Tin Thuế và Thông Tin Định Danh là bắt
                  buộc theo quy định của Luật an ninh mạng, Thương mại điện tử
                  và Thuế của Việt Nam. Thông Tin Thuế và Thông Tin Định Danh sẽ
                  được bảo vệ theo chính sách bảo mật. Người bán hoàn toàn chịu
                  trách nhiệm về tính chính xác của thông tin.
                </div>
              </div>

              {/* 1. Loại hình kinh doanh */}
              <div className="form-group">
                <label className="form-label required">
                  Loại hình kinh doanh
                </label>
                <div className="form-input-container radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="businessType"
                      value="personal"
                      className="radio-input"
                      checked={formData.businessType === "personal"}
                      onChange={onInputChange}
                    />
                    Cá nhân
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="businessType"
                      value="household"
                      className="radio-input"
                      checked={formData.businessType === "household"}
                      onChange={onInputChange}
                    />
                    Hộ kinh doanh
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="businessType"
                      value="company"
                      className="radio-input"
                      checked={formData.businessType === "company"}
                      onChange={onInputChange}
                    />
                    Công ty
                  </label>
                </div>
              </div>

              {/* 2. Mã số thuế */}
              <div className="form-group">
                <label className="form-label required">Mã số thuế</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    name="taxCode"
                    className="form-input"
                    placeholder="Nhập vào"
                    maxLength={14}
                    value={formData.taxCode}
                    onChange={onInputChange}
                  />
                  <div className="input-helper">
                    Theo Quy định về Thương mại điện tử Việt Nam (Nghị định
                    52/2013/NĐ-CP), Người Bán phải cung cấp thông tin Mã số thuế
                    cho Sàn Thương mại điện tử.
                  </div>
                  <span style={{ top: "20px" }} className="input-counter">
                    {(formData.taxCode || "").length}/14
                  </span>
                  {/* Trạng thái xác thực MST — đặt trong container để khớp grid */}
                  {isVerifying && (
                    <div
                      className="input-helper"
                      style={{ color: "#888", marginTop: "6px" }}
                    >
                      ⏳ Đang tra cứu thông tin thuế...
                    </div>
                  )}
                  {!isVerifying && taxStatus === "INVALID" && (
                    <div
                      className="input-helper"
                      style={{ color: "#e53935", marginTop: "6px" }}
                    >
                      ⚠️ Mã số thuế thuộc Người nộp thuế đã ngừng hoạt động (NNT
                      ngừng HĐ). Không thể tiếp tục.
                    </div>
                  )}
                  {!isVerifying && taxStatus === "taken" && (
                    <div
                      className="input-helper"
                      style={{ color: "#e53935", marginTop: "6px" }}
                    >
                      ⚠️{" "}
                      {taxErrorMessage ||
                        "Mã số thuế này đã được đăng ký cho một cửa hàng khác. Vui lòng kiểm tra lại."}
                    </div>
                  )}
                  {!isVerifying &&
                    taxStatus === "VALID" &&
                    formData.businessType !== "personal" && (
                      <div
                        className="input-helper"
                        style={{ color: "#2e7d32", marginTop: "6px" }}
                      >
                        ✅ Đã xác thực mã số thuế thành công.
                      </div>
                    )}
                </div>
              </div>

              {/* 3. Tên công ty — luôn hiện khi không phải cá nhân */}
              {formData.businessType !== "personal" && (
                <div className="form-group">
                  <label className="form-label required">Tên công ty</label>
                  <div className="form-input-container">
                    <input
                      type="text"
                      name="companyName"
                      className="form-input"
                      placeholder="Nhập vào"
                      maxLength={500}
                      value={formData.companyName}
                      onChange={onInputChange}
                    />
                    <span style={{ top: "20px" }} className="input-counter">
                      {(formData.companyName || "").length}/500
                    </span>
                    <div className="input-helper">
                      Vui lòng điền đầy đủ tên công ty, không viết tắt. Ví dụ:
                      &quot;Công ty Trách Nhiệm Hữu Hạn ABC&quot;
                    </div>
                    {taxStatus === "VALID" && !formData.companyName && (
                      <div
                        className="input-helper"
                        style={{ color: "#e53935", marginTop: "4px" }}
                      >
                        ❌ Tên trên hồ sơ thuế không khớp với loại hình &ldquo;
                        {formData.businessType === "household"
                          ? "Hộ kinh doanh"
                          : "Công ty"}
                        &rdquo;. Vui lòng kiểm tra lại hoặc nhập thủ công.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Địa chỉ đăng ký kinh doanh — luôn hiện */}
              <div className="form-group">
                <label className="form-label required">
                  Địa chỉ đăng ký kinh doanh
                </label>
                <div className="form-input-container">
                  <input
                    type="text"
                    name="businessAddress"
                    className="form-input"
                    placeholder="Tổ 6, ấp Mũi dừa, Phường Tô Châu, An Giang"
                    value={formData.businessAddress}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </>
          )}

          {[4].includes(currentStep) && (
            <div style={{ padding: "8px 0" }}>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "48px",
                    color: "#4caf50",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  check_circle
                </span>
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    color: "#212b36",
                  }}
                >
                  Xác nhận thông tin đăng ký
                </p>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  Vui lòng kiểm tra lại thông tin trước khi gửi.
                </p>
              </div>
              <div
                style={{
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "0.9rem",
                }}
              >
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: "#888", minWidth: "160px" }}>
                    Tên cửa hàng:
                  </span>
                  <span style={{ fontWeight: 600 }}>{formData.shopName}</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: "#888", minWidth: "160px" }}>
                    Email liên hệ:
                  </span>
                  <span>{formData.email}</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: "#888", minWidth: "160px" }}>
                    Số điện thoại:
                  </span>
                  <span>{formData.phone}</span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: "#888", minWidth: "160px" }}>
                    Phương thức vận chuyển:
                  </span>
                  <span>
                    {formData.selectedShippingMethods.length} phương thức đã
                    chọn
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: "#888", minWidth: "160px" }}>
                    Loại hình KD:
                  </span>
                  <span>
                    {formData.businessType === "personal"
                      ? "Cá nhân"
                      : formData.businessType === "household"
                        ? "Hộ kinh doanh"
                        : "Công ty"}
                  </span>
                </div>
                {formData.taxCode && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <span style={{ color: "#888", minWidth: "160px" }}>
                      Mã số thuế:
                    </span>
                    <span>{formData.taxCode}</span>
                  </div>
                )}
              </div>
              <p
                style={{
                  marginTop: "16px",
                  fontSize: "0.82rem",
                  color: "#888",
                  textAlign: "center",
                }}
              >
                Sau khi gửi, đơn đăng ký sẽ ở trạng thái{" "}
                <strong>Chờ duyệt</strong> và sẽ được xét duyệt trong vòng 1–3
                ngày làm việc.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="form-footer-actions">
          <button className="btn-back-to-home" onClick={onBackToHome}>
            Quay về trang chủ
          </button>
          <button
            className="btn-next-step"
            onClick={onNext}
            disabled={
              isVerifying ||
              isSubmitting ||
              (currentStep === 1 &&
                (!formData.shopName ||
                  !formData.shopDescription ||
                  !formData.pickupAddress ||
                  !formData.email ||
                  !formData.phone ||
                  shopNameStatus === "checking" ||
                  shopNameStatus === "taken")) ||
              (currentStep === 2 &&
                (!formData.selectedShippingMethods ||
                  formData.selectedShippingMethods.length === 0)) ||
              (currentStep === 3 &&
                (!formData.taxCode ||
                  taxStatus === "INVALID" ||
                  taxStatus === "taken" ||
                  !formData.businessAddress ||
                  (formData.businessType !== "personal" &&
                    !formData.companyName)))
            }
          >
            {isSubmitting
              ? "Đang gửi..."
              : isVerifying
                ? "Đang xác thực..."
                : currentStep === steps.length
                  ? "Gửi hồ sơ"
                  : "Tiếp theo"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ShopRegistrationView;
