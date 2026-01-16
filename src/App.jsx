import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, Github } from 'lucide-react';
import InputForm from './components/InputForm';
import Receipt from './components/Receipt';
import { fetchGitHubData } from './utils/github';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const receiptRef = useRef(null);

  const handleGenerate = async (username) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const receiptData = await fetchGitHubData(username);
      setData(receiptData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher resolution
        backgroundColor: null, // Transparent background for the container
        useCORS: true, // Allow loading cross-origin images (avatars)
      });

      const link = document.createElement('a');
      link.download = `git-receipt-${data.user.login}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tighter flex items-center justify-center gap-3">
            <Github className="w-10 h-10" />
            GitReceipt
          </h1>
          <p className="text-zinc-400">Turn your commits into a receipt.</p>
        </div>

        {/* Input */}
        <InputForm onSubmit={handleGenerate} loading={loading} />

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg text-center font-mono text-sm">
            {error}
          </div>
        )}

        {/* Receipt Display */}
        {data && (
          <div className="animate-print space-y-6">
            <div className="py-8">
              <Receipt ref={receiptRef} data={data} />
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-zinc-100 text-black font-bold py-3 px-4 rounded-lg hover:bg-white transition-colors flex justify-center items-center gap-2 font-mono"
            >
              <Download size={20} />
              DOWNLOAD RECEIPT
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto pt-12 text-zinc-600 text-sm font-mono">
        Built with Love.
      </footer>
    </div>
  );
}

export default App;
