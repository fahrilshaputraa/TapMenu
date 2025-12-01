import { useState } from 'react'

export function useFormHandler(initialState) {
  const [formData, setFormData] = useState(initialState)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleError = (err, fieldMapping = {}) => {
    if (err.fieldErrors) {
      const mappedErrors = {}
      Object.keys(err.fieldErrors).forEach((key) => {
        const mappedKey = fieldMapping[key] || key
        mappedErrors[mappedKey] = err.fieldErrors[key]
      })
      setFieldErrors(mappedErrors)
    } else {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.')
    }
  }

  const resetErrors = () => {
    setError('')
    setFieldErrors({})
  }

  return {
    formData,
    setFormData,
    fieldErrors,
    error,
    isSubmitting,
    setIsSubmitting,
    handleChange,
    handleError,
    resetErrors,
  }
}
