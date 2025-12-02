import React, { useRef } from 'react';
import { ReferenceImage } from '../types';

interface ReferenceUploaderProps {
  images: ReferenceImage[];
  setImages: React.Dispatch<React.SetStateAction<ReferenceImage[]>>;
}

export const ReferenceUploader: React.FC<ReferenceUploaderProps> = ({ images, setImages }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          // Extract base64 data and mime type
          // data:image/jpeg;base64,.....
          const match = result.match(/^data:(.+);base64,(.+)$/);
          if (match) {
            const newImage: ReferenceImage = {
              id: Math.random().toString(36).substr(2, 9),
              mimeType: match[1],
              data: match[2]
            };
            setImages(prev => [...prev, newImage]);
          }
        }
      };
      reader.readAsDataURL(file as Blob);
    });
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-gray-850 p-4 border-r border-gray-750">
      <h2 className="text-xl font-bold mb-2 text-primary-400">1. Character Identity</h2>
      <p className="text-xs text-gray-400 mb-4">Upload varied angles (Face, Body, Side) to establish consistency.</p>
      
      <div 
        className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-gray-800 transition-colors mb-4"
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          accept="image/*"
          onChange={handleFileUpload}
        />
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <span className="text-sm font-medium text-gray-300">Click to Upload Reference</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 gap-2 content-start">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded overflow-hidden border border-gray-700">
            <img 
              src={`data:${img.mimeType};base64,${img.data}`} 
              alt="Reference" 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-red-500/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-2 text-center text-gray-500 text-sm italic mt-10">
            No reference images added yet.
          </div>
        )}
      </div>
    </div>
  );
};