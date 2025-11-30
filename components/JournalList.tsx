
import React from 'react';
import { JournalEntry, ResultType, TradeSide } from '../types';
import { ArrowUpRight, ArrowDownRight, Calendar, AlertCircle, ChevronRight, Download } from 'lucide-react';

interface JournalListProps {
  entries: JournalEntry[];
  onSelect: (entry: JournalEntry) => void;
}

export const JournalList: React.FC<JournalListProps> = ({ entries, onSelect }) => {
  const handleExport = () => {
    // Define headers
    const headers = [
      "Plan No",
      "Date",
      "Time",
      "Symbol",
      "Side",
      "Result",
      "PnL Amount",
      "PnL %",
      "Entry Price",
      "Exit Price",
      "Lot Size",
      "Market",
      "Emotion",
      "Mistakes",
      "Logic"
    ];

    // Map entries to rows
    const rows = entries.map(e => [
      e.planNo,
      e.date,
      e.entryTime,
      e.symbol,
      e.side,
      e.resultType,
      e.pnlAmount,
      e.pnlPercent,
      e.entryPrice,
      e.actualClosePrice,
      e.lotSize,
      e.marketCondition,
      e.emotion,
      `"${(e.mistakes || '').replace(/"/g, '""')}"`, // Escape quotes
      `"${(e.logic || '').replace(/"/g, '""')}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    // Create download link with BOM for Excel support
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smart_protrader_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-slate-100">
        <AlertCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-600">ยังไม่มีบันทึกการเทรด</h3>
        <p className="text-slate-400">สร้างบันทึกแรกของคุณเพื่อเริ่มเก็บข้อมูล</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
      <div className="grid gap-4">
        {entries.map((entry) => (
          <div 
              key={entry.id} 
              onClick={() => onSelect(entry)}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${entry.side === TradeSide.BUY_LONG ? 'bg-emerald-100' : 'bg-red-100'}`}>
                      {entry.side === TradeSide.BUY_LONG ? (
                          <ArrowUpRight className={`w-5 h-5 ${entry.side === TradeSide.BUY_LONG ? 'text-emerald-600' : 'text-red-600'}`} />
                      ) : (
                          <ArrowDownRight className={`w-5 h-5 ${entry.side === TradeSide.BUY_LONG ? 'text-emerald-600' : 'text-red-600'}`} />
                      )}
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-800">{entry.symbol}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>{entry.date}</span>
                          <span>•</span>
                          <span>{entry.entryTime}</span>
                      </div>
                  </div>
              </div>
              <div className="text-right">
                  <div className={`font-bold ${entry.resultType === ResultType.PROFIT ? 'text-emerald-600' : entry.resultType === ResultType.LOSS ? 'text-red-600' : 'text-slate-500'}`}>
                      {entry.resultType === ResultType.PROFIT ? '+' : ''}{entry.pnlAmount.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-400">{entry.resultType}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
              <div className="flex gap-4 text-xs text-slate-500">
                  <span>Setup: <span className="font-medium text-slate-700">{entry.entryPrice}</span></span>
                  <span>Vol: <span className="font-medium text-slate-700">{entry.lotSize}</span></span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
