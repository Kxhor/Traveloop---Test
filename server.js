/**
 * Simple Node.js dev server for Traveloop frontend
 * Serves frontend + Stitch screens + proxies to backend API
 *
 * Usage: node server.js
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();
const PORT = 3000;
const BACKEND_URL = 'http://localhost:8000';

// Middleware
app.use(cors());
app.use(express.json());

// Serve Stitch screens with proper path handling
app.use('/Stitch%20screens', express.static(path.join(__dirname, 'Stitch screens')));
app.use('/Stitch screens', express.static(path.join(__dirname, 'Stitch screens')));

// Serve frontend static files (must be after Stitch screens)
app.use(express.static(path.join(__dirname, 'frontend')));

// Debug logging for API requests
app.use('/api', (req, res, next) => {
  console.log(`📡 API Request: ${req.method} ${req.path}`);
  next();
});

// Proxy API requests to backend
app.all('/api/*', (req, res) => {
  const apiPath = req.path.replace('/api', '');
  const backendUrl = `${BACKEND_URL}/api${apiPath}`;

  console.log(`🔄 Proxying to: ${backendUrl}`);

  const options = {
    hostname: 'localhost',
    port: 8000,
    path: `/api${apiPath}`,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...req.headers,
    },
  };

  // Forward auth header if present
  if (req.headers.authorization) {
    options.headers.authorization = req.headers.authorization;
  }

  const proxyReq = http.request(options, (proxyRes) => {
    res.status(proxyRes.statusCode);
    Object.keys(proxyRes.headers).forEach((key) => {
      res.setHeader(key, proxyRes.headers[key]);
    });

    proxyRes.pipe(res);
  });

  proxyReq.on('error', (error) => {
    console.error('❌ Backend proxy error:', error.message);
    res.status(502).json({ 
      error: 'Backend unavailable',
      details: error.message,
      hint: 'Make sure backend is running: uvicorn app.main:app --reload'
    });
  });

  // Send body if present
  if (req.body && Object.keys(req.body).length > 0) {
    proxyReq.write(JSON.stringify(req.body));
  }

  proxyReq.end();
});

// Serve index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Traveloop Frontend Server Running    ║
╠════════════════════════════════════════╣
║  Frontend:  http://localhost:${PORT}       ║
║  API Proxy: http://localhost:${PORT}/api  ║
║  Backend:   ${BACKEND_URL}                ║
╚════════════════════════════════════════╝
  `);
  console.log(`
✅ Server ready!

Make sure the backend is running:
  cd backend && uvicorn app.main:app --reload

Then open: http://localhost:${PORT}
  `);
});
