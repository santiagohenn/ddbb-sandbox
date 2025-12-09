const express = require('express');
const path = require('path');
require('dotenv').config();

// Infrastructure
const MySQLTableRepository = require('./repositories/MySQLTableRepository');

// Application
const GetTablesUseCase = require('../application/use-cases/GetTablesUseCase');

// Interface
const TableController = require('../interface/controllers/TableController');
const createRouter = require('../interface/routes/routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    
    this.setupMiddleware();
    this.setupDependencies();
    this.setupRoutes();
  }

  setupMiddleware() {
    // View engine setup
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, '../interface/views'));

    // Static files
    // Serve built webpack assets from /dist
    this.app.use('/dist', express.static(path.join(__dirname, '../../dist')));
    this.app.use(express.static(path.join(__dirname, '../interface/public')));

    // Parse JSON bodies
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupDependencies() {
    const tableRepository = new MySQLTableRepository();
    const getTablesUseCase = new GetTablesUseCase(tableRepository);
    this.tableController = new TableController(getTablesUseCase, tableRepository);
  }

  setupRoutes() {
    const router = createRouter(this.tableController);
    this.app.use('/', router);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server running on http://localhost:${this.port}`);
      console.log(`📊 Database: ${process.env.DB_NAME || 'Not configured'}`);
      console.log(`🔗 Host: ${process.env.DB_HOST || 'Not configured'}`);
    });
  }
}

// Start server
const server = new Server();
server.start();

module.exports = Server;
