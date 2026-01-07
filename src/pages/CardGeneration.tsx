import { useState } from 'react';
import { Copy, Check, CreditCard, AlertCircle } from 'lucide-react';

export default function CardGeneration() {
  const [formData, setFormData] = useState({
    amount_limit: '5000',
    currency: 'TRY',
    expiry_months: '24',
    provider: 'Sipay',
    merchant_restriction: '',
    card_holder: '',
  });
  const [copiedRequest, setCopiedRequest] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  const exampleRequest = {
    amount_limit: 5000,
    currency: 'TRY',
    expiry_months: 24,
    provider: 'Sipay',
    merchant_restriction: 'E-commerce',
    card_holder: 'INTERNAL TEAM',
  };

  const exampleResponse = {
    success: true,
    data: {
      card_id: '550e8400-e29b-41d4-a716-446655440000',
      card_number: '5450 **** **** 1234',
      card_holder: 'INTERNAL TEAM',
      expiry_date: '12/26',
      cvv: '***',
      amount_limit: 5000,
      currency: 'TRY',
      provider: 'Sipay',
      status: 'active',
      created_at: '2024-01-07T10:30:00Z',
      expires_at: '2026-12-31T23:59:59Z',
    },
  };

  const copyToClipboard = (text: string, type: 'request' | 'response') => {
    navigator.clipboard.writeText(text);
    if (type === 'request') {
      setCopiedRequest(true);
      setTimeout(() => setCopiedRequest(false), 2000);
    } else {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Card Generation API</h1>
        <p className="text-slate-400">Generate virtual credit cards with custom parameters and restrictions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            Card Parameters
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Amount Limit (TRY)
              </label>
              <input
                type="number"
                name="amount_limit"
                value={formData.amount_limit}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="TRY">TRY - Turkish Lira</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Expiry (Months)
              </label>
              <input
                type="number"
                name="expiry_months"
                value={formData.expiry_months}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Provider
              </label>
              <select
                name="provider"
                value={formData.provider}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Sipay">Sipay</option>
                <option value="İşbank Turkey">İşbank Turkey</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Merchant Restriction (Optional)
              </label>
              <input
                type="text"
                name="merchant_restriction"
                value={formData.merchant_restriction}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="E-commerce, Travel, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Card Holder Name
              </label>
              <input
                type="text"
                name="card_holder"
                value={formData.card_holder}
                onChange={handleInputChange}
                className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="INTERNAL TEAM"
              />
            </div>

            <button
              type="button"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Generate Virtual Card
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-400">
                <p className="font-medium mb-1">Important Notes:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-300">
                  <li>Maximum limit: ₺100,000 for İşbank</li>
                  <li>Minimum limit: ₺100 for Sipay</li>
                  <li>Cards expire automatically after set period</li>
                  <li>All cards use TRY currency only</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Example Request</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(exampleRequest, null, 2), 'request')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                {copiedRequest ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-emerald-400">{JSON.stringify(exampleRequest, null, 2)}</code>
            </pre>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Example Response</h3>
              <button
                onClick={() => copyToClipboard(JSON.stringify(exampleResponse, null, 2), 'response')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                {copiedResponse ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 overflow-x-auto text-sm">
              <code className="text-blue-400">{JSON.stringify(exampleResponse, null, 2)}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
