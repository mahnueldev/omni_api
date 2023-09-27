// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  // Proxy the first endpoint
  app.use(
    '/api/endpoint1',
    createProxyMiddleware({
      target: 'https://test.mahnuel.com', // Replace with your backend server URL
      changeOrigin: true,
    })
  );

  // Proxy the second endpoint
  app.use(
    '/api/endpoint2',
    createProxyMiddleware({
      target: 'https://test.mahnuel.com', // Replace with your backend server URL
      changeOrigin: true,
    })
  );

  // Add more endpoints as needed
};
