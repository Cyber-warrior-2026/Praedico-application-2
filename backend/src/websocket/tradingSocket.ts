import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import StockData from '../models/stockData';
import PortfolioHolding from '../models/portfolio';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

interface AuthenticatedSocket {
  userId?: string;
  role?: string;
}

export class TradingSocketServer {
  private io: SocketIOServer;
  private priceUpdateInterval: NodeJS.Timeout | null = null;
  private portfolioUpdateInterval: NodeJS.Timeout | null = null;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      },
      pingTimeout: 60000,
      pingInterval: 25000
    });

    this.setupMiddleware();
    this.setupEventHandlers();
    this.startPriceUpdates();
    this.startPortfolioUpdates();
  }

  // Authentication middleware for WebSocket
  private setupMiddleware() {
    this.io.use((socket: any, next) => {
      try {
        // Get token from handshake (client sends it during connection)
        const token = socket.handshake.auth.token || socket.handshake.query.token;

        if (!token) {
          return next(new Error('Authentication token required'));
        }

        // Verify JWT token
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
        socket.userId = decoded.userId;
        socket.role = decoded.role;

        console.log(`✅ WebSocket authenticated: User ${socket.userId}`);
        next();
      } catch (error) {
        console.error('WebSocket auth error:', error);
        next(new Error('Invalid authentication token'));
      }
    });
  }

  // Setup event handlers
  private setupEventHandlers() {
    this.io.on('connection', (socket: any) => {
      console.log(`🔌 User connected: ${socket.id} (UserID: ${socket.userId})`);

      // Join user's personal room for portfolio updates
      socket.join(`user:${socket.userId}`);

      // Handle stock subscription
      socket.on('subscribe:stock', (symbol: string) => {
        if (!symbol) return;
        socket.join(`stock:${symbol.toUpperCase()}`);
        console.log(`📈 User ${socket.userId} subscribed to ${symbol}`);
        
        // Send immediate price update for subscribed stock
        this.sendImmediateStockUpdate(symbol.toUpperCase(), socket);
      });

      // Handle stock unsubscription
      socket.on('unsubscribe:stock', (symbol: string) => {
        if (!symbol) return;
        socket.leave(`stock:${symbol.toUpperCase()}`);
        console.log(`📉 User ${socket.userId} unsubscribed from ${symbol}`);
      });

      // Handle portfolio subscription
      socket.on('subscribe:portfolio', () => {
        console.log(`💼 User ${socket.userId} subscribed to portfolio updates`);
        // Send immediate portfolio update
        this.sendImmediatePortfolioUpdate(socket.userId, socket);
      });

      // Handle multiple stock subscriptions at once
      socket.on('subscribe:stocks', (symbols: string[]) => {
        if (!Array.isArray(symbols)) return;
        symbols.forEach(symbol => {
          socket.join(`stock:${symbol.toUpperCase()}`);
        });
        console.log(`📊 User ${socket.userId} subscribed to ${symbols.length} stocks`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`🔴 User disconnected: ${socket.id}`);
      });

      // Handle ping for connection health check
      socket.on('ping', () => {
        socket.emit('pong', { timestamp: Date.now() });
      });
    });
  }

  // Send immediate stock price update when user subscribes
  private async sendImmediateStockUpdate(symbol: string, socket: any) {
    try {
      const latestStock = await StockData.findOne({ symbol })
        .sort({ timestamp: -1 })
        .lean();

      if (latestStock) {
        socket.emit('price:update', {
          symbol: latestStock.symbol,
          price: latestStock.price,
          open: latestStock.open,
          high: latestStock.high,
          low: latestStock.low,
          change: latestStock.change,
          changePercent: latestStock.changePercent,
          volume: latestStock.volume,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error sending immediate stock update:', error);
    }
  }

  // Send immediate portfolio update when user subscribes
  private async sendImmediatePortfolioUpdate(userId: string, socket: any) {
    try {
      const holdings = await PortfolioHolding.find({ userId }).lean();
      
      if (holdings.length > 0) {
        const updatedHoldings = await Promise.all(
          holdings.map(async (holding) => {
            const latestStock = await StockData.findOne({ symbol: holding.symbol })
              .sort({ timestamp: -1 });
            
            if (latestStock) {
              const currentPrice = latestStock.price;
              const currentValue = currentPrice * holding.quantity;
              const unrealizedPL = (currentPrice - holding.averageBuyPrice) * holding.quantity;
              const unrealizedPLPercent = ((currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100;

              return {
                symbol: holding.symbol,
                stockName: holding.stockName,
                quantity: holding.quantity,
                averageBuyPrice: holding.averageBuyPrice,
                currentPrice,
                currentValue,
                unrealizedPL,
                unrealizedPLPercent
              };
            }
            return null;
          })
        );

        const validHoldings = updatedHoldings.filter(h => h !== null);
        const totalValue = validHoldings.reduce((sum, h) => sum + (h?.currentValue || 0), 0);
        const totalPL = validHoldings.reduce((sum, h) => sum + (h?.unrealizedPL || 0), 0);

        socket.emit('portfolio:update', {
          holdings: validHoldings,
          totalValue,
          totalPL,
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error sending immediate portfolio update:', error);
    }
  }

  // Broadcast price updates every 5 seconds
  private startPriceUpdates() {
    this.priceUpdateInterval = setInterval(async () => {
      try {
        // Get all unique symbols from connected rooms
        const rooms = this.io.sockets.adapter.rooms;
        const stockSymbols = new Set<string>();

        rooms.forEach((_, roomName) => {
          if (roomName.startsWith('stock:')) {
            stockSymbols.add(roomName.replace('stock:', ''));
          }
        });

        if (stockSymbols.size === 0) return;

        // Fetch latest prices for all subscribed stocks
        const symbols = Array.from(stockSymbols);
        const latestPrices = await StockData.aggregate([
          { $match: { symbol: { $in: symbols } } },
          { $sort: { timestamp: -1 } },
          {
            $group: {
              _id: '$symbol',
              latestDoc: { $first: '$$ROOT' }
            }
          },
          { $replaceRoot: { newRoot: '$latestDoc' } }
        ]);

        // Broadcast to respective rooms
        latestPrices.forEach((stock) => {
          this.io.to(`stock:${stock.symbol}`).emit('price:update', {
            symbol: stock.symbol,
            price: stock.price,
            open: stock.open,
            high: stock.high,
            low: stock.low,
            change: stock.change,
            changePercent: stock.changePercent,
            volume: stock.volume,
            timestamp: new Date()
          });
        });

        if (latestPrices.length > 0) {
          console.log(`📡 Broadcasted ${latestPrices.length} stock updates`);
        }

      } catch (error) {
        console.error('Error broadcasting price updates:', error);
      }
    }, 5000); // Every 5 seconds
  }

  // Broadcast portfolio updates every 10 seconds
  private startPortfolioUpdates() {
    this.portfolioUpdateInterval = setInterval(async () => {
      try {
        // Get all connected user rooms
        const rooms = this.io.sockets.adapter.rooms;
        const userIds = new Set<string>();

        rooms.forEach((_, roomName) => {
          if (roomName.startsWith('user:')) {
            userIds.add(roomName.replace('user:', ''));
          }
        });

        if (userIds.size === 0) return;

        // Update portfolios for all connected users
        for (const userId of userIds) {
          const holdings = await PortfolioHolding.find({ userId }).lean();
          
          if (holdings.length === 0) continue;

          const symbols = holdings.map(h => h.symbol);
          const latestPrices = await StockData.aggregate([
            { $match: { symbol: { $in: symbols } } },
            { $sort: { timestamp: -1 } },
            {
              $group: {
                _id: '$symbol',
                latestDoc: { $first: '$$ROOT' }
              }
            },
            { $replaceRoot: { newRoot: '$latestDoc' } }
          ]);

          const priceMap = new Map(latestPrices.map(p => [p.symbol, p.price]));

          const updatedHoldings = holdings.map(holding => {
            const currentPrice = priceMap.get(holding.symbol) || holding.currentPrice;
            const currentValue = currentPrice * holding.quantity;
            const unrealizedPL = (currentPrice - holding.averageBuyPrice) * holding.quantity;
            const unrealizedPLPercent = ((currentPrice - holding.averageBuyPrice) / holding.averageBuyPrice) * 100;

            return {
              symbol: holding.symbol,
              stockName: holding.stockName,
              quantity: holding.quantity,
              averageBuyPrice: holding.averageBuyPrice,
              currentPrice,
              currentValue,
              unrealizedPL,
              unrealizedPLPercent
            };
          });

          const totalValue = updatedHoldings.reduce((sum, h) => sum + h.currentValue, 0);
          const totalPL = updatedHoldings.reduce((sum, h) => sum + h.unrealizedPL, 0);

          this.io.to(`user:${userId}`).emit('portfolio:update', {
            holdings: updatedHoldings,
            totalValue,
            totalPL,
            timestamp: new Date()
          });
        }

        if (userIds.size > 0) {
          console.log(`💼 Updated portfolios for ${userIds.size} users`);
        }

      } catch (error) {
        console.error('Error broadcasting portfolio updates:', error);
      }
    }, 10000); // Every 10 seconds
  }

  // Emit trade notification to specific user
  public notifyTradeExecuted(userId: string, tradeData: any) {
    this.io.to(`user:${userId}`).emit('trade:executed', {
      ...tradeData,
      timestamp: new Date()
    });
    console.log(`✅ Trade notification sent to user ${userId}`);
  }

  // Emit AI alert to specific user
  public notifyAIAlert(userId: string, alert: any) {
    this.io.to(`user:${userId}`).emit('ai:alert', {
      ...alert,
      timestamp: new Date()
    });
    console.log(`🤖 AI alert sent to user ${userId}`);
  }

  // Broadcast market status update to all users
  public broadcastMarketStatus(status: string, message: string) {
    this.io.emit('market:status', {
      status,
      message,
      timestamp: new Date()
    });
    console.log(`📢 Market status broadcast: ${message}`);
  }

  // Cleanup on server shutdown
  public shutdown() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
    }
    if (this.portfolioUpdateInterval) {
      clearInterval(this.portfolioUpdateInterval);
    }
    this.io.close();
    console.log('🔴 WebSocket server shut down');
  }
}
