import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          {/* Loading Message */}
          <p className="mt-4 text-primary text-lg font-semibold">Loading Prediction ...</p>
    </div>
  );
};

export default Loader;
