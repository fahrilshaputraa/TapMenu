import React from 'react'

export function Table({
    columns,
    data,
    keyExtractor = (item) => item.id,
    emptyState,
    isLoading = false,
    className = ''
}) {
    if (isLoading) {
        return (
            <div className="w-full p-8 text-center text-gray-500">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2"></i>
                <p>Memuat data...</p>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return emptyState || (
            <div className="w-full p-8 text-center text-gray-500">
                <p>Tidak ada data</p>
            </div>
        )
    }

    return (
        <div className={`bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {data.map((item, rowIndex) => {
                            const rowKey = keyExtractor(item) || rowIndex
                            // Allow custom row styling if needed, maybe via a prop or checking item
                            const rowClass = item._rowClass || ''

                            return (
                                <tr key={rowKey} className={`hover:bg-gray-50 transition-colors group ${rowClass}`}>
                                    {columns.map((col, colIndex) => (
                                        <td key={`${rowKey}-${colIndex}`} className={`px-6 py-4 ${col.cellClassName || ''}`}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(item, rowIndex)
                                                : item[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
