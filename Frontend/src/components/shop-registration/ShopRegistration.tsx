import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ShopRegistrationView from './ShopRegistrationView';
import type { RegistrationStep, ShopRegistrationData } from './ShopRegistrationView';
import { usePopup } from '../common/popup/PopupProvider';
import { getUserFromStorage } from '../../services/authService';
import { getShippingMethods, type ShippingMethodDto } from '../../services/shippingMethodService';
import { checkShopNameExists, registerShop, getShopErrorMessage, checkCanRegisterShop, checkShopStatus, checkTaxCodeExists } from '../../services/shopService';

const STEPS: RegistrationStep[] = [
    { id: 1, label: 'Thông tin Shop' },
    { id: 2, label: 'Cài đặt vận chuyển' },
    { id: 3, label: 'Thông tin Thuế & Định danh' },
    { id: 4, label: 'Hoàn tất' }
];

const isValidTaxCode = (taxCode: string, businessType: string): boolean => {
    if (!taxCode) return false;
    const cleanCode = taxCode.trim();
    if (businessType === 'personal') {
        return /^\d{12}$/.test(cleanCode);
    }
    if (businessType === 'household' || businessType === 'company') {
        return cleanCode.length >= 10 && cleanCode.length <= 14;
    }
    return false;
};

const ShopRegistration: React.FC = () => {
    const { showNotice, showError, showWarning } = usePopup();
    const navigate = useNavigate();

    const [rejectReason, setRejectReason] = useState<string | null>(null);

    // Kiểm tra đăng nhập và quyền đăng ký
    useEffect(() => {
        const checkAuthAndStatus = async () => {
            const user = getUserFromStorage();
            if (!user) {
                showNotice('Vui lòng đăng nhập để đăng ký trở thành người bán', 'Yêu cầu đăng nhập');
                navigate('/login');
                return;
            }

            const canRegisterRes = await checkCanRegisterShop(user.userId);
            if (canRegisterRes.data === false) {
                showNotice(canRegisterRes.message || 'Bạn không thể đăng ký thêm shop vào lúc này.', 'Thông báo');
                navigate('/home');
                return;
            }

            // Nếu được phép đăng ký, kiểm tra xem có shop nào đã bị từ chối không để pre-fill
            const statusRes = await checkShopStatus(user.userId);
            if (statusRes.resultCd === 0 && statusRes.data) {
                const shop = statusRes.data;
                if (shop.status === 'REJECTED') {
                    setRejectReason(shop.rejectReason || 'Yêu cầu trước đó của bạn đã bị từ chối.');

                    // Pre-fill form data từ shop cũ
                    setFormData(prev => ({
                        ...prev,
                        shopName: shop.shopName,
                        shopDescription: shop.description || '',
                        pickupAddress: shop.pickupAddress || '',
                        businessAddress: shop.businessAddress || '',
                        taxCode: shop.taxCode || '',
                        companyName: shop.businessName || '',
                        businessType: shop.shopType === 'Cá nhân' ? 'personal' : (shop.shopType === 'Công ty' ? 'company' : 'household')
                    }));
                }
            }
        };

        checkAuthAndStatus();
    }, [navigate, showNotice]);

    const [currentStep, setCurrentStep] = useState(1);
    const [shippingMethods, setShippingMethods] = useState<ShippingMethodDto[]>([]);
    const [isLoadingShipping, setIsLoadingShipping] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [taxStatus, setTaxStatus] = useState<'' | 'checking' | 'INVALID' | 'VALID' | 'taken'>('');
    const [taxErrorMessage, setTaxErrorMessage] = useState<string>('');
    // '' | 'checking' | 'taken' | 'available'
    const [shopNameStatus, setShopNameStatus] = useState<'' | 'checking' | 'taken' | 'available'>('');
    const [shopNameErrorMessage, setShopNameErrorMessage] = useState<string>('');

    const [formData, setFormData] = useState<ShopRegistrationData>(() => {
        const user = getUserFromStorage();
        return {
            shopName: '',
            shopDescription: '', // Add missing shopDescription
            pickupAddress: '',
            email: user?.email || '',
            phone: user?.phoneNumber || '',
            selectedShippingMethods: [],
            businessType: 'personal',
            companyName: '',
            businessAddress: '',
            taxCode: ''
        };
    });

    useEffect(() => {
        const fetchMethods = async () => {
            setIsLoadingShipping(true);
            try {
                const res = await getShippingMethods();
                if (res.resultCd === 0 && res.data) {
                    setShippingMethods(res.data);
                    // Xóa tự động check các phương thức khả dụng
                    // Mặc định ban đầu selectedShippingMethods: [] nên không cần update formData
                } else {
                    if (showError) {
                        showError(res.message || 'Không thể tải phương thức vận chuyển', 'Lỗi');
                    }
                }
            } catch {
                if (showError) {
                    showError('Lỗi kết nối khi tải phương thức vận chuyển', 'Lỗi');
                }
            } finally {
                setIsLoadingShipping(false);
            }
        };

        fetchMethods();
    }, [showError]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const nextValue = type === 'checkbox' ? checked : value;
            if (name === 'businessType' && prev.businessType !== nextValue) {
                setTaxStatus('');
                setTaxErrorMessage('');
                return {
                    ...prev,
                    [name]: nextValue as 'personal' | 'household' | 'company',
                    taxCode: '',
                    companyName: '',
                    businessAddress: ''
                };
            }
            if (name === 'taxCode') {
                setTaxStatus('');
                setTaxErrorMessage('');
            }
            if (name === 'shopName') {
                setShopNameStatus('');
                setShopNameErrorMessage('');
            }
            return {
                ...prev,
                [name]: nextValue
            };
        });
    };

    const handleShippingMethodToggle = (methodId: number) => {
        setFormData(prev => {
            const isSelected = prev.selectedShippingMethods.includes(methodId);
            return {
                ...prev,
                selectedShippingMethods: isSelected
                    ? prev.selectedShippingMethods.filter(id => id !== methodId)
                    : [...prev.selectedShippingMethods, methodId]
            };
        });
    };

    const checkTaxCode = async (taxCode: string) => {
        if (!taxCode || taxCode.trim() === '') return;

        if (formData.businessType === 'personal') {
            return; // Dữ liệu VietQR không áp dụng cho cá nhân
        }

        if (!isValidTaxCode(taxCode, formData.businessType)) {
            return; // Không hiện cảnh báo lúc blur, đợi đến khi ấn Next mới báo lỗi
        }

        setIsVerifying(true);
        try {
            const response = await fetch(`https://api.vietqr.io/v2/business/${taxCode}`);
            const result = await response.json();
            if (result.code === '00' && result.data) {
                const apiName = result.data.name || '';
                const apiStatusObj = result.data.status || '';
                const upperName = apiName.toUpperCase();
                const isHouseholdType = formData.businessType === 'household';
                const isCompanyType = formData.businessType === 'company';
                const hasHouseholdKeyword = upperName.includes('HỘ KINH DOANH') || upperName.includes('HO KINH DOANH');

                // Check for NNT ngừng hoạt động
                const statusCheckStr = `${apiName} ${apiStatusObj}`.toUpperCase();
                if (statusCheckStr.includes('NNT NGỪNG HĐ') || statusCheckStr.includes('NNT NGUNG HD') ||
                    statusCheckStr.includes('NNT NGỪNG HOẠT ĐỘNG') || statusCheckStr.includes('NNT NGUNG HOAT DONG')) {
                    setTaxStatus('INVALID');
                } else {
                    setTaxStatus('VALID');
                }

                // Kiểm tra tính đồng nhất giữa tên đăng ký và loại hình đang chọn
                const isMatch = (isHouseholdType && hasHouseholdKeyword) || (isCompanyType && !hasHouseholdKeyword);

                if (isMatch) {
                    setFormData(prev => ({
                        ...prev,
                        companyName: apiName,
                        businessAddress: result.data.address || ''
                    }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        companyName: '',
                        businessAddress: ''
                    }));
                }
                // Bỏ thông báo thành công theo yêu cầu, chỉ tự động điền
            } else {
                setTaxStatus('');
                setFormData(prev => ({
                    ...prev,
                    companyName: '',
                    businessAddress: ''
                }));
            }
            // Bỏ thông báo lỗi theo yêu cầu, để Validate khi bấm Next xử lý
        } catch (error) {
            console.error(error);
        } finally {
            setIsVerifying(false);
        }
    };

    // Tự động điền dữ liệu khi ngừng nhập MST (debounce)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (formData.taxCode && formData.businessType !== 'personal') {
                if (isValidTaxCode(formData.taxCode, formData.businessType)) {
                    // 1. Kiểm tra MST trùng trong hệ thống
                    const res = await checkTaxCodeExists(formData.taxCode.trim());
                    if (res.resultCd === 0 && res.data === true) {
                        setTaxStatus('taken');
                        setTaxErrorMessage('Mã số thuế này đã được đăng ký cho một cửa hàng khác. Vui lòng kiểm tra lại.');
                    } else {
                        // 2. Tra cứu VietQR
                        checkTaxCode(formData.taxCode);
                    }
                }
            }
        }, 800);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.taxCode, formData.businessType]);

    // Kiểm tra tên shop trùng lặp (debounce 600ms)
    useEffect(() => {
        const trimmed = formData.shopName.trim();
        if (trimmed.length < 3) {
            setShopNameStatus('');
            return;
        }
        setShopNameStatus('checking');
        const timer = setTimeout(async () => {
            const res = await checkShopNameExists(trimmed);
            if (res.resultCd === 0) {
                setShopNameStatus(res.data === true ? 'taken' : 'available');
            } else {
                // Lỗi kết nối → không chặn người dùng
                setShopNameStatus('');
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [formData.shopName]);

    const handleNext = () => {
        if (currentStep === 3) {
            if (!isValidTaxCode(formData.taxCode, formData.businessType)) {
                let msg = 'Mã số thuế không hợp lệ. Vui lòng kiểm tra lại.';
                if (formData.businessType === 'personal') {
                    msg = 'Với Cá nhân, Mã số thuế phải gồm ĐÚNG 12 chữ số.';
                } else if (formData.businessType === 'household' || formData.businessType === 'company') {
                    msg = 'Mã số thuế của Hộ kinh doanh và Công ty phải gồm từ 10 đến 14 ký tự hợp lệ.';
                }
                showWarning(msg, 'Kiểm tra lại thông tin');
                return;
            }

            if (taxStatus === 'INVALID') {
                showWarning('Mã số thuế này thuộc về Người nộp thuế đã ngừng hoạt động (NNT ngừng HĐ).', 'Kiểm tra lại thông tin');
                return;
            }
        }

        if (currentStep === STEPS.length) {
            handleSubmit();
            return;
        }

        setCurrentStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        const user = getUserFromStorage();
        if (!user?.userId) {
            showError('Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.', 'Lỗi');
            navigate('/login');
            return;
        }

        // Map businessType sang tên tiếng Việt theo backend
        const shopTypeMap: Record<string, string> = {
            personal: 'Cá nhân',
            household: 'Hộ Kinh Doanh',
            company: 'Công ty',
        };

        const payload = {
            ownerId: user.userId,
            shopName: formData.shopName.trim(),
            description: formData.shopDescription.trim() || undefined,
            address: formData.pickupAddress.trim(),
            taxCode: formData.taxCode.trim() || undefined,
            shopType: shopTypeMap[formData.businessType],
            businessName: formData.companyName.trim() || formData.shopName.trim(),
            businessAddress: formData.businessAddress.trim(),
            pickupAddress: formData.pickupAddress.trim(),
            shippingMethodIds: formData.selectedShippingMethods,
        };

        setIsSubmitting(true);
        try {
            const res = await registerShop(payload);
            if (res.resultCd === 0) {
                showNotice(
                    'Yêu cầu mở cửa hàng của bạn đã được gửi thành công! Chúng tôi sẽ xét duyệt trong vòng 1–3 ngày làm việc.',
                    'Đăng ký thành công'
                );
                navigate('/home');
            } else {
                const apiMsg = res.message || '';
                const displayMsg = getShopErrorMessage(apiMsg);

                // Trả người dùng về đúng bước nếu lỗi liên quan đến trùng lặp dữ liệu
                if (apiMsg.includes('Tên cửa hàng đã tồn tại') || apiMsg.includes('shopName')) {
                    setShopNameStatus('taken');
                    setShopNameErrorMessage(displayMsg);
                    setCurrentStep(1);
                    showWarning(displayMsg, 'Thông tin không hợp lệ');
                } else if (apiMsg.includes('Mã số thuế đã được sử dụng') || apiMsg.includes('taxCode')) {
                    setTaxStatus('taken');
                    setTaxErrorMessage(displayMsg);
                    setCurrentStep(3);
                    showWarning(displayMsg, 'Thông tin không hợp lệ');
                } else {
                    showError(displayMsg, 'Lỗi đăng ký');
                }
            }
        } catch {
            showError('Lỗi kết nối. Vui lòng thử lại sau.', 'Lỗi');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackToHome = () => {
        navigate('/home');
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <ShopRegistrationView
            currentStep={currentStep}
            steps={STEPS}
            formData={formData}
            shippingMethods={shippingMethods}
            isLoadingShipping={isLoadingShipping}
            onInputChange={handleInputChange}
            onShippingMethodToggle={handleShippingMethodToggle}
            onNext={handleNext}
            onPrev={handlePrev}
            onBackToHome={handleBackToHome}
            isVerifying={isVerifying}
            isSubmitting={isSubmitting}
            taxStatus={taxStatus}
            taxErrorMessage={taxErrorMessage}
            shopNameStatus={shopNameStatus}
            shopNameErrorMessage={shopNameErrorMessage}
            rejectReason={rejectReason}
        />
    );
};

export default ShopRegistration;
