import React, { useState } from 'react';
import { ReferenceUploader } from './components/ReferenceUploader';
import { ControlPanel } from './components/ControlPanel';
import { ImagePreview } from './components/ImagePreview';
import { generateCharacterImage } from './services/geminiService';
import { 
  ReferenceImage, 
  GenerationParams, 
  GeneratedImage, 
  AspectRatio, 
  RenderMode, 
  LightingStyle 
} from './types';

const App: React.FC = () => {
  // --- State ---
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  
  const [params, setParams] = useState<GenerationParams>({
    prompt: '',
    cameraAngle: "Eye Level",
    aspectRatio: AspectRatio.Widescreen,
    renderMode: RenderMode.Cinematic,
    lighting: LightingStyle.CinematicWarm,
    isTransparentMode: false,
    resolution: "1K"
  });

  const [generatedHistory, setGeneratedHistory] = useState<GeneratedImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---

  const handleGenerate = async () => {
    if (referenceImages.length === 0) return;
    if (!params.prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateCharacterImage(referenceImages, params);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: params.prompt,
        timestamp: Date.now(),
        params: { ...params } // store snapshot of params used
      };

      setGeneratedHistory(prev => [newImage, ...prev]);
      setSelectedImageId(newImage.id);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate image. Ensure you have an API key selected.");
    } finally {
      setIsGenerating(false);
    }
  };

  const currentImage = generatedHistory.find(img => img.id === selectedImageId) || generatedHistory[0] || null;

  return (
    <div className="flex h-screen bg-black text-gray-200 font-sans overflow-hidden">
      
      {/* Toast Error */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce">
          {error}
          <button onClick={() => setError(null)} className="ml-4 font-bold text-white/70 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="flex w-full h-full max-w-[1920px] mx-auto">
        
        {/* Left Panel: References (20%) */}
        <div className="w-1/5 min-w-[250px] h-full flex flex-col">
          <div className="p-4 bg-gray-900 border-b border-gray-700">
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              CHARACTER FORGE
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Consistency Engine</p>
          </div>
          <div className="flex-1 overflow-hidden">
             <ReferenceUploader images={referenceImages} setImages={setReferenceImages} />
          </div>
        </div>

        {/* Center Panel: Controls (30%) */}
        <div className="w-[30%] min-w-[320px] h-full bg-gray-900 border-r border-gray-700 flex flex-col">
           <ControlPanel 
             params={params}
             setParams={setParams}
             onGenerate={handleGenerate}
             isGenerating={isGenerating}
             hasReferences={referenceImages.length > 0}
           />
        </div>

        {/* Right Panel: Preview (50%) */}
        <div className="flex-1 h-full min-w-[400px]">
           <ImagePreview 
             currentImage={currentImage} 
             history={generatedHistory}
             onSelectHistory={(img) => setSelectedImageId(img.id)}
           />
        </div>

      </div>
    </div>
  );
};

export default App;