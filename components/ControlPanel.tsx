import React from 'react';
import { GenerationParams, AspectRatio, RenderMode, LightingStyle, CAMERA_ANGLES } from '../types';

interface ControlPanelProps {
  params: GenerationParams;
  setParams: React.Dispatch<React.SetStateAction<GenerationParams>>;
  onGenerate: () => void;
  isGenerating: boolean;
  hasReferences: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ 
  params, 
  setParams, 
  onGenerate, 
  isGenerating,
  hasReferences
}) => {
  
  const handleChange = <K extends keyof GenerationParams>(key: K, value: GenerationParams[K]) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-1 text-primary-400">2. Scene Composition</h2>
        <p className="text-xs text-gray-400">Describe the scene and configure the virtual camera.</p>
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Scene Description</label>
        <textarea
          value={params.prompt}
          onChange={(e) => handleChange('prompt', e.target.value)}
          placeholder="E.g., Heroic portrait on a mountain summit at sunrise, wearing sci-fi armor..."
          className="w-full h-32 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm placeholder-gray-500"
        />
      </div>

      {/* Camera & Angle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">Camera Angle</label>
          <div className="relative">
            <select
              value={params.cameraAngle}
              onChange={(e) => handleChange('cameraAngle', e.target.value)}
              className="block appearance-none w-full bg-gray-800 border border-gray-600 text-white py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-750 focus:border-gray-500"
            >
              {CAMERA_ANGLES.map(angle => (
                <option key={angle} value={angle}>{angle}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wide text-gray-500 font-bold mb-2">Aspect Ratio</label>
          <div className="relative">
            <select
              value={params.aspectRatio}
              onChange={(e) => handleChange('aspectRatio', e.target.value as AspectRatio)}
              className="block appearance-none w-full bg-gray-800 border border-gray-600 text-white py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-gray-750 focus:border-gray-500"
            >
              <option value={AspectRatio.Square}>1:1 (Square)</option>
              <option value={AspectRatio.Standard}>3:2 (Standard)</option>
              <option value={AspectRatio.Widescreen}>16:9 (Widescreen)</option>
              <option value={AspectRatio.Portrait}>2:3 (Portrait)</option>
              <option value={AspectRatio.Tall}>9:16 (Social)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="border-t border-gray-700 pt-4 mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Advanced Controls</label>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
           <div>
            <label className="block text-xs text-gray-400 mb-1">Lighting</label>
            <select
              value={params.lighting}
              onChange={(e) => handleChange('lighting', e.target.value as LightingStyle)}
              className="w-full bg-gray-800 border border-gray-600 text-gray-200 text-xs py-1.5 px-2 rounded"
            >
              {Object.values(LightingStyle).map(l => <option key={l} value={l}>{l}</option>)}
            </select>
           </div>
           <div>
            <label className="block text-xs text-gray-400 mb-1">Style</label>
            <select
              value={params.renderMode}
              onChange={(e) => handleChange('renderMode', e.target.value as RenderMode)}
              className="w-full bg-gray-800 border border-gray-600 text-gray-200 text-xs py-1.5 px-2 rounded"
            >
              {Object.values(RenderMode).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 bg-gray-800 p-2 rounded border border-gray-700">
             <input 
              type="checkbox"
              id="transparentMode"
              checked={params.isTransparentMode}
              onChange={(e) => handleChange('isTransparentMode', e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-gray-700 border-gray-500 rounded focus:ring-primary-500 focus:ring-1"
             />
             <label htmlFor="transparentMode" className="text-xs text-gray-300 cursor-pointer select-none">Transparent BG Mode</label>
          </div>
           <div>
            <select
              value={params.resolution}
              onChange={(e) => handleChange('resolution', e.target.value as any)}
              className="w-full bg-gray-800 border border-gray-600 text-gray-200 text-xs py-2 px-2 rounded"
            >
              <option value="1K">1024x1024 (1K)</option>
              <option value="2K">2048x2048 (2K)</option>
              <option value="4K">4096x2160 (4K)</option>
            </select>
           </div>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !hasReferences || !params.prompt}
          className={`w-full py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform active:scale-95
            ${!hasReferences 
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
              : isGenerating
                ? 'bg-primary-600/50 text-white cursor-wait animate-pulse'
                : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-primary-500/30'
            }
          `}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Synthesizing...
            </span>
          ) : !hasReferences ? (
            "Upload Reference Images First"
          ) : (
            "Generate with Nano Banana Pro"
          )}
        </button>
      </div>
    </div>
  );
};