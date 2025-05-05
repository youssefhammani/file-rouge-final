// src/components/layout/Pagination.js
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Generate an array of page numbers
    const getPageNumbers = () => {
        const pageNumbers = [];

        // Always show first page
        pageNumbers.push(1);

        // Calculate range around current page
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Handle dots before current page range
        if (startPage > 2) {
            pageNumbers.push('...');
        }

        // Add page numbers around current page
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        // Handle dots after current page range
        if (endPage < totalPages - 1) {
            pageNumbers.push('...');
        }

        // Always show last page if there is more than one page
        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    // Don't show pagination if there's only one page
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex justify-center items-center py-6">
            <nav className="flex items-center">
                {/* Previous button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`mx-1 px-3 py-2 rounded-md ${currentPage === 1
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    &laquo; Prev
                </button>

                {/* Page numbers */}
                <div className="flex items-center">
                    {getPageNumbers().map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                            disabled={page === '...'}
                            className={`mx-1 px-3 py-2 rounded-md ${page === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : page === '...'
                                        ? 'text-gray-500 cursor-default'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                {/* Next button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`mx-1 px-3 py-2 rounded-md ${currentPage === totalPages
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    Next &raquo;
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
