
import React, { useState, useEffect } from 'react';
import { JournalEntry, MarketCondition, TradeSide, ResultType, Emotion } from '../types';
import { Save, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { analyzeTradeEntry } from '../services/geminiService';

interface JournalFormProps {
  initialData?: JournalEntry;
  onSave: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
  onDelete?: () => void;
  onCancel: () => void;
}

const initialEntry: Omit<JournalEntry, 'id' | 'timestamp'> = {
  planNo: '',
  date: new Date().toISOString().split('T')[0],
  symbol: '',
  entryTime: '',
  exitTime: '',
  marketCondition: MarketCondition.SIDEWAYS,
  emotion: '',
  confidence: 50,
  side: TradeSide.BUY_LONG,
  entryPrice: 0,
  lotSize: 0,
  stopLoss: 0,
  takeProfit: 0,
  actualClosePrice: 0,
  resultType: ResultType.PROFIT,
  pnlAmount: 0,
  pnlPercent: 0,
  logic: '',
  followedPlan: true,
  followedPlanReason: '',
  movedSLTP: false,
  movedSLTPReason: '',
  mistakes: '',
  keyLearning: '',
  aiFeedback: ''
};

export const JournalForm: React.FC<JournalFormProps> = ({ onSave, onCancel, onDelete, initialData }) => {
  const [formData, setFormData] = useState(initialEntry);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      const { id, timestamp, ...rest } = initialData;
      setFormData(rest);
    } else {
      setFormData(initialEntry);
    }
  }, [initialData]);

  const handleChange = (field: keyof JournalEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
        onSave(formData);
        setIsSaving(false);
    }, 500);
  };

  const handleAIAnalysis = async () => {
    if (!formData.symbol || !formData.logic) {
      alert("กรุณากรอกข้อมูลเหรียญและเหตุผลในการเข้าเทรดก่อนขอคำแนะนำ AI");
      return;
    }
    setIsAnalyzing(true);
    const tempEntry = { ...formData, id: 'temp', timestamp: Date.now() };
    const feedback = await analyzeTradeEntry(tempEntry);
    setFormData(prev => ({ ...prev, aiFeedback: feedback }));
    setIsAnalyzing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">
            {initialData ? 'แก้ไขบันทึก (Edit Entry)' : 'บันทึกใหม่ (New Entry)'}
        </h2>
        {initialData && onDelete && (
            <button 
                type="button" 
                onClick={onDelete}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                title="ลบบันทึก"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">ข้อมูลทั่วไป (Header)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">แผนที่ (Plan No.)</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={formData.planNo}
              onChange={(e) => handleChange('planNo', e.target.value)}
              placeholder="e.g. 001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">วันที่ (Date)</label>
            <input 
              type="date" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">เหรียญ/สินค้า (Symbol)</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase"
              value={formData.symbol}
              onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
              placeholder="BTCUSD, XAUUSD"
              required
            />
          </div>
        </div>
      </div>

      {/* Section 1: Context */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">1. สภาวะตลาดและอารมณ์ (Context)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">เวลาเข้า (Entry Time)</label>
            <input 
              type="time" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-indigo-500"
              value={formData.entryTime}
              onChange={(e) => handleChange('entryTime', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">เวลาออก (Exit Time)</label>
            <input 
              type="time" 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-indigo-500"
              value={formData.exitTime}
              onChange={(e) => handleChange('exitTime', e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">สภาวะตลาด (Market)</label>
            <select 
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-indigo-500"
              value={formData.marketCondition}
              onChange={(e) => handleChange('marketCondition', e.target.value)}
            >
              {Object.values(MarketCondition).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">อารมณ์ (Emotion)</label>
            <select
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-indigo-500"
                value={formData.emotion}
                onChange={(e) => handleChange('emotion', e.target.value)}
            >
                <option value="">เลือกอารมณ์...</option>
                {Object.values(Emotion).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ความมั่นใจ (Confidence %)</label>
            <div className="flex items-center gap-2">
                <input 
                    type="range" 
                    min="0" max="100" 
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    value={formData.confidence}
                    onChange={(e) => handleChange('confidence', parseInt(e.target.value))}
                />
                <span className="text-sm font-bold text-indigo-600 w-10">{formData.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Trade Setup */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">2. Trade Setup (ข้อมูลการเข้าออเดอร์)</h2>
        
        {/* Row 1: Side & Lot */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ฝั่ง (Side)</label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => handleChange('side', TradeSide.BUY_LONG)}
                        className={`flex-1 py-2 rounded-lg font-bold border ${formData.side === TradeSide.BUY_LONG ? 'bg-emerald-100 border-emerald-500 text-emerald-700' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                    >
                        BUY / Long
                    </button>
                    <button
                        type="button"
                        onClick={() => handleChange('side', TradeSide.SELL_SHORT)}
                        className={`flex-1 py-2 rounded-lg font-bold border ${formData.side === TradeSide.SELL_SHORT ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-slate-300 text-slate-500 hover:bg-slate-50'}`}
                    >
                        SELL / Short
                    </button>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lot Size</label>
                <input 
                    type="number" 
                    step="0.01"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-indigo-500"
                    value={formData.lotSize}
                    onChange={(e) => handleChange('lotSize', parseFloat(e.target.value))}
                />
            </div>
        </div>

        {/* Row 2: Prices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ราคาเข้า (Entry)</label>
                <input 
                    type="number" step="0.00001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-indigo-500"
                    value={formData.entryPrice}
                    onChange={(e) => handleChange('entryPrice', parseFloat(e.target.value))}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stop Loss (SL)</label>
                <input 
                    type="number" step="0.00001"
                    className="w-full px-3 py-2 bg-slate-50 border border-red-200 rounded-lg focus:ring-red-500 focus:border-red-500 text-red-600"
                    value={formData.stopLoss}
                    onChange={(e) => handleChange('stopLoss', parseFloat(e.target.value))}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Take Profit (TP)</label>
                <input 
                    type="number" step="0.00001"
                    className="w-full px-3 py-2 bg-slate-50 border border-emerald-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 text-emerald-600"
                    value={formData.takeProfit}
                    onChange={(e) => handleChange('takeProfit', parseFloat(e.target.value))}
                />
            </div>
        </div>

        {/* Row 3: Result */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <label className="block text-sm font-bold text-slate-700 mb-3">ผลลัพธ์การเทรด (Result)</label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                     <label className="block text-xs text-slate-500 mb-1">ราคาปิดจริง (Close)</label>
                     <input 
                        type="number" step="0.00001"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                        value={formData.actualClosePrice}
                        onChange={(e) => handleChange('actualClosePrice', parseFloat(e.target.value))}
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-500 mb-1">ผลแพ้ชนะ</label>
                    <select
                        className={`w-full px-3 py-2 border rounded-lg font-medium ${formData.resultType === ResultType.PROFIT ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : formData.resultType === ResultType.LOSS ? 'text-red-600 border-red-200 bg-red-50' : 'text-slate-600 border-slate-200 bg-white'}`}
                        value={formData.resultType}
                        onChange={(e) => handleChange('resultType', e.target.value)}
                    >
                        {Object.values(ResultType).map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs text-slate-500 mb-1">จำนวนเงิน (Amount)</label>
                    <input 
                        type="number" step="0.01"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        value={formData.pnlAmount}
                        onChange={(e) => handleChange('pnlAmount', parseFloat(e.target.value))}
                        placeholder="0.00"
                    />
                </div>
                <div>
                    <label className="block text-xs text-slate-500 mb-1">% พอร์ต (% Port)</label>
                    <input 
                        type="number" step="0.1"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                        value={formData.pnlPercent}
                        onChange={(e) => handleChange('pnlPercent', parseFloat(e.target.value))}
                        placeholder="%"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Section 3: Logic */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-lg font-bold text-slate-800">3. เหตุผลในการเข้าเทรด (Logic)</h2>
            <button 
                type="button" 
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-md text-sm font-medium hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                วิเคราะห์ด้วย AI
            </button>
        </div>
        
        <textarea 
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-indigo-500 h-32 resize-none"
            placeholder="อธิบาย Setup, Indicator ที่ใช้, หรือปัจจัยพื้นฐาน..."
            value={formData.logic}
            onChange={(e) => handleChange('logic', e.target.value)}
            required
        />

        {/* AI Feedback Display */}
        {formData.aiFeedback && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-lg animate-in fade-in slide-in-from-top-2">
                <h4 className="flex items-center gap-2 text-sm font-bold text-purple-800 mb-2">
                    <Sparkles className="w-4 h-4" /> AI Feedback:
                </h4>
                <div className="text-sm text-purple-900 leading-relaxed whitespace-pre-line">
                    {formData.aiFeedback}
                </div>
            </div>
        )}
      </div>

      {/* Section 4: Review */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">4. การบริหารจัดการและบทเรียน (Review)</h2>
        
        <div className="space-y-6">
            {/* Follow Plan */}
            <div>
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium text-slate-700">ทำตามแผน 100% หรือไม่?</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" name="followedPlan"
                            checked={formData.followedPlan === true}
                            onChange={() => handleChange('followedPlan', true)}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm">ทำตาม</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" name="followedPlan"
                            checked={formData.followedPlan === false}
                            onChange={() => handleChange('followedPlan', false)}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm">ไม่ทำตาม</span>
                    </label>
                </div>
                {!formData.followedPlan && (
                    <input 
                        type="text"
                        placeholder="เพราะ..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm mt-1"
                        value={formData.followedPlanReason}
                        onChange={(e) => handleChange('followedPlanReason', e.target.value)}
                    />
                )}
            </div>

            {/* Moved SL/TP */}
            <div>
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-sm font-medium text-slate-700">มีการเลื่อน SL/TP ระหว่างทางไหม?</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" name="movedSLTP"
                            checked={formData.movedSLTP === true}
                            onChange={() => handleChange('movedSLTP', true)}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm">มี</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="radio" name="movedSLTP"
                            checked={formData.movedSLTP === false}
                            onChange={() => handleChange('movedSLTP', false)}
                            className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm">ไม่มี</span>
                    </label>
                </div>
                {formData.movedSLTP && (
                    <input 
                        type="text"
                        placeholder="เพราะ..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm mt-1"
                        value={formData.movedSLTPReason}
                        onChange={(e) => handleChange('movedSLTPReason', e.target.value)}
                    />
                )}
            </div>

            {/* Text Areas */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ข้อผิดพลาด (Mistakes)</label>
                <textarea 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg h-20 resize-none text-sm"
                    placeholder="เช่น เข้าเร็วไป, ออกช้าไป, หลุดวินัย..."
                    value={formData.mistakes}
                    onChange={(e) => handleChange('mistakes', e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">บทเรียนจากไม้นี้ (Key Learning)</label>
                <textarea 
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg h-20 resize-none text-sm"
                    placeholder="สิ่งที่ได้เรียนรู้..."
                    value={formData.keyLearning}
                    onChange={(e) => handleChange('keyLearning', e.target.value)}
                />
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 pb-12">
        <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
        >
            ยกเลิก
        </button>
        <button
            type="submit"
            disabled={isSaving}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {initialData ? 'บันทึกการแก้ไข' : 'บันทึก Journal'}
        </button>
      </div>
    </form>
  );
};
