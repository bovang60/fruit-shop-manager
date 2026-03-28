import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileView from './ProfileView'
import { getUserProfile, updateUserProfile, uploadAvatar } from '../../services/profileService'
import { getUserFromStorage } from '../../services/authService'
import { usePopup } from '../common/popup'
import type { UserProfile } from './Profile.types'
import type { UpdateProfileDto } from './Profile.types'

export type { UserProfile }

export default function Profile() {
  const navigate = useNavigate()
  const { showSuccess, showError } = usePopup()
  
  // Get user ID from localStorage (from login session)
  const currentUser = getUserFromStorage()
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
    }
  }, [currentUser, navigate])
  
  // If no user, return null (will redirect to login)
  if (!currentUser) return null
  
  const userId = currentUser.userId
  
  // State for user profile data - Start with null, will be loaded from API
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true) // Start with loading=true
  const [uploadingAvatar, setUploadingAvatar] = useState(false) // Separate loading state for avatar
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')

  // Load user profile data
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await getUserProfile(userId)
      
      if (response.resultCd === 0 && response.data) {
        // Map API response to UI profile structure
        const apiProfile = response.data
        const uiProfile: UserProfile = {
          userId: apiProfile.userId,
          fullName: apiProfile.fullName,
          email: apiProfile.email,
          phoneNumber: apiProfile.phoneNumber,
          address: apiProfile.address || '',
          avatar: apiProfile.image || undefined,
          role: apiProfile.role,
          stats: {
            orders: 0, // TODO: Get from separate API if needed
            points: 0
          },
          settings: {
            twoFactorAuth: false,
            orderNotifications: true
          }
        }
        
        setProfile(uiProfile)
        setEditedProfile(uiProfile)
      } else {
        setError(response.message || 'Không thể tải thông tin')
        setProfile(null)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Không thể tải thông tin. Vui lòng thử lại.')
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProfile = () => {
    if (!profile) return
    setIsEditing(true)
    setEditedProfile(profile)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedProfile(profile)
  }

  const handleSaveProfile = async () => {
    if (!editedProfile) return
    
    setLoading(true)
    setError('')
    setSuccessMessage('')
    
    try {
      // Prepare update data (only send fields that API accepts)
      const updateData: UpdateProfileDto = {
        fullName: editedProfile.fullName,
        phoneNumber: editedProfile.phoneNumber || undefined,
        address: editedProfile.address || undefined
      }
      
      const response = await updateUserProfile(userId, updateData)
      
      if (response.resultCd === 0 && response.data) {
        // Map API response to UI profile structure
        const apiProfile = response.data
        const updatedProfile: UserProfile = {
          ...editedProfile,
          userId: apiProfile.userId,
          fullName: apiProfile.fullName,
          email: apiProfile.email,
          phoneNumber: apiProfile.phoneNumber,
          address: apiProfile.address || '',
          avatar: apiProfile.image || editedProfile.avatar,
          role: apiProfile.role
        }
        
        setProfile(updatedProfile)
        setEditedProfile(updatedProfile)
        setIsEditing(false)
        showSuccess('Cập nhật thông tin thành công!', 'Thành công')
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setError(response.message || 'Không thể cập nhật thông tin')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      setError('Không thể cập nhật thông tin. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (field: keyof UserProfile, value: string) => {
    if (!editedProfile) return
    setEditedProfile({
      ...editedProfile,
      [field]: value
    })
  }

  const handleChangePassword = () => {
    // Navigate to change password screen
    navigate('/change-password')
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Vui lòng chọn file ảnh hợp lệ (JPG, PNG, GIF)', 'Lỗi')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      showError('Kích thước ảnh không được vượt quá 5MB', 'Lỗi')
      return
    }

    setUploadingAvatar(true)
    setError('')
    
    try {
      const response = await uploadAvatar(userId, file)
      
      if (response.resultCd === 0 && response.data) {
        // Update profile with new avatar URL from backend
        const updatedProfile: UserProfile = {
          ...profile!,
          avatar: response.data.image || undefined,
        }
        
        setProfile(updatedProfile)
        if (editedProfile) {
          setEditedProfile(updatedProfile)
        }
        
        // Update user in localStorage for header to reflect changes
        const storedUser = getUserFromStorage()
        if (storedUser) {
          const updatedUser = {
            ...storedUser,
            image: response.data.image
          }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          // Dispatch custom event to notify header of avatar change
          window.dispatchEvent(new Event('userUpdated'))
        }
        
        showSuccess('Cập nhật ảnh đại diện thành công!', 'Thành công')
      } else {
        showError(response.message || 'Không thể tải ảnh lên', 'Lỗi')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      showError('Lỗi kết nối. Vui lòng thử lại.', 'Lỗi')
    } finally {
      setUploadingAvatar(false)
      // Reset input to allow re-uploading the same file
      event.target.value = ''
    }
  }

  const handleToggleTwoFactor = async () => {
    if (!profile) return
    setLoading(true)
    try {
      // TODO: API call to toggle two-factor auth
      setProfile({
        ...profile,
        settings: {
          ...profile.settings,
          twoFactorAuth: !profile.settings.twoFactorAuth
        }
      })
    } catch (error) {
      console.error('Error toggling two-factor auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleNotifications = async () => {
    if (!profile) return
    setLoading(true)
    try {
      // TODO: API call to toggle notifications
      setProfile({
        ...profile,
        settings: {
          ...profile.settings,
          orderNotifications: !profile.settings.orderNotifications
        }
      })
    } catch (error) {
      console.error('Error toggling notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToHome = () => {
    navigate('/home')
  }

  const handleNavigateToShop = () => {
    navigate('/products')
  }

  const handleNavigateToOrders = () => {
    navigate('/orders')
  }

  const handleNavigateToCart = () => {
    navigate('/cart')
  }

  // Show error state if failed to load and no profile data
  if (!profile && error && !loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '1rem' }}>
        <p style={{ color: '#dc2626' }}>⚠️ {error}</p>
        <button onClick={loadUserProfile} style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #33f20d', background: '#33f20d', color: 'white', cursor: 'pointer' }}>
          Thử lại
        </button>
      </div>
    )
  }

  // Only render ProfileView if we have profile data
  if (!profile) return null

  return (
    <ProfileView
      profile={profile}
      loading={loading}
      uploadingAvatar={uploadingAvatar}
      isEditing={isEditing}
      editedProfile={editedProfile || profile}
      error={error}
      successMessage={successMessage}
      onEditProfile={handleEditProfile}
      onSaveProfile={handleSaveProfile}
      onCancelEdit={handleCancelEdit}
      onFieldChange={handleFieldChange}
      onChangePassword={handleChangePassword}
      onAvatarChange={handleAvatarChange}
      onToggleTwoFactor={handleToggleTwoFactor}
      onToggleNotifications={handleToggleNotifications}
      onNavigateToHome={handleNavigateToHome}
      onNavigateToShop={handleNavigateToShop}
      onNavigateToOrders={handleNavigateToOrders}
      onNavigateToCart={handleNavigateToCart}
    />
  )
}
