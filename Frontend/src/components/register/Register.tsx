import { useState } from 'react'
import RegisterView, { type RegisterValues } from './RegisterView'

const initial: RegisterValues = { fullName: '', email: '', password: '', confirmPassword: '', phone: '', acceptTerms: false }

export default function Register() {
  const [values, setValues] = useState<RegisterValues>(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  function onChange(field: string, value: any) {
    setValues((v) => ({ ...v, [field]: value }))
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  function validate() {
    const err: Record<string, string> = {}
    if (!values.fullName.trim()) err.fullName = 'Vui lòng nhập họ và tên'
    if (!values.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) err.email = 'Email không hợp lệ'
    if (!values.password || values.password.length < 8) err.password = 'Mật khẩu tối thiểu 8 kí tự'
    if (values.password !== values.confirmPassword) err.confirmPassword = 'Mật khẩu không khớp'
    if (!values.acceptTerms) err.acceptTerms = 'Bạn cần đồng ý điều khoản'
    return err
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validate()
    if (Object.keys(err).length) {
      setErrors(err)
      return
    }

    setLoading(true)
    // mock API
    setTimeout(() => {
      setLoading(false)
      // mock success
      alert(`Đăng ký thành công (mock): ${values.fullName} <${values.email}>")`)
      setValues(initial)
    }, 700)
  }

  return <RegisterView values={values} errors={errors} loading={loading} onChange={onChange} onSubmit={onSubmit} onGoToLogin={() => alert('Đi tới login (mock)')} />
}
