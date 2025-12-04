const express = require('express');

function createRouter(tableController) {
  const router = express.Router();

  router.get('/', (req, res) => tableController.showTablesPage(req, res));
  router.get('/bank', (req, res) => tableController.showBankPage(req, res));
  router.get('/hello', (req, res) => tableController.showHelloWorld(req, res));
  router.get('/query', (req, res) => tableController.showQueryPage(req, res));

  return router;
}

module.exports = createRouter;