
import React, { useMemo } from 'react';
import { JournalEntry, ResultType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, Activity } from 'lucide-react';

interface DashboardProps {
  entries: JournalEntry[];
}

export const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const stats = useMemo(() => {
    const totalTrades = entries.length;
    if (totalTrades === 0) return null;

    const wins = entries.filter(e => e.resultType === ResultType.PROFIT).length;
    const losses = entries.filter(e => e.resultType === ResultType.LOSS).length;
    const winRate = (wins / totalTrades) * 100;
    
    const totalPnL = entries.reduce((acc, curr) => {
        return curr.resultType === ResultType.PROFIT ? acc + curr.pnlAmount : acc - Math.abs(curr.pnlAmount);
    }, 0);

    // Recent 10 trades for chart
    const recentTrades = [...entries].sort((a, b) => a.timestamp - b.timestamp).slice(-10).map(e => ({
      name: e.symbol,
      pnl: e.resultType === ResultType.PROFIT ? e.pnlAmount : -Math.abs(e.pnlAmount),
      result: e.resultType
    }));

    return { totalTrades, wins, losses, winRate, totalPnL, recentTrades };
  }, [entries]);

  if (!stats) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
        <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600">ยังไม่มีข้อมูลการเทรด</h3>
        <p className="text-slate-400">เริ่มบันทึกการเทรดครั้งแรกของคุณเพื่อดูสถิติ</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Trades */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">จำนวนเทรดทั้งหมด</h3>
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.totalTrades}</div>
          <p className="text-xs text-slate-400 mt-1">ไม้</p>
        </div>

        {/* Win Rate */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">Win Rate</h3>
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-800">{stats.winRate.toFixed(1)}%</div>
          <p className="text-xs text-slate-400 mt-1">ชนะ {stats.wins} / แพ้ {stats.losses}</p>
        </div>

        {/* Total PnL */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-500">กำไร/ขาดทุน สุทธิ</h3>
            <div className={`p-2 rounded-lg ${stats.totalPnL >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
              {stats.totalPnL >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-600" />
              )}
            </div>
          </div>
          <div className={`text-3xl font-bold ${stats.totalPnL >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {stats.totalPnL > 0 ? '+' : ''}{stats.totalPnL.toLocaleString()}
          </div>
          <p className="text-xs text-slate-400 mt-1">บาท (Currency)</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">ผลประกอบการ 10 ไม้ล่าสุด</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.recentTrades}>
              <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{fill: '#f1f5f9'}}
              />
              <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                {stats.recentTrades.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
