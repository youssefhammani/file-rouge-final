// src/components/layout/Spinner.js
import React from 'react';

const Spinner = () => {
    return (
        <div className="flex justify-center items-center py-12">
            <div className="spinner">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        </div>
    );
};

export default Spinner;
