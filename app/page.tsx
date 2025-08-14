"use client";

import { useState } from 'react';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [market, setMarket] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain, market }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
            SEO Live Audit
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
              Domain
            </label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="market" className="block text-sm font-medium text-gray-700">
              Market/Country
            </label>
            <input
              id="market"
              type="text"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              placeholder="US, UK, DE, etc."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Running Audit...' : 'Run SEO Audit'}
          </button>
        </form>
        
        {result && (
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Audit Results</h2>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
