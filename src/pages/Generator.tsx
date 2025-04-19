import React, { useState } from 'react';
import { Camera, Loader2, ImageIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Generator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const user = useAuthStore((state) => state.user);

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError('Please enter a product description');
      return;
    }

    if (!user || user.apiTokens <= 0) {
      setError('No API tokens available. Please request more tokens.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          prompt: `Professional product photography of ${prompt}. High resolution, studio lighting, white background, commercial quality`,
          n: 1,
          size: '1024x1024'
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      setResult(data.data[0].url);
    } catch (err) {
      setError('Failed to generate image. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Camera className="w-8 h-8 text-purple-600" />
        <h1 className="text-3xl font-bold text-gray-900">Product Photography Generator</h1>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Product Description
            </label>
            <span className="text-sm text-gray-500">
              Tokens available: {user?.apiTokens || 0}
            </span>
          </div>
          <div className="flex gap-2">
            <input
              id="prompt"
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., a minimalist ceramic coffee mug with geometric patterns"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={generateImage}
              disabled={loading || !user?.apiTokens}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        {result && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Generated Image</h2>
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <img
                src={result}
                alt="Generated product"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Tips for better results:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Be specific about the product's materials and features</li>
            <li>Include color preferences if any</li>
            <li>Mention specific styling or composition requirements</li>
            <li>Describe the desired mood or aesthetic</li>
          </ul>
        </div>
      </div>
    </div>
  );
}