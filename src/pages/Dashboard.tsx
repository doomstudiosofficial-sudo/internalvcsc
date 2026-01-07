import { useEffect, useState } from 'react';
import { CreditCard, TrendingUp, XCircle, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Metrics {
  totalCards: number;
  activeCards: number;
  failedTransactions: number;
  apiStatus: 'operational' | 'degraded' | 'down';
  recentTransactions: Array<{
    id: string;
    amount: number;
    merchant: string;
    status: string;
    created_at: string;
  }>;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalCards: 0,
    activeCards: 0,
    failedTransactions: 0,
    apiStatus: 'operational',
    recentTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const [cardsResult, activeCardsResult, transactionsResult, recentTransactionsResult] = await Promise.all([
        supabase.from('vcc_cards').select('*', { count: 'exact', head: true }),
        supabase.from('vcc_cards').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
        supabase.from('transactions').select('id, amount, merchant, status, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      setMetrics({
        totalCards: cardsResult.count || 0,
        activeCards: activeCardsResult.count || 0,
        failedTransactions: transactionsResult.count || 0,
        apiStatus: 'operational',
        recentTransactions: recentTransactionsResult.data || [],
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total VCCs Issued',
      value: metrics.totalCards,
      icon: CreditCard,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      title: 'Active Cards',
      value: metrics.activeCards,
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      title: 'Failed Transactions',
      value: metrics.failedTransactions,
      icon: XCircle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    {
      title: 'API Status',
      value: metrics.apiStatus.toUpperCase(),
      icon: Activity,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20',
      isStatus: true,
    },
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
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Overview of Virtual Credit Card operations and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className={`bg-slate-800/50 backdrop-blur-sm border ${stat.borderColor} rounded-xl p-6 hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.isStatus && (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  </span>
                )}
              </div>
              <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium py-3 px-4">Merchant</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Amount</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Status</th>
                <th className="text-left text-slate-400 font-medium py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                  <td className="py-3 px-4 text-white">{transaction.merchant}</td>
                  <td className="py-3 px-4 text-white">₺{transaction.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'success'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : transaction.status === 'failed'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">Provider Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-white font-medium">Sipay</span>
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
              <span className="text-white font-medium">İşbank Turkey</span>
              <span className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-medium py-2 px-4 rounded-lg transition-all">
              Generate New VCC
            </button>
            <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 font-medium py-2 px-4 rounded-lg transition-all">
              View API Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
