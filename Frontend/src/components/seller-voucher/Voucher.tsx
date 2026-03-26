import React, { useEffect, useState } from "react";
import { usePopup } from "../common/popup";
import VoucherView, { type VoucherData } from "./VoucherView";
import {
    createSellerVoucher,
    deleteSellerVoucher,
    getSellerVouchersByShop,
    getVoucherDisplayMessage,
    updateSellerVoucher,
} from "../../services/sellerVoucherService";

type EditFormState = {
    code: string;
    discountValue: string;
    minOrderValue: string;
    expiryDate: string;
};

const Voucher = ({ shopId }: { shopId: number }) => {
    const [vouchers, setVouchers] = useState<VoucherData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingVoucherId, setEditingVoucherId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<EditFormState>({
        code: "",
        discountValue: "",
        minOrderValue: "",
        expiryDate: "",
    });
    const { showConfirm, showError, showNotice } = usePopup();

    // Tải danh sách Voucher của Shop
    const loadVouchers = async () => {
        setIsLoading(true);
        try {
            const response = await getSellerVouchersByShop(shopId);
            if (response.resultCd === 0 && response.data) {
                setVouchers(response.data);
            } else {
                showError(
                    getVoucherDisplayMessage(
                        response.message || "Không thể tải danh sách voucher",
                    ),
                    "Lỗi",
                );
            }
        } catch (error) {
            console.error("Failed to load vouchers:", error);
            showError("Không thể kết nối đến hệ thống. Vui lòng thử lại.", "Lỗi");
        } finally {
            // Delay 600ms theo checklist
            setTimeout(() => setIsLoading(false), 600);
        }
    };

    useEffect(() => {
        if (shopId) loadVouchers();
    }, [shopId]);

    const startEdit = (voucher: VoucherData) => {
        setEditingVoucherId(voucher.voucherId);
        setEditForm({
            code: voucher.code ?? "",
            discountValue: String(voucher.discountValue ?? ""),
            minOrderValue: String(voucher.minOrderValue ?? ""),
            expiryDate: voucher.expiryDate ?? "",
        });
    };

    const cancelEdit = () => {
        setEditingVoucherId(null);
        setEditForm({
            code: "",
            discountValue: "",
            minOrderValue: "",
            expiryDate: "",
        });
    };

    const updateEditField = (field: keyof EditFormState, value: string) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    // Thêm mới Voucher
    const handleCreateVoucher = async (data: Partial<VoucherData>) => {
        try {
            if (!data.code || !data.discountValue || !data.expiryDate) {
                showError("Vui lòng nhập đầy đủ thông tin voucher", "Lỗi");
                return;
            }
            if (Number(data.discountValue) < 0) {
                showError("Giá trị giảm phải lớn hơn hoặc bằng 0", "Lỗi");
                return;
            }
            const expiryDateValue = new Date(data.expiryDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (Number.isNaN(expiryDateValue.getTime()) || expiryDateValue < today) {
                showError("Ngày hết hạn phải từ hôm nay trở đi", "Lỗi");
                return;
            }

            const normalizedCode = data.code.trim().toLowerCase();
            const isDuplicate = vouchers.some(
                (voucher) => voucher.code?.trim().toLowerCase() === normalizedCode,
            );
            if (isDuplicate) {
                showError("Mã giảm giá đã tồn tại", "Lỗi");
                return;
            }

            const response = await createSellerVoucher(shopId, {
                code: data.code.trim(),
                discountValue: data.discountValue,
                minOrderValue: data.minOrderValue ?? 0,
                expiryDate: data.expiryDate,
            });

            if (response.resultCd === 0) {
                showNotice("Lưu voucher thành công!", "Thành công");
                await loadVouchers();
            } else {
                showError(
                    getVoucherDisplayMessage(
                        response.message || "Không thể lưu voucher",
                    ),
                    "Lỗi",
                );
            }
        } catch (error) {
            console.error("Failed to save voucher:", error);
            showError("Không thể lưu voucher lúc này.", "Lỗi");
        }
    };

    // Cập nhật Voucher
    const handleUpdateVoucher = async (voucherId: number) => {
        const code = editForm.code.trim();
        const discountValue = Number(editForm.discountValue);
        const minOrderValue = Number(editForm.minOrderValue);
        const expiryDate = editForm.expiryDate;

        if (!code || !expiryDate) {
            showError("Vui lòng nhập đầy đủ thông tin voucher", "Lỗi");
            return;
        }
        if (Number.isNaN(discountValue) || discountValue <= 0) {
            showError("Giá trị giảm phải lớn hơn 0", "Lỗi");
            return;
        }
        if (Number.isNaN(minOrderValue) || minOrderValue < 0) {
            showError("Đơn tối thiểu phải lớn hơn hoặc bằng 0", "Lỗi");
            return;
        }
        const expiryDateValue = new Date(expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (Number.isNaN(expiryDateValue.getTime()) || expiryDateValue < today) {
            showError("Ngày hết hạn phải từ hôm nay trở đi", "Lỗi");
            return;
        }

        const normalizedCode = code.toLowerCase();
        const isDuplicate = vouchers.some(
            (voucher) =>
                voucher.voucherId !== voucherId &&
                voucher.code?.trim().toLowerCase() === normalizedCode,
        );
        if (isDuplicate) {
            showError("Mã giảm giá đã tồn tại", "Lỗi");
            return;
        }

        try {
            const response = await updateSellerVoucher(voucherId, {
                code,
                discountValue,
                minOrderValue,
                expiryDate,
            });

            if (response.resultCd === 0) {
                showNotice("Cập nhật voucher thành công!", "Thành công");
                cancelEdit();
                await loadVouchers();
            } else {
                showError(
                    getVoucherDisplayMessage(
                        response.message || "Không thể cập nhật voucher",
                    ),
                    "Lỗi",
                );
            }
        } catch (error) {
            console.error("Failed to update voucher:", error);
            showError("Không thể cập nhật voucher lúc này.", "Lỗi");
        }
    };

    const handleDeleteVoucher = (voucherId: number) => {
        showConfirm(
            "Bạn có chắc muốn xóa mã giảm giá này?",
            async () => {
                try {
                    const response = await deleteSellerVoucher(voucherId);
                    if (response.resultCd === 0) {
                        showNotice("Xóa voucher thành công!", "Thành công");
                        await loadVouchers();
                    } else {
                        showError(
                            getVoucherDisplayMessage(
                                response.message || "Không thể xóa voucher",
                            ),
                            "Lỗi",
                        );
                    }
                } catch (error) {
                    console.error("Failed to delete voucher:", error);
                    showError("Không thể xóa voucher lúc này.", "Lỗi");
                }
            },
            "Xác nhận",
        );
    };

    return (
        <VoucherView
            vouchers={vouchers}
            isLoading={isLoading}
            editingVoucherId={editingVoucherId}
            editForm={editForm}
            onStartEdit={startEdit}
            onCancelEdit={cancelEdit}
            onEditFieldChange={updateEditField}
            onSaveEdit={handleUpdateVoucher}
            onSave={handleCreateVoucher}
            onDelete={handleDeleteVoucher}
            onRefresh={loadVouchers}
        />
    );
};

export default Voucher;
