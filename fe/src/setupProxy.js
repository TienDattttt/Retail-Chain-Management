const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy API requests to backend server
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onError: (err, req, res) => {
        console.error('Proxy Error:', err.message);
        res.status(500).json({
          error: 'Proxy Error',
          message: 'Unable to connect to backend server',
          details: err.message
        });
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxying ${req.method} ${req.url} to backend`);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ Backend responded with ${proxyRes.statusCode} for ${req.method} ${req.url}`);
      }
    })
  );
  
  // Proxy WebSocket connections
  app.use(
    '/ws',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      ws: true,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
    })
  );
};