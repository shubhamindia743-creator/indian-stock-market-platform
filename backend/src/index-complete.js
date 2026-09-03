import { registerRoutes } from './routes/index.js';
import authRouter from './routes/auth.js';
import authMiddleware from './utils/authMiddleware.js';

// Apply auth middleware to protected routes
app.use('/api/portfolio', authMiddleware);
app.use('/api/alerts', authMiddleware);

// Register all routes
app.use('/api/auth', authRouter);
registerRoutes(app);

// Real-time stock price updates via WebSocket
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Subscribe to stock price updates
  socket.on('subscribe', (symbol) => {
    socket.join(`stock:${symbol}`);
    logger.info(`User ${socket.id} subscribed to ${symbol}`);
  });

  socket.on('unsubscribe', (symbol) => {
    socket.leave(`stock:${symbol}`);
    logger.info(`User ${socket.id} unsubscribed from ${symbol}`);
  });

  // Broadcast stock price updates
  const broadcastPriceUpdate = (symbol, priceData) => {
    io.to(`stock:${symbol}`).emit('price_update', {
      symbol,
      ...priceData,
      timestamp: new Date(),
    });
  };

  // Simulate price updates (replace with real data)
  const priceUpdateInterval = setInterval(() => {
    const symbols = ['TCS', 'INFY', 'RELIANCE', 'HDFC'];
    symbols.forEach((symbol) => {
      broadcastPriceUpdate(symbol, {
        price: Math.random() * 5000,
        change: Math.random() * 100 - 50,
      });
    });
  }, 5000);

  socket.on('disconnect', () => {
    clearInterval(priceUpdateInterval);
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📊 Stock Market API ready`);
});
