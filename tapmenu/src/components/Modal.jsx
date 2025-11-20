import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md', // sm, md, lg, xl, 2xl, 3xl, full
    position = 'center', // center, bottom, full
    closeOnBackdrop = true,
    className = '',
}) {
    const modalRef = useRef(null)

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
        '2xl': 'max-w-4xl',
        '3xl': 'max-w-6xl',
        full: 'max-w-full h-full',
    }

    const positions = {
        center: 'items-center justify-center p-4',
        bottom: 'items-end justify-center sm:items-center sm:justify-center p-0 sm:p-4',
        full: 'items-center justify-center p-0',
    }

    const animations = {
        center: 'fade-in scale-in',
        bottom: 'slide-up sm:fade-in sm:scale-in',
        full: 'fade-in',
    }

    const contentClasses = `
    bg-white w-full relative flex flex-col shadow-2xl
    ${position === 'bottom' ? 'rounded-t-[2rem] sm:rounded-2xl max-h-[85vh] sm:max-h-[90vh]' : 'rounded-2xl max-h-[90vh]'}
    ${position === 'full' ? 'h-full rounded-none max-h-full' : ''}
    ${sizes[size] || sizes.md}
    ${className}
  `

    return createPortal(
        <div className={`fixed inset-0 z-50 flex ${positions[position] || positions.center}`}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={closeOnBackdrop ? onClose : undefined}
            ></div>

            {/* Modal Content */}
            <div
                ref={modalRef}
                className={`${contentClasses} ${animations[position] || animations.center} z-10`}
                role="dialog"
                aria-modal="true"
            >
                {/* Handle bar for mobile bottom sheet */}
                {position === 'bottom' && (
                    <div className="w-full flex justify-center pt-4 pb-2 sm:hidden" onClick={onClose}>
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                    </div>
                )}

                {/* Header */}
                {(title || onClose) && (
                    <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 ${position === 'full' ? 'pt-6' : ''}`}>
                        {title && <h3 className="font-bold text-lg text-dark">{title}</h3>}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 custom-scroll">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 shrink-0 rounded-b-2xl">
                        {footer}
                    </div>
                )}
            </div>
        </div>,
        document.body
    )
}
