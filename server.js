const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql');

// MySQL database connection
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root', // Replace with your MySQL username
  password: 'naman789', // Replace with your MySQL password
  database: 'IndoorSportsComplexBooking', // Replace with your MySQL database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// Function to handle HTTP requests
const handleRequest = (req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === '/user_login' && req.method === 'POST') {
    handleUserLogin(req, res);
  } else if (reqUrl.pathname === '/admin_login' && req.method === 'POST') {
    handleAdminLogin(req, res);
  } else if (reqUrl.pathname === '/register_user' && req.method === 'POST') {
    handleRegisterUser(req, res);
  } else {
    // Serve static files (HTML, CSS, images, etc.)
    const filePath = path.join(__dirname, 'public', reqUrl.pathname);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }
};

// Function to handle user login
const handleUserLogin = (req, res) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    const { email, password } = JSON.parse(data);

    const sql = 'SELECT * FROM USERDATA WHERE email = ? AND pass = ?';
    db.query(sql, [email, password], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
      } else {
        if (result.length > 0) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Login successful' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
        }
      }
    });
  });
};

// Function to handle admin login
const handleAdminLogin = (req, res) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    const { username, password } = JSON.parse(data);

    const sql = 'SELECT * FROM admin WHERE email = ? AND pwd = ?';
    db.query(sql, [username, password], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
      } else {
        if (result.length > 0) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Admin login successful' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid admin credentials' }));
        }
      }
    });
  });
};

// Function to handle user registration
const handleRegisterUser = (req, res) => {
  let data = '';
  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    const { username, password, email, phone } = JSON.parse(data);

    const sql = 'INSERT INTO USERDATA (name, email, pass, type) VALUES (?, ?, ?, ?)';
    db.query(sql, [username, email, password, 'user'], (err) => {
      if (err) {
        console.error('Error executing query:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'User registration successful' }));
      }
    });
  });
};

// Helper function to get content type based on file extension
const getContentType = (filePath) => {
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
  };

  return mimeTypes[extname] || 'application/octet-stream';
};

// Create an HTTP server and listen on port 3000
const server = http.createServer(handleRequest);
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
