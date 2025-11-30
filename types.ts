export enum MarketCondition {
  SIDEWAYS = 'Sideways',
  UPTREND = 'Uptrend',
  DOWNTREND = 'Downtrend'
}

export enum TradeSide {
  BUY_LONG = 'BUY-Long',
  SELL_SHORT = 'SELL-Short'
}

export enum ResultType {
  PROFIT = 'Profit',
  LOSS = 'Loss',
  BREAK_EVEN = 'Break Even'
}

export enum Emotion {
  EXCITED = 'ตื่นเต้น',
  FEAR = 'กลัว',
  GREED = 'โลภ',
  NEUTRAL = 'เฉยๆ',
  TIRED = 'เหนื่อย',
  CONFIDENT = 'มั่นใจ'
}

export interface JournalEntry {
  id: string;
  timestamp: number;
  
  // Header
  planNo: string;
  date: string;
  symbol: string;

  // 1. Context
  entryTime: string;
  exitTime: string;
  marketCondition: MarketCondition;
  emotion: string; // Can be one of Enum Emotion or custom
  confidence: number; // 0-100

  // 2. Trade Setup
  side: TradeSide;
  entryPrice: number;
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
  actualClosePrice: number;
  resultType: ResultType;
  pnlAmount: number;
  pnlPercent: number;

  // 3. Logic
  logic: string;

  // 4. Review
  followedPlan: boolean;
  followedPlanReason: string;
  movedSLTP: boolean;
  movedSLTPReason: string;
  mistakes: string;
  keyLearning: string;

  // AI Analysis
  aiFeedback?: string;
}

export interface DashboardStats {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  bestTrade: number;
  worstTrade: number;
}