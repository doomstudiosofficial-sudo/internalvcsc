import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function ApiDocumentation() {
  const [copiedSections, setCopiedSections] = useState<{ [key: string]: boolean }>({});

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSections({ ...copiedSections, [section]: true });
    setTimeout(() => {
      setCopiedSections({ ...copiedSections, [section]: false });
    }, 2000);
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/cards/generate',
      description: 'Generate a new virtual credit card',
      request: `{
  "amount_limit": 5000,
  "currency": "TRY",
  "expiry_months": 24,
  "provider": "Sipay",
  "merchant_restriction": "E-commerce",
  "card_holder": "INTERNAL TEAM"
}`,
      response: `{
  "success": true,
  "data": {
    "card_id": "550e8400-e29b-41d4-a716-446655440000",
    "card_number": "5450 **** **** 1234",
    "card_holder": "INTERNAL TEAM",
    "expiry_date": "12/26",
    "cvv": "***",
    "amount_limit": 5000,
    "currency": "TRY",
    "provider": "Sipay",
    "status": "active"
  }
}`,
    },
    {
      method: 'GET',
      path: '/api/v1/cards/:card_id',
      description: 'Retrieve virtual card details by ID',
      request: null,
      response: `{
  "success": true,
  "data": {
    "card_id": "550e8400-e29b-41d4-a716-446655440000",
    "card_number": "5450 **** **** 1234",
    "status": "active",
    "amount_limit": 5000,
    "last_used_at": "2024-01-07T10:30:00Z"
  }
}`,
    },
    {
      method: 'GET',
      path: '/api/v1/cards',
      description: 'List all virtual cards with pagination',
      request: null,
      response: `{
  "success": true,
  "data": {
    "cards": [...],
    "total": 50,
    "page": 1,
    "per_page": 20
  }
}`,
    },
    {
      method: 'PUT',
      path: '/api/v1/cards/:card_id/status',
      description: 'Update card status (active, blocked, inactive)',
      request: `{
  "status": "blocked"
}`,
      response: `{
  "success": true,
  "message": "Card status updated successfully"
}`,
    },
    {
      method: 'GET',
      path: '/api/v1/transactions',
      description: 'Retrieve transaction history with filters',
      request: null,
      response: `{
  "success": true,
  "data": {
    "transactions": [...],
    "total": 150,
    "failed": 12,
    "success": 138
  }
}`,
    },
  ];

  const errorCodes = [
    { code: '400', name: 'BAD_REQUEST', description: 'Invalid request parameters or missing required fields' },
    { code: '401', name: 'UNAUTHORIZED', description: 'Missing or invalid authentication credentials' },
    { code: '403', name: 'FORBIDDEN', description: 'Insufficient permissions to access resource' },
    { code: '404', name: 'NOT_FOUND', description: 'Requested card or resource does not exist' },
    { code: '409', name: 'CONFLICT', description: 'Card already exists or duplicate request' },
    { code: '422', name: 'VALIDATION_ERROR', description: 'Request validation failed' },
    { code: '429', name: 'RATE_LIMIT_EXCEEDED', description: 'Too many requests, rate limit exceeded' },
    { code: '500', name: 'INTERNAL_ERROR', description: 'Server error, contact support' },
    { code: '503', name: 'SERVICE_UNAVAILABLE', description: 'Provider service temporarily unavailable' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">API Documentation</h1>
        <p className="text-slate-400">Complete reference for VCC Portal API integration</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Base URL</h2>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <code className="text-emerald-400">https://api.vccportal.internal/v1</code>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Authentication</h2>
        <p className="text-slate-400 mb-4">All API requests must include an API key in the headers:</p>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <code className="text-blue-400">Authorization: Bearer YOUR_API_KEY</code>
            <button
              onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {copiedSections['auth'] ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <code className="text-blue-400">Content-Type: application/json</code>
            <button
              onClick={() => copyToClipboard('Content-Type: application/json', 'content-type')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {copiedSections['content-type'] ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">API Endpoints</h2>
        {endpoints.map((endpoint, index) => (
          <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`px-3 py-1 rounded-lg font-bold text-sm ${
                  endpoint.method === 'GET'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    : endpoint.method === 'POST'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}
              >
                {endpoint.method}
              </span>
              <code className="text-white font-mono">{endpoint.path}</code>
            </div>
            <p className="text-slate-400 mb-4">{endpoint.description}</p>

            {endpoint.request && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-slate-300">Request Body</h4>
                  <button
                    onClick={() => copyToClipboard(endpoint.request!, `request-${index}`)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedSections[`request-${index}`] ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm">
                  <code className="text-emerald-400">{endpoint.request}</code>
                </pre>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-300">Response</h4>
                <button
                  onClick={() => copyToClipboard(endpoint.response, `response-${index}`)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {copiedSections[`response-${index}`] ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm">
                <code className="text-blue-400">{endpoint.response}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Error Codes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-3 px-4">Code</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Name</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {errorCodes.map((error) => (
                <tr key={error.code} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono text-red-400 font-bold">{error.code}</span>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-yellow-400">{error.name}</code>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{error.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Rate Limits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h3 className="text-emerald-400 font-semibold mb-2">Sipay Provider</h3>
            <p className="text-slate-300">100 requests per minute</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h3 className="text-emerald-400 font-semibold mb-2">İşbank Provider</h3>
            <p className="text-slate-300">50 requests per minute</p>
          </div>
        </div>
      </div>
    </div>
  );
}
