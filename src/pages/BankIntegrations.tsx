import { useEffect, useState } from 'react';
import { Building2, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Provider {
  id: string;
  name: string;
  status: string;
  card_types: string[];
  min_limit: number;
  max_limit: number;
  processing_fee: number;
  integration_notes: string;
}

export default function BankIntegrations() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .order('name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processingSteps = [
    { step: 1, title: 'Request Received', description: 'API request validated and authenticated' },
    { step: 2, title: 'Provider Selection', description: 'Route to Sipay or İşbank based on parameters' },
    { step: 3, title: 'Card Generation', description: 'Virtual card created with specified limits' },
    { step: 4, title: 'Activation', description: 'Card activated and ready for transactions' },
    { step: 5, title: 'Response Sent', description: 'Card details returned to client' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Bank & Provider Integrations</h1>
        <p className="text-slate-400">Supported payment providers and integration details for Turkey-issued VCCs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{provider.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        provider.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {provider.status === 'active' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {provider.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="bg-slate-900/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-slate-400 mb-2">Supported Card Types</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.card_types.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs font-medium"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Minimum Limit</h4>
                  <p className="text-white font-semibold">₺{provider.min_limit.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Maximum Limit</h4>
                  <p className="text-white font-semibold">₺{provider.max_limit.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-slate-400 mb-1">Processing Fee</h4>
                <p className="text-white font-semibold">{provider.processing_fee}%</p>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Integration Notes</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{provider.integration_notes}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Processing Flow</h2>
        <p className="text-slate-400 mb-6">Standard workflow for VCC generation and activation</p>

        <div className="space-y-4">
          {processingSteps.map((step, index) => (
            <div key={step.step} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
              </div>
              <div className="flex-1 bg-slate-900/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-1">{step.title}</h3>
                <p className="text-slate-400 text-sm">{step.description}</p>
              </div>
              {index < processingSteps.length - 1 && (
                <div className="flex-shrink-0 self-center">
                  <ArrowRight className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Settlement Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">Sipay Settlement</span>
              <span className="text-emerald-400 font-semibold">T+0 (Instant)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">İşbank Settlement</span>
              <span className="text-blue-400 font-semibold">T+1 (Next Day)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Support & SLA</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">Response Time</span>
              <span className="text-emerald-400 font-semibold">99.9% Uptime</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded-lg">
              <span className="text-slate-300">Support Hours</span>
              <span className="text-blue-400 font-semibold">24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
