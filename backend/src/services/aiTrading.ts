import axios from 'axios';
import StockData from '../models/stockData';
import  PortfolioHolding  from '../models/portfolio';
import { PaperTradeModel } from '../models/paperTrade';

interface AIAnalysisResult {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidenceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  keyFactors: string[];
  suggestedPrice?: number;
  stopLoss?: number;
  target?: number;
}

class AITradingService {
  private aiChatbotEndpoint: string;

  constructor() {
    // Your AI chatbot API endpoint from routes/aiChat.ts
    this.aiChatbotEndpoint = process.env.AI_CHATBOT_URL || 'http://localhost:5001/api/ai/chat';
  }

  // Get AI analysis for a stock before trading
  async getStockAnalysis(symbol: string, userId?: string): Promise<AIAnalysisResult> {
    try {
      // Fetch historical stock data
      const stockHistory = await StockData.find({ symbol })
        .sort({ timestamp: -1 })
        .limit(30) // Last 30 data points
        .lean();

      if (stockHistory.length === 0) {
        throw new Error(`No data available for ${symbol}`);
      }

      const latestStock = stockHistory[0];
      
      // Calculate technical indicators
      const prices = stockHistory.map(s => s.price);
      const sma5 = this.calculateSMA(prices, 5);
      const sma10 = this.calculateSMA(prices, 10);
      const rsi = this.calculateRSI(prices, 14);
      const volatility = this.calculateVolatility(prices);

      // Prepare AI prompt
      const prompt = `
You are an expert stock analyst. Analyze the following stock and provide trading recommendation:

Stock: ${latestStock.name} (${symbol})
Current Price: ₹${latestStock.price}
Category: ${latestStock.category}

Recent Performance:
- Open: ₹${latestStock.open}
- High: ₹${latestStock.high}
- Low: ₹${latestStock.low}
- Previous Close: ₹${latestStock.previousClose}
- Change: ₹${latestStock.change} (${latestStock.changePercent}%)
- Volume: ${latestStock.volume ? latestStock.volume.toLocaleString() : "N/A"}


Technical Indicators:
- 5-day SMA: ₹${sma5.toFixed(2)}
- 10-day SMA: ₹${sma10.toFixed(2)}
- RSI (14): ${rsi.toFixed(2)}
- Volatility: ${(volatility * 100).toFixed(2)}%

Price Trend (Last 7 days): ${prices.slice(0, 7).map(p => '₹' + p.toFixed(2)).join(', ')}

Based on this data, provide:
1. Trading recommendation (BUY/SELL/HOLD)
2. Confidence score (0-100)
3. Risk level (LOW/MEDIUM/HIGH)
4. Detailed reasoning
5. Key factors influencing the decision
6. Suggested entry price
7. Stop loss level
8. Target price

Format your response as JSON.
`;

      // Call AI chatbot API
      const aiResponse = await axios.post(this.aiChatbotEndpoint, {
        userId,
        message: prompt,
        context: 'stock_analysis'
      }, {
        timeout: 10000
      });

      // Parse AI response
      const aiAnalysis = this.parseAIResponse(aiResponse.data.response);

      return {
        recommendation: aiAnalysis.recommendation || 'HOLD',
        confidenceScore: aiAnalysis.confidenceScore || 50,
        riskLevel: aiAnalysis.riskLevel || 'MEDIUM',
        reasoning: aiAnalysis.reasoning || 'Analysis based on current market data',
        keyFactors: aiAnalysis.keyFactors || [],
        suggestedPrice: aiAnalysis.suggestedPrice || latestStock.price,
        stopLoss: aiAnalysis.stopLoss || latestStock.price * 0.95,
        target: aiAnalysis.target || latestStock.price * 1.10
      };

    } catch (error: any) {
      console.error('AI Analysis Error:', error.message);
      // Return neutral analysis if AI fails
      return this.getFallbackAnalysis(symbol);
    }
  }

  // Get portfolio analysis from AI
  async getPortfolioAnalysis(userId: string): Promise<string> {
    try {
      const portfolio = await PortfolioHolding.find({ userId }).lean();
      
      if (portfolio.length === 0) {
        return "Your portfolio is empty. Start by making your first paper trade!";
      }

      const portfolioSummary = portfolio.map(h => ({
        stock: `${h.stockName} (${h.symbol})`,
        quantity: h.quantity,
        invested: h.totalInvested,
        current: h.currentValue,
        pl: h.unrealizedPL,
        plPercent: h.unrealizedPLPercent.toFixed(2)
      }));

      const prompt = `
You are a portfolio analyst. Analyze this paper trading portfolio and provide insights:

Portfolio Holdings:
${JSON.stringify(portfolioSummary, null, 2)}

Provide:
1. Overall portfolio health assessment
2. Diversification analysis
3. Risk assessment
4. Recommendations for rebalancing
5. Which stocks to consider selling
6. Which categories to invest more in
7. Overall strategy suggestions

Keep the response concise and actionable (max 300 words).
`;

      const aiResponse = await axios.post(this.aiChatbotEndpoint, {
        userId,
        message: prompt,
        context: 'portfolio_analysis'
      }, {
        timeout: 15000
      });

      return aiResponse.data.response || 'Portfolio analysis unavailable';

    } catch (error: any) {
      console.error('Portfolio Analysis Error:', error.message);
      return 'Unable to generate portfolio analysis at this time.';
    }
  }

  // Get personalized trading insights
  async getTradingInsights(userId: string): Promise<any> {
    try {
      const recentTrades = await PaperTradeModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      const tradesSummary = {
        totalTrades: recentTrades.length,
        buyCount: recentTrades.filter(t => t.type === 'BUY').length,
        sellCount: recentTrades.filter(t => t.type === 'SELL').length,
        mostTradedSymbols: this.getMostTradedSymbols(recentTrades),
        averageTradeSize: this.getAverageTradeSize(recentTrades)
      };

      const prompt = `
Analyze this trader's behavior and provide personalized insights:

Trading Summary:
${JSON.stringify(tradesSummary, null, 2)}

Provide:
1. Trading pattern analysis
2. Strengths and weaknesses
3. Behavioral insights
4. Suggestions for improvement
5. Risk management tips

Keep response under 200 words.
`;

      const aiResponse = await axios.post(this.aiChatbotEndpoint, {
        userId,
        message: prompt,
        context: 'trading_insights'
      });

      return {
        insights: aiResponse.data.response,
        tradingSummary: tradesSummary
      };

    } catch (error: any) {
      console.error('Trading Insights Error:', error.message);
      return {
        insights: 'Trading insights unavailable',
        tradingSummary: null
      };
    }
  }

  // Technical indicator calculations
  private calculateSMA(prices: number[], period: number): number {
    if (prices.length < period) return prices[0] || 0;
    const sum = prices.slice(0, period).reduce((a, b) => a + b, 0);
    return sum / period;
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = 0; i < period; i++) {
      const change = prices[i] - prices[i + 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const returns = [];
    for (let i = 0; i < prices.length - 1; i++) {
      returns.push((prices[i] - prices[i + 1]) / prices[i + 1]);
    }

    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private parseAIResponse(response: string): any {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch {
      return {};
    }
  }

  private getFallbackAnalysis(symbol: string): AIAnalysisResult {
    return {
      recommendation: 'HOLD',
      confidenceScore: 50,
      riskLevel: 'MEDIUM',
      reasoning: 'Technical analysis indicates neutral market conditions. Consider waiting for clearer signals.',
      keyFactors: ['Market volatility', 'Volume analysis', 'Price trends'],
      suggestedPrice: undefined,
      stopLoss: undefined,
      target: undefined
    };
  }

  private getMostTradedSymbols(trades: any[]): string[] {
    const symbolCount: { [key: string]: number } = {};
    trades.forEach(t => {
      symbolCount[t.symbol] = (symbolCount[t.symbol] || 0) + 1;
    });
    return Object.entries(symbolCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([symbol]) => symbol);
  }

  private getAverageTradeSize(trades: any[]): number {
    if (trades.length === 0) return 0;
    const totalAmount = trades.reduce((sum, t) => sum + t.totalAmount, 0);
    return totalAmount / trades.length;
  }
}

export default new AITradingService();
