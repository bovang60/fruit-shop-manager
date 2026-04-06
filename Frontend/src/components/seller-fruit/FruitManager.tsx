import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../common/popup";
import {
  deleteSellerFruit,
  createSellerFruit,
  getSellerFruitDisplayMessage,
  getSellerFruitsByShop,
  uploadSellerFruitImage,
  updateSellerFruit,
  updateSellerFruitStatus,
  type SellerProductDto,
} from "../../services/sellerFruitService";
import {
  getCategoryFilterList,
  type CategoryFilterItemDto,
} from "../../services/categoryService";
import FruitManagerView from "./FruitManagerView";

type EditFormState = {
  name: string;
  description: string;
  categoryId: string;
  price: string;
  stock: string;
  imageUrl: string;
};

const PRODUCT_NAME_REGEX = /^[\p{L}\p{M}\d\s\-().,/&]+$/u;

const normalizeProductName = (value: string): string =>
  value.normalize("NFC").replace(/\s+/g, " ").trim();

const parsePrice = (priceValue: string): number | null => {
  if (!priceValue) {
    return null;
  }

  if (!/^-?\d+(\.\d+)?$/.test(priceValue)) {
    return null;
  }

  const price = Number(priceValue);
  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  return price;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const validateImageFile = (file: File | null): string | null => {
  if (!file) return null;
  if (!file.type.startsWith("image/")) {
    return "Vui lòng chọn file ảnh hợp lệ (PNG/JPG/GIF/WEBP)";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Kích thước ảnh không được vượt quá 5MB";
  }
  return null;
};

const FruitManager = ({ shopId }: { shopId: number }) => {
  const navigate = useNavigate();
  const [fruits, setFruits] = useState<SellerProductDto[]>([]);
  const [categories, setCategories] = useState<CategoryFilterItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFruitId, setEditingFruitId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    description: "",
    categoryId: "",
    price: "",
    stock: "",
    imageUrl: "",
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const { showConfirm, showError, showNotice } = usePopup();

  const loadFruits = async () => {
    setIsLoading(true);
    try {
      const result = await getSellerFruitsByShop(shopId);
      if (result.resultCd === 0 && result.data) {
        setFruits(result.data);
      } else {
        showError(
          getSellerFruitDisplayMessage(
            result.message || "Không thể tải danh sách sản phẩm",
          ),
          "Lỗi",
        );
      }
    } catch (error) {
      console.error("Failed to load fruits:", error);
      showError("Không thể kết nối đến hệ thống. Vui lòng thử lại.", "Lỗi");
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  useEffect(() => {
    if (shopId) {
      void loadFruits();
    }
  }, [shopId]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategoryFilterList();
        if (result.resultCd === 0 && result.data) {
          setCategories(result.data);
        } else {
          showError(result.message || "Không thể tải danh mục", "Lỗi");
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
        showError("Không thể tải danh mục sản phẩm.", "Lỗi");
      }
    };

    void loadCategories();
  }, []);

  const startEdit = (fruit: SellerProductDto) => {
    setEditingFruitId(fruit.productId);
    setEditForm({
      name: fruit.name ?? "",
      description: fruit.description ?? "",
      categoryId: fruit.categoryId ? String(fruit.categoryId) : "",
      price: fruit.price !== undefined ? String(fruit.price) : "",
      stock: fruit.stock !== undefined ? String(fruit.stock) : "",
      imageUrl: fruit.imageUrl ?? "",
    });
    setEditImageFile(null);
  };

  const cancelEdit = () => {
    setEditingFruitId(null);
    setEditForm({
      name: "",
      description: "",
      categoryId: "",
      price: "",
      stock: "",
      imageUrl: "",
    });
    setEditImageFile(null);
  };

  const updateEditField = (field: keyof EditFormState, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (fruitId: number) => {
    const name = normalizeProductName(editForm.name);
    const description = editForm.description.trim();
    const categoryId = Number(editForm.categoryId);
    const priceValue = editForm.price.trim();
    const stockValue = editForm.stock.trim();
    const price = parsePrice(priceValue);
    const stock = Number(stockValue);
    const isDuplicate = fruits.some(
        (f) => f.name?.toLowerCase() === name.toLowerCase() && f.productId !== fruitId
    );
    if (!name) {
      showError("Vui lòng nhập tên sản phẩm", "Lỗi");
      return;
    }

    if (isDuplicate) {
      showError("Tên sản phẩm này đã tồn tại trong cửa hàng", "Lỗi");
      return;
    }
    if (!priceValue) {
      showError("Vui lòng nhập giá", "Lỗi");
      return;
    }
    if (price === null) {
      showError("Giá sản phẩm phải là số", "Lỗi");
      return;
    }
    if (price <= 0) {
      showError("Giá sản phẩm phải lớn hơn 0", "Lỗi");
      return;
    }
    if (!stockValue) {
      showError("Vui lòng nhập tồn kho", "Lỗi");
      return;
    }
    if (!stockValue || Number.isNaN(stock)) {
      showError("Tồn kho phải là số", "Lỗi");
      return;
    }
    if (stock < 0) {
      showError("Tồn kho phải lớn hơn hoặc bằng 0", "Lỗi");
      return;
    }
    if (!PRODUCT_NAME_REGEX.test(name)) {
      showError(
        "Tên sản phẩm chỉ được chứa chữ tiếng Việt, số, khoảng trắng và các ký tự - ( ) . , / &",
        "Lỗi",
      );
      return;
    }
    if (!editForm.categoryId || Number.isNaN(categoryId) || categoryId <= 0) {
      showError("Vui lòng chọn danh mục sản phẩm", "Lỗi");
      return;
    }

    try {
      const imageValidationMessage = validateImageFile(editImageFile);
      if (imageValidationMessage) {
        showError(imageValidationMessage, "Lỗi");
        return;
      }

      const updatePayload: Parameters<typeof updateSellerFruit>[1] = {
        name,
        description: description || undefined,
        category: { categoryId },
        price,
        stock,
      };

      if (!editImageFile) {
        updatePayload.imageUrl = editForm.imageUrl?.trim() || undefined;
      }

      const result = await updateSellerFruit(fruitId, updatePayload);
      if (result.resultCd === 0) {
        if (editImageFile) {
          const uploadResult = await uploadSellerFruitImage(fruitId, editImageFile);
          if (uploadResult.resultCd !== 0) {
            showError(
              getSellerFruitDisplayMessage(
                uploadResult.message || "Không thể tải ảnh sản phẩm lên",
              ),
              "Lỗi",
            );
            return;
          }
        }

        showNotice("Cập nhật sản phẩm thành công", "Thành công");
        cancelEdit();
        await loadFruits();
      } else {
        showError(
          getSellerFruitDisplayMessage(
            result.message || "Không thể cập nhật sản phẩm",
          ),
          "Lỗi",
        );
      }
    } catch (error) {
      console.error("Failed to update fruit:", error);
      showError("Không thể cập nhật sản phẩm lúc này.", "Lỗi");
    }
  };

  const handleCreateFruit = async (data: {
    name: string;
    description: string;
    categoryId: string;
    price: string;
    stock: string;
    imageFile?: File | null;
  }): Promise<boolean> => {
    const name = normalizeProductName(data.name);
    const description = data.description.trim();
    const categoryId = Number(data.categoryId);
    const priceValue = data.price.trim();
    const stockValue = data.stock.trim();
    const price = parsePrice(priceValue);
    const stock = Number(stockValue);
    const isDuplicate = fruits.some(
        (f) => f.name?.toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      showError("Tên sản phẩm này đã tồn tại trong danh sách của bạn", "Lỗi");
      return false;
    }
    if (!name) {
      showError("Vui lòng nhập tên sản phẩm", "Lỗi");
      return false;
    }
    if (!priceValue) {
      showError("Vui lòng nhập giá", "Lỗi");
      return false;
    }
    if (price === null) {
      showError("Giá sản phẩm phải là số", "Lỗi");
      return false;
    }
    if (price <= 0) {
      showError("Giá sản phẩm phải lớn hơn 0", "Lỗi");
      return false;
    }
    if (!stockValue) {
      showError("Vui lòng nhập tồn kho", "Lỗi");
      return false;
    }
    if (!stockValue || Number.isNaN(stock)) {
      showError("Tồn kho phải là số", "Lỗi");
      return false;
    }
    if (stock < 0) {
      showError("Tồn kho phải lớn hơn hoặc bằng 0", "Lỗi");
      return false;
    }
    if (!PRODUCT_NAME_REGEX.test(name)) {
      showError(
        "Tên sản phẩm chỉ được chứa chữ tiếng Việt, số, khoảng trắng và các ký tự - ( ) . , / &",
        "Lỗi",
      );
      return false;
    }
    if (!data.categoryId || Number.isNaN(categoryId) || categoryId <= 0) {
      showError("Vui lòng chọn danh mục sản phẩm", "Lỗi");
      return false;
    }

    try {
      const imageValidationMessage = validateImageFile(data.imageFile || null);
      if (imageValidationMessage) {
        showError(imageValidationMessage, "Lỗi");
        return false;
      }

      const result = await createSellerFruit(shopId, {
        name,
        description: description || undefined,
        category: { categoryId },
        price,
        stock,
        imageUrl: undefined,
      });
      if (result.resultCd === 0) {
        if (data.imageFile && result.data?.productId) {
          const uploadResult = await uploadSellerFruitImage(
            result.data.productId,
            data.imageFile,
          );
          if (uploadResult.resultCd !== 0) {
            showError(
              getSellerFruitDisplayMessage(
                uploadResult.message || "Không thể tải ảnh sản phẩm lên",
              ),
              "Lỗi",
            );
            return false;
          }
        }

        showNotice("Tạo sản phẩm thành công", "Thành công");
        await loadFruits();
        return true;
      } else {
        showError(
          getSellerFruitDisplayMessage(
            result.message || "Không thể tạo sản phẩm",
          ),
          "Lỗi",
        );
      }
    } catch (error) {
      console.error("Failed to create fruit:", error);
      showError("Không thể tạo sản phẩm lúc này.", "Lỗi");
    }
    return false;
  };

  const handleSoftDelete = (fruitId: number) => {
    showConfirm(
      "Bạn có chắc muốn ngừng kinh doanh sản phẩm này?",
      async () => {
        try {
          const result = await updateSellerFruitStatus(fruitId, false);
          if (result.resultCd === 0) {
            showNotice("Ngừng bán sản phẩm thành công", "Thành công");
            await loadFruits();
          } else {
            showError(
              getSellerFruitDisplayMessage(
                result.message || "Không thể ngừng bán sản phẩm",
              ),
              "Lỗi",
            );
          }
        } catch (error) {
          console.error("Failed to discontinue fruit:", error);
          showError("Không thể cập nhật trạng thái sản phẩm lúc này.", "Lỗi");
        }
      },
      "Xác nhận",
    );
  };

  const handleReactivate = (fruitId: number) => {
    showConfirm(
      "Bạn có chắc muốn kinh doanh lại sản phẩm này?",
      async () => {
        try {
          const result = await updateSellerFruitStatus(fruitId, true);
          if (result.resultCd === 0) {
            showNotice("Mở bán lại sản phẩm thành công", "Thành công");
            await loadFruits();
          } else {
            showError(
              getSellerFruitDisplayMessage(
                result.message || "Không thể mở bán lại sản phẩm",
              ),
              "Lỗi",
            );
          }
        } catch (error) {
          console.error("Failed to reactivate fruit:", error);
          showError("Không thể cập nhật trạng thái sản phẩm lúc này.", "Lỗi");
        }
      },
      "Xác nhận",
    );
  };

  const handleDelete = (fruitId: number) => {
    showConfirm(
      "Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?",
      async () => {
        try {
          const result = await deleteSellerFruit(fruitId);
          if (result.resultCd === 0) {
            showNotice("Xóa sản phẩm thành công", "Thành công");
            await loadFruits();
          } else {
            showError(
              getSellerFruitDisplayMessage(
                result.message || "Không thể xóa sản phẩm",
              ),
              "Lỗi",
            );
          }
        } catch (error) {
          console.error("Failed to delete fruit:", error);
          showError("Không thể xóa sản phẩm lúc này.", "Lỗi");
        }
      },
      "Xác nhận",
    );
  };

  return (
    <FruitManagerView
      fruits={fruits}
      isLoading={isLoading}
      categories={categories}
      editingFruitId={editingFruitId}
      editForm={editForm}
      onCreate={handleCreateFruit}
      onStartEdit={startEdit}
      onCancelEdit={cancelEdit}
      onEditFieldChange={updateEditField}
      onEditImageFileChange={setEditImageFile}
      onSaveEdit={handleSaveEdit}
      onViewDetail={(fruitId) => navigate(`/seller/products/${fruitId}`)}
      onSoftDelete={handleSoftDelete}
      onReactivate={handleReactivate}
      onDelete={handleDelete}
      onRefresh={loadFruits}
    />
  );
};

export default FruitManager;
