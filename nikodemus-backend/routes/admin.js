const express = require('express');
const router = express.Router();
const config = require('../config'); // Connexion à la BDD

router.get('/kpi', async (req, res) => {
    try {
      const [users] = await config.query('SELECT COUNT(*) AS totalUsers FROM user');
      const [orders] = await config.query('SELECT COUNT(*) AS totalOrders FROM orders');
      const [revenue] = await config.query('SELECT SUM(total_price) AS total_revenue FROM payments');
      const [formations] = await config.query('SELECT COUNT(*) AS totalFormations FROM formation');
  
      console.log('Revenu total:', revenue[0]?.total_revenue); // Debugging
  
      res.json({
        totalUsers: users[0]?.totalUsers || 0,
        totalOrders: orders[0]?.totalOrders || 0,
        totalRevenue: revenue[0]?.total_revenue || 0, // Accès sécurisé
        totalFormations: formations[0]?.totalFormations || 0,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des KPI:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });

  // Statistiques des formations
router.get('/stats', async (req, res) => {
    try {
      // Formations par mois
      const [monthlyStats] = await config.query(`
        SELECT DATE_FORMAT(create_time, '%Y-%m') AS creation_month, COUNT(*) AS formation_count
        FROM formation
        GROUP BY creation_month
        ORDER BY creation_month
      `);
  
      // Distribution des prix
      const [priceDistribution] = await config.query(`
        SELECT FLOOR(prix / 10) * 10 AS price_range, COUNT(*) AS count
        FROM formation
        GROUP BY price_range
        ORDER BY price_range
      `);
  
      res.json({
        monthlyStats,
        priceDistribution,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des stats de formation :', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });

  router.get('/orders-per-month', async (req, res) => {
    try {
      const [rows] = await config.query(`
        SELECT 
          DATE_FORMAT(order_date, '%Y-%m') AS order_month,
          COUNT(*) AS order_count
        FROM orders
        GROUP BY order_month
        ORDER BY order_month;
      `);
      res.json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes par mois :', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });

  router.get('/revenue-per-month', async (req, res) => {
    try {
      const [rows] = await config.query(`
        SELECT 
          DATE_FORMAT(order_date, '%Y-%m') AS revenue_month,
          SUM(total_price) AS monthly_revenue
        FROM orders
        GROUP BY revenue_month
        ORDER BY revenue_month;
      `);
      res.json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus par mois :', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });
  
  router.get('/revenue-distribution', async (req, res) => {
    try {
      const [rows] = await config.query(`
        SELECT order_user, SUM(total_price) AS total_revenue
        FROM orders
        GROUP BY order_user
        ORDER BY total_revenue DESC;
      `);
      res.json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });

  router.get('/price-distribution', async (req, res) => {
    try {
      const [rows] = await config.query(`
        SELECT
          CASE
            WHEN total_price < 10 THEN '<10'
            WHEN total_price BETWEEN 10 AND 50 THEN '10-50'
            WHEN total_price BETWEEN 50 AND 100 THEN '50-100'
            WHEN total_price > 100 THEN '>100'
          END AS price_range,
          COUNT(*) AS count
        FROM orders
        GROUP BY price_range;
      `);
      res.json(rows);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  });

module.exports = router;