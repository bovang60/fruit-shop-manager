import { useEffect, useState } from "react";
import { usePopup } from "../common/popup";
import LoadingModal from "../common/loading/LoadingModal";
import {
  getShopById,
  checkShopStatus,
  updateSellerShop,
  type ShopDto,
  type UpdateSellerShopRequest,
} from "../../services/shopService";
import { getUserFromStorage } from "../../services/authService";
import "./SellerShopManagement.css";

type Props = {
  shopId: number;
};

type ShopForm = {
  shopName: string;
  description: string;
  address: string;
  taxCode: string;
  shopType: string;
  businessName: string;
  businessAddress: string;
  pickupAddress: string;
};

const emptyForm: ShopForm = {
  shopName: "",
  description: "",
  address: "",
  taxCode: "",
  shopType: "",
  businessName: "",
  businessAddress: "",
  pickupAddress: "",
};

export default function SellerShopManagement({ shopId }: Props) {
  const { showError, showSuccess } = usePopup();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ShopForm>(emptyForm);
  const [original, setOriginal] = useState<ShopForm>(emptyForm);
  const [status, setStatus] = useState<ShopDto["status"] | null>(null);

  useEffect(() => {
    async function loadShop() {
      let resolvedShopId = shopId;
      if (!resolvedShopId) {
        const currentUser = getUserFromStorage();
        if (currentUser?.userId) {
          const statusRes = await checkShopStatus(currentUser.userId);
          if (statusRes.resultCd === 0 && statusRes.data?.shopId) {
            resolvedShopId = statusRes.data.shopId;
          }
        }
      }

      if (!resolvedShopId) {
        setLoading(false);
        showError("Không tìm thấy cửa hàng của bạn", "Lỗi");
        return;
      }

      setLoading(true);
      try {
        const response = await getShopById(resolvedShopId);
        if (response.resultCd === 0 && response.data) {
          const mapped: ShopForm = {
            shopName: response.data.shopName || "",
            description: response.data.description || "",
            address: response.data.address || "",
            taxCode: response.data.taxCode || "",
            shopType: response.data.shopType || "",
            businessName: response.data.businessName || "",
            businessAddress: response.data.businessAddress || "",
            pickupAddress: response.data.pickupAddress || "",
          };
          setForm(mapped);
          setOriginal(mapped);
          setStatus(response.data.status || null);
        } else {
          showError(response.message || "Không thể tải thông tin cửa hàng", "Lỗi");
        }
      } catch (error) {
        showError("Không thể kết nối để tải thông tin cửa hàng", "Lỗi");
      } finally {
        setLoading(false);
      }
    }

    void loadShop();
  }, [shopId, showError]);

  const hasChanges = JSON.stringify(form) !== JSON.stringify(original);

  const updateField = (field: keyof ShopForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    let resolvedShopId = shopId;
    if (!resolvedShopId) {
      const currentUser = getUserFromStorage();
      if (currentUser?.userId) {
        const statusRes = await checkShopStatus(currentUser.userId);
        if (statusRes.resultCd === 0 && statusRes.data?.shopId) {
          resolvedShopId = statusRes.data.shopId;
        }
      }
    }
    if (!resolvedShopId) {
      showError("Không tìm thấy cửa hàng để cập nhật", "Lỗi");
      return;
    }
    if (!form.shopName.trim()) {
      showError("Tên cửa hàng không được để trống", "Lỗi");
      return;
    }
    if (!form.address.trim()) {
      showError("Địa chỉ cửa hàng không được để trống", "Lỗi");
      return;
    }

    const payload: UpdateSellerShopRequest = {
      shopName: form.shopName.trim(),
      description: form.description.trim() || undefined,
      address: form.address.trim(),
      shopType: form.shopType.trim() || undefined,
      businessName: form.businessName.trim() || undefined,
      businessAddress: form.businessAddress.trim() || undefined,
      pickupAddress: form.pickupAddress.trim() || undefined,
    };

    setSaving(true);
    try {
      const response = await updateSellerShop(resolvedShopId, payload);
      if (response.resultCd === 0 && response.data) {
        const mapped: ShopForm = {
          shopName: response.data.shopName || "",
          description: response.data.description || "",
          address: response.data.address || "",
          taxCode: response.data.taxCode || "",
          shopType: response.data.shopType || "",
          businessName: response.data.businessName || "",
          businessAddress: response.data.businessAddress || "",
          pickupAddress: response.data.pickupAddress || "",
        };
        setForm(mapped);
        setOriginal(mapped);
        setStatus(response.data.status || null);
        showSuccess("Cập nhật thông tin cửa hàng thành công", "Thành công");
      } else {
        showError(response.message || "Không thể cập nhật cửa hàng", "Lỗi");
      }
    } catch (error) {
      showError("Không thể kết nối để cập nhật cửa hàng", "Lỗi");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(original);
  };

  return (
    <>
      <div className="seller-page seller-shop-page">
        <div className="page-header-content">
          <h1>Quản lý cửa hàng</h1>
          <p>Cập nhật thông tin cửa hàng của bạn. Mã số thuế được khóa, không thể chỉnh sửa.</p>
        </div>

        <section className="data-card seller-shop-card">
          <h3 className="seller-shop-section-title">Thông tin ban đầu</h3>
          <div className="seller-shop-initial-grid">
            <div><span className="seller-detail-label">Tên cửa hàng</span><p>{original.shopName || "N/A"}</p></div>
            <div><span className="seller-detail-label">Trạng thái</span><p>{status || "N/A"}</p></div>
            <div><span className="seller-detail-label">Mã số thuế</span><p>{original.taxCode || "N/A"}</p></div>
            <div><span className="seller-detail-label">Địa chỉ cửa hàng</span><p>{original.address || "N/A"}</p></div>
            <div><span className="seller-detail-label">Loại hình</span><p>{original.shopType || "N/A"}</p></div>
            <div className="seller-shop-initial-full"><span className="seller-detail-label">Tên cơ sở kinh doanh</span><p>{original.businessName || "N/A"}</p></div>
            <div className="seller-shop-initial-full"><span className="seller-detail-label">Địa chỉ kinh doanh</span><p>{original.businessAddress || "N/A"}</p></div>
            <div className="seller-shop-initial-full"><span className="seller-detail-label">Địa chỉ lấy hàng</span><p>{original.pickupAddress || "N/A"}</p></div>
            <div className="seller-shop-initial-full"><span className="seller-detail-label">Mô tả</span><p>{original.description || "N/A"}</p></div>
          </div>
        </section>

        <section className="data-card seller-shop-card">
          <h3 className="seller-shop-section-title">Cập nhật thông tin cửa hàng</h3>
          <div className="seller-shop-status-row">
            <span className="seller-detail-label">Trạng thái cửa hàng</span>
            <span className={`seller-status-chip ${status === "APPROVED" ? "is-active" : status === "SUSPENDED" ? "is-discontinued" : "is-pending"}`}>
              {status === "APPROVED"
                ? "Đang hoạt động"
                : status === "SUSPENDED"
                  ? "Đang bị đình chỉ"
                  : status === "REJECTED"
                    ? "Bị từ chối"
                    : "Chờ duyệt"}
            </span>
          </div>

          <div className="seller-form-grid">
            <div className="seller-field">
              <label>Tên cửa hàng</label>
              <input
                type="text"
                value={form.shopName}
                onChange={(e) => updateField("shopName", e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="seller-field">
              <label>Mã số thuế</label>
              <input type="text" value={form.taxCode} disabled />
            </div>

            <div className="seller-field">
              <label>Địa chỉ cửa hàng</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="seller-field">
              <label>Loại hình</label>
              <input
                type="text"
                value={form.shopType}
                onChange={(e) => updateField("shopType", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="seller-field seller-field-full">
              <label>Tên cơ sở kinh doanh</label>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => updateField("businessName", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="seller-field seller-field-full">
              <label>Địa chỉ kinh doanh</label>
              <input
                type="text"
                value={form.businessAddress}
                onChange={(e) => updateField("businessAddress", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="seller-field seller-field-full">
              <label>Địa chỉ lấy hàng</label>
              <input
                type="text"
                value={form.pickupAddress}
                onChange={(e) => updateField("pickupAddress", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="seller-field seller-field-full">
              <label>Mô tả</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          <div className="seller-form-actions">
            <button
              type="button"
              className="seller-ghost-btn"
              disabled={!hasChanges || saving}
              onClick={handleReset}
            >
              Hoàn tác
            </button>
            <button
              type="button"
              className="btn-primary-admin"
              disabled={!hasChanges || saving}
              onClick={handleSave}
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </section>
      </div>
      <LoadingModal
        isOpen={loading}
        message="Đang tải thông tin cửa hàng..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </>
  );
}
