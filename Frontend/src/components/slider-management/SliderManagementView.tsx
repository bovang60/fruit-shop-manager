import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AdminFrame, ADMIN_NAV_ITEMS } from '../common/admin-frame';
import type { SliderDto, SliderFormData } from '../../services/sliderService';
import type { ViewMode } from './SliderManagement';
import './SliderManagement.css';

interface Props {
  sliders: SliderDto[];
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  currentSlider: SliderDto | null;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCreate: (values: SliderFormData) => void;
  onUpdate: (id: number, values: SliderFormData) => void;
  onDelete: (id: number, title: string) => void;
  onEdit: (slider: SliderDto) => void;
  onToggleStatus: (id: number) => void;
  loading: boolean;
}

const EMPTY_FORM: SliderFormData = {
  title: '',
  description: '',
  status: true,
  image: null,
};

export default function SliderManagementView({
  sliders,
  viewMode,
  setViewMode,
  currentSlider,
  isSidebarCollapsed,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  onCreate,
  onUpdate,
  onDelete,
  onEdit,
  onToggleStatus,
  loading,
}: Props) {
  const [form, setForm] = useState<SliderFormData>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (viewMode === 'EDIT' && currentSlider) {
      setForm({
        title: currentSlider.title,
        description: currentSlider.description || '',
        status: currentSlider.status,
        image: null,
      });
      setImagePreview(currentSlider.imageUrl || '');
    } else if (viewMode === 'CREATE') {
      setForm(EMPTY_FORM);
      setImagePreview('');
    }
  }, [viewMode, currentSlider]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(currentSlider?.imageUrl || '');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (viewMode === 'CREATE' && !form.image) return;
    if (viewMode === 'EDIT' && currentSlider?.sliderId) {
      onUpdate(currentSlider.sliderId, form);
    } else {
      onCreate(form);
    }
  };

  const renderContent = () => (
    <>
      {/* Page Header */}
      <div className="page-header-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <nav className="breadcrumbs-modern">
              <Link to="/admin-dashboard">Bảng điều khiển</Link>
              <span className="material-symbols-outlined">chevron_right</span>
              <span className="current">Quản lý Slider</span>
            </nav>
            <h1>Quản lý Slider</h1>
            <p>{sliders.length} slider hiện có</p>
          </div>
          <button className="btn-primary-admin" onClick={() => setViewMode('CREATE')}>
            <span className="material-symbols-outlined">add</span>
            Thêm Slider
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="management-filter-section">
        <div className="filter-search-actions">
          <div className="modern-search-input-wrap">
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Tìm kiếm slider theo tiêu đề..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="slider-grid-wrap">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>Đang tải slider...</div>
        ) : sliders.length === 0 ? (
          <div className="slider-empty-state">
            <span className="material-symbols-outlined">view_carousel</span>
            <h3>Chưa có slider nào</h3>
            <p>Hãy thêm slider đầu tiên để hiển thị trên trang chủ.</p>
            <button className="btn-primary-admin" onClick={() => setViewMode('CREATE')}>
              <span className="material-symbols-outlined">add</span>
              Thêm Slider
            </button>
          </div>
        ) : (
          <div className="slider-cards-grid">
            {sliders.map(slider => (
              <div key={slider.sliderId} className={`slider-card ${!slider.status ? 'inactive' : ''}`}>
                <div className="slider-card-img-wrap">
                  {slider.imageUrl ? (
                    <img
                      src={slider.imageUrl}
                      alt={slider.title}
                      className="slider-card-img"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x300?text=No+Image'; }}
                    />
                  ) : (
                    <div className="slider-no-img">
                      <span className="material-symbols-outlined">image_not_supported</span>
                    </div>
                  )}
                  <div className="slider-card-overlay">
                    {slider.title && <span className="slider-overlay-title">{slider.title}</span>}
                    {slider.description && <span className="slider-overlay-desc">{slider.description}</span>}
                  </div>
                  <div className="slider-card-badges">
                    <span className={`admin-status-chip ${slider.status ? 'is-approved' : 'is-rejected'}`}>
                      {slider.status ? 'Đang hiển thị' : 'Đã ẩn'}
                    </span>
                  </div>
                </div>
                <div className="slider-card-body">
                  <div className="slider-card-info">
                    <h3 className="slider-card-title">{slider.title}</h3>
                    {slider.description && <p className="slider-card-desc">{slider.description}</p>}
                  </div>
                  <div className="slider-card-actions">
                    <button
                      className="slider-action-btn toggle"
                      title={slider.status ? 'Ẩn slider' : 'Hiển thị slider'}
                      onClick={() => onToggleStatus(slider.sliderId)}
                    >
                      <span className="material-symbols-outlined">
                        {slider.status ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                    <button className="slider-action-btn edit" title="Chỉnh sửa" onClick={() => onEdit(slider)}>
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="slider-action-btn delete" title="Xóa" onClick={() => onDelete(slider.sliderId, slider.title)}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  const renderFormModal = () => (
    <div className="admin-modal-overlay" onClick={() => setViewMode('LIST')}>
      <div className="admin-modal-content slider-form-modal" onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{viewMode === 'CREATE' ? 'Thêm Slider Mới' : 'Chỉnh sửa Slider'}</h2>
          <button className="admin-modal-close-btn" onClick={() => setViewMode('LIST')} title="Đóng">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-modal-body">
            <div className="slider-form-grid">

              {/* ---- Left: Inputs ---- */}
              <div className="slider-form-fields">
                {/* Title */}
                <div className="form-group-modern">
                  <label>Tiêu đề <span className="required">*</span></label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Nhập tiêu đề banner..."
                    required
                    className="modern-input"
                  />
                </div>

                {/* Description */}
                <div className="form-group-modern">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả ngắn hiển thị trên banner..."
                    rows={3}
                    className="modern-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Status toggle */}
                <div className="form-group-modern">
                  <label>Trạng thái hiển thị</label>
                  <div className="slider-status-toggle">
                    <button
                      type="button"
                      className={`status-toggle-btn ${form.status ? 'active' : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, status: true }))}
                    >
                      <span className="material-symbols-outlined">visibility</span>
                      Hiển thị
                    </button>
                    <button
                      type="button"
                      className={`status-toggle-btn ${!form.status ? 'active-hidden' : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, status: false }))}
                    >
                      <span className="material-symbols-outlined">visibility_off</span>
                      Ẩn
                    </button>
                  </div>
                </div>
              </div>

              {/* ---- Right: Image upload ---- */}
              <div className="slider-form-preview">
                <p className="preview-label">
                  Hình ảnh banner
                  {viewMode === 'CREATE' && <span className="required"> *</span>}
                </p>

                {/* Drop zone */}
                <div
                  className={`upload-dropzone ${imagePreview ? 'has-image' : ''}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="preview" className="upload-preview-img" />
                      <div className="upload-preview-overlay">
                        <span className="material-symbols-outlined">photo_camera</span>
                        <span>Bấm hoặc kéo thả để đổi ảnh</span>
                      </div>
                      {form.title && (
                        <div className="preview-overlay">
                          <span className="preview-title">{form.title}</span>
                          {form.description && <span className="preview-desc">{form.description}</span>}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="upload-placeholder">
                      <span className="material-symbols-outlined">cloud_upload</span>
                      <p>Kéo thả ảnh vào đây</p>
                      <span>hoặc bấm để chọn file</span>
                      <small>PNG, JPG, GIF — tối đa 5MB</small>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                {form.image && (
                  <div className="upload-file-info">
                    <span className="material-symbols-outlined">image</span>
                    <span>{form.image.name}</span>
                    <button
                      type="button"
                      className="upload-clear-btn"
                      onClick={e => {
                        e.stopPropagation();
                        setForm(prev => ({ ...prev, image: null }));
                        setImagePreview(currentSlider?.imageUrl || '');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>
                )}

                {viewMode === 'EDIT' && !form.image && currentSlider?.imageUrl && (
                  <p className="upload-keep-note">
                    <span className="material-symbols-outlined">info</span>
                    Không chọn ảnh mới sẽ giữ nguyên ảnh cũ
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="btn-cancel-action" onClick={() => setViewMode('LIST')}>Hủy</button>
            <button
              type="submit"
              className="btn-save-action"
              disabled={!form.title.trim() || (viewMode === 'CREATE' && !form.image)}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
              {viewMode === 'CREATE' ? 'Tạo Slider' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <AdminFrame
      sidebarItems={ADMIN_NAV_ITEMS}
      isSidebarCollapsed={isSidebarCollapsed}
      onToggleSidebar={onToggleSidebar}
      modalContent={(viewMode === 'CREATE' || viewMode === 'EDIT') ? renderFormModal() : null}
    >
      {renderContent()}
    </AdminFrame>
  );
}
