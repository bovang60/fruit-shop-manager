import React, { useEffect, useState } from "react";
import { usePopup } from "../common/popup";
import {
  deleteSellerFruit,
  createSellerFruit,
  getSellerFruitDisplayMessage,
  getSellerFruitsByShop,
  updateSellerFruit,
  updateSellerFruitStatus,
  type SellerProductDto,
} from "../../services/sellerFruitService";
import FruitManagerView from "./FruitManagerView";

type EditFormState = {
  name: string;
  price: string;
  stock: string;
  imageUrl: string;
};

const parsePositivePrice = (priceValue: string): number | null => {
  if (!priceValue) {
    return null;
  }

  if (!/^\d+(\.\d+)?$/.test(priceValue)) {
    return null;
  }

  const price = Number(priceValue);
  if (!Number.isFinite(price) || price <= 0) {
    return null;
  }

  return price;
};

const FruitManager = ({ shopId }: { shopId: number }) => {
  const [fruits, setFruits] = useState<SellerProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFruitId, setEditingFruitId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    price: "",
    stock: "",
    imageUrl: "",
  });
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

  const startEdit = (fruit: SellerProductDto) => {
    setEditingFruitId(fruit.productId);
    setEditForm({
      name: fruit.name ?? "",
      price: fruit.price !== undefined ? String(fruit.price) : "",
      stock: fruit.stock !== undefined ? String(fruit.stock) : "",
      imageUrl: fruit.imageUrl ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingFruitId(null);
    setEditForm({ name: "", price: "", stock: "", imageUrl: "" });
  };

  const updateEditField = (field: keyof EditFormState, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (fruitId: number) => {
    const name = editForm.name.trim();
    const priceValue = editForm.price.trim();
    const stockValue = editForm.stock.trim();
    const price = parsePositivePrice(priceValue);
    const stock = Number(stockValue);

    if (!name) {
      showError("Vui lòng nhập tên sản phẩm", "Lỗi");
      return;
    }
    if (price === null) {
      showError("Giá sản phẩm phải là số và lớn hơn 0", "Lỗi");
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

    try {
      const result = await updateSellerFruit(fruitId, {
        name,
        price,
        stock,
        imageUrl: editForm.imageUrl?.trim() || undefined,
      });
      if (result.resultCd === 0) {
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
    price: string;
    stock: string;
    imageUrl?: string;
  }): Promise<boolean> => {
    const name = data.name.trim();
    const priceValue = data.price.trim();
    const stockValue = data.stock.trim();
    const price = parsePositivePrice(priceValue);
    const stock = Number(stockValue);
    if (!name) {
      showError("Vui lòng nhập tên sản phẩm", "Lỗi");
      return false;
    }
    if (price === null) {
      showError("Giá sản phẩm phải là số và lớn hơn 0", "Lỗi");
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

    try {
      const result = await createSellerFruit(shopId, {
        name,
        price,
        stock,
        imageUrl: data.imageUrl?.trim() || undefined,
      });
      if (result.resultCd === 0) {
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
      editingFruitId={editingFruitId}
      editForm={editForm}
      onCreate={handleCreateFruit}
      onStartEdit={startEdit}
      onCancelEdit={cancelEdit}
      onEditFieldChange={updateEditField}
      onSaveEdit={handleSaveEdit}
      onSoftDelete={handleSoftDelete}
      onReactivate={handleReactivate}
      onDelete={handleDelete}
      onRefresh={loadFruits}
    />
  );
};

export default FruitManager;
