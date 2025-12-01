export function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  error,
  required = false,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword,
  helperText,
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="block text-sm font-bold text-gray-700">{label}</label>
        {helperText && <span className="text-xs text-gray-400">{helperText}</span>}
      </div>
      <div className="relative">
        {icon && (
          <i className={`${icon} absolute left-4 top-1/2 -translate-y-1/2 text-gray-400`}></i>
        )}
        <input
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full ${icon ? 'pl-11' : 'pl-4'} ${
            showPasswordToggle ? 'pr-12' : 'pr-4'
          } py-3 bg-white border rounded-xl focus:outline-none transition-all ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 focus:border-primary focus:ring-2 focus:ring-green-100'
          }`}
          placeholder={placeholder}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  )
}
