import React from 'react';
import { GeneratedImage } from '../types';

interface ImagePreviewProps {
  currentImage: GeneratedImage | null;
  history: GeneratedImage[];
  onSelectHistory: (img: GeneratedImage) => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ currentImage, history, onSelectHistory }) => {
  
  const handleDownload = (format: 'scene' | 'transparent') => {
    if (!currentImage) return;

    // In a real backend scenario, we might request a different version.
    // Here we download the generated image. 
    // If the user selected 'transparent mode', the image is already optimized for it.
    
    const link = document.createElement('a');
    link.href = currentImage.url;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `character-forge-${format}-${timestamp}.png`;
    
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-gray-950 border-l border-gray-750">
      <div className="p-6 pb-2">
        <h2 className="text-xl font-bold text-primary-400 mb-1">3. Result Preview</h2>
        <p className="text-xs text-gray-400">High-fidelity output from Nano Banana Pro.</p>
      </div>

      <div className="flex-1 flex flex-col p-6 min-h-0">
        {/* Main Display */}
        <div className="flex-1 bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden relative shadow-2xl">
          {currentImage ? (
            <img 
              src={currentImage.url} 
              alt="Generated Result" 
              className="max-w-full max-h-full object-contain shadow-lg"
            />
          ) : (
            <div className="text-center text-gray-600">
              <svg className="mx-auto h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">Ready to Generate</p>
            </div>
          )}
          
          {/* Watermark */}
          {currentImage && (
             <div className="absolute bottom-2 right-2 text-[10px] text-white/40 font-mono pointer-events-none">
               Powered by Google AI Studio + Nano Banana Pro
             </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-4">
           <button 
             onClick={() => handleDownload('scene')}
             disabled={!currentImage}
             className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-md font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
             </svg>
             Download Full Scene
           </button>
           <button 
             onClick={() => handleDownload('transparent')}
             disabled={!currentImage}
             className="flex-1 border border-gray-600 hover:bg-gray-800 text-gray-300 py-3 px-4 rounded-md font-medium text-sm transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
             </svg>
             Download {currentImage?.params.isTransparentMode ? '(Trans)' : '(Crop)'}
           </button>
        </div>
      </div>

      {/* Mini History Gallery */}
      <div className="h-24 bg-gray-900 border-t border-gray-800 p-2 flex space-x-2 overflow-x-auto items-center">
         {history.map((img) => (
           <button 
             key={img.id}
             onClick={() => onSelectHistory(img)}
             className={`relative min-w-[4rem] h-16 rounded overflow-hidden border-2 transition-all ${currentImage?.id === img.id ? 'border-primary-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
           >
             <img src={img.url} className="w-full h-full object-cover" alt="History thumbnail" />
           </button>
         ))}
      </div>
    </div>
  );
};