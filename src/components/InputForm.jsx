import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

export default function InputForm({ onSubmit, loading }) {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onSubmit(username.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-4">
            <div className="relative">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter GitHub Username"
                    className="w-full bg-zinc-800 border-2 border-zinc-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-white font-mono transition-colors"
                    disabled={loading}
                />
                <Search className="absolute right-3 top-3.5 text-zinc-500" size={20} />
            </div>

            <button
                type="submit"
                disabled={loading || !username}
                className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 font-mono"
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin" size={20} />
                        PRINTING...
                    </>
                ) : (
                    'GENERATE RECEIPT'
                )}
            </button>
        </form>
    );
}
