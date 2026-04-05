/**
 * SliderManagement - Container Component
 * Theo chuẩn API_CLIENT_GUIDE.md:
 * - Gọi API trong Container, KHÔNG gọi trong View
 * - Handle loading, success, error states đầy đủ
 * - Dùng usePopup() cho tất cả thông báo
 */

import React, { useState, useEffect } from 'react';
import SliderManagementView from './SliderManagementView';
import { LoadingModal } from '../common/loading';
import { usePopup } from '../common/popup';
import {
  getSliders,
  createSlider,
  updateSlider,
  deleteSlider,
  toggleSliderStatus,
  getSliderErrorMessage,
  type SliderDto,
  type SliderFormData,
} from '../../services/sliderService';

export type ViewMode = 'LIST' | 'CREATE' | 'EDIT';

const SliderManagement: React.FC = () => {
  const { showNotice, showError, showConfirm } = usePopup();

  // UI State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() =>
    localStorage.getItem('sidebar-collapsed') === 'true'
  );
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [searchQuery, setSearchQuery] = useState('');

  // Data State
  const [sliders, setSliders] = useState<SliderDto[]>([]);
  const [currentSlider, setCurrentSlider] = useState<SliderDto | null>(null);
  const [loading, setLoading] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar-collapsed', String(next));
      return next;
    });
  };

  // ---- Load danh sách slider ----
  const loadSliders = async () => {
    setLoading(true);
    try {
      const result = await getSliders();
      if (result.resultCd === 0 && result.data) {
        setSliders(result.data);
      } else {
        showError(getSliderErrorMessage(result.message || 'Không thể tải danh sách slider'), 'Lỗi');
        setSliders([]);
      }
    } catch {
      showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSliders();
  }, []);

  // ---- Tạo slider mới ----
  const handleCreate = async (values: SliderFormData) => {
    // Client-side validation
    if (!values.title.trim()) {
      showError('Vui lòng nhập tiêu đề slider', 'Dữ liệu không hợp lệ');
      return;
    }
    if (!values.image) {
      showError('Vui lòng chọn hình ảnh cho slider', 'Dữ liệu không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const result = await createSlider(values);
      if (result.resultCd === 0) {
        showNotice('Tạo slider mới thành công!', 'Thành công');
        setViewMode('LIST');
        loadSliders();
      } else {
        showError(getSliderErrorMessage(result.message || 'Không thể tạo slider'), 'Lỗi');
      }
    } catch {
      showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  // ---- Cập nhật slider ----
  const handleUpdate = async (id: number, values: SliderFormData) => {
    if (!values.title.trim()) {
      showError('Vui lòng nhập tiêu đề slider', 'Dữ liệu không hợp lệ');
      return;
    }

    setLoading(true);
    try {
      const result = await updateSlider(id, values);
      if (result.resultCd === 0) {
        showNotice('Cập nhật slider thành công!', 'Thành công');
        setViewMode('LIST');
        loadSliders();
      } else {
        showError(getSliderErrorMessage(result.message || 'Không thể cập nhật slider'), 'Lỗi');
      }
    } catch {
      showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  // ---- Xóa slider (cần confirm) ----
  const handleDelete = (id: number, title: string) => {
    showConfirm(
      `Xóa slider "${title}"? Hành động này không thể hoàn tác.`,
      async () => {
        setLoading(true);
        try {
          const result = await deleteSlider(id);
          if (result.resultCd === 0) {
            showNotice('Đã xóa slider thành công!', 'Thành công');
            setSliders(prev => prev.filter(s => s.sliderId !== id));
          } else {
            showError(getSliderErrorMessage(result.message || 'Không thể xóa slider'), 'Lỗi');
          }
        } catch {
          showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi kết nối');
        } finally {
          setLoading(false);
        }
      },
      'Xác nhận xóa',
    );
  };

  // ---- Toggle hiển thị/ẩn slider ----
  const handleToggleStatus = async (id: number) => {
    const current = sliders.find(s => s.sliderId === id);
    if (!current) return;

    setLoading(true);
    try {
      const result = await toggleSliderStatus(id);
      if (result.resultCd === 0) {
        // Optimistic update: đảo trạng thái ngay trên UI
        setSliders(prev =>
          prev.map(s => s.sliderId === id ? { ...s, status: !s.status } : s)
        );
        showNotice(
          `Slider đã chuyển sang ${current.status ? 'Ẩn' : 'Hiển thị'}!`,
          'Thành công'
        );
      } else {
        showError(getSliderErrorMessage(result.message || 'Không thể đổi trạng thái'), 'Lỗi');
      }
    } catch {
      showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  // ---- Mở form chỉnh sửa ----
  const handleEdit = (slider: SliderDto) => {
    setCurrentSlider(slider);
    setViewMode('EDIT');
  };

  // ---- Lọc danh sách theo từ khóa tìm kiếm ----
  const filteredSliders = sliders.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SliderManagementView
        sliders={filteredSliders}
        viewMode={viewMode}
        setViewMode={setViewMode}
        currentSlider={currentSlider}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        loading={loading}
      />
      <LoadingModal
        isOpen={loading}
        message="Đang xử lý..."
        subMessage="Vui lòng chờ trong giây lát"
        theme="green"
      />
    </>
  );
};

export default SliderManagement;
