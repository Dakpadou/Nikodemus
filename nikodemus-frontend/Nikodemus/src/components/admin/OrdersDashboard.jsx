import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Configurer Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

const MonthlyDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [ordersPerMonth, setOrdersPerMonth] = useState([]);
  const [revenuePerMonth, setRevenuePerMonth] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await fetch('http://localhost:3000/admin/orders-per-month');
        const ordersData = await ordersResponse.json();
        setOrdersPerMonth(ordersData);

        const revenueResponse = await fetch('http://localhost:3000/admin/revenue-per-month');
        const revenueData = await revenueResponse.json();
        setRevenuePerMonth(revenueData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Chargement des données...</p>
      </Container>
    );
  }

  // Vérification des données reçues
  if (!ordersPerMonth.length || !revenuePerMonth.length) {
    return (
      <Container className="text-center mt-5">
        <p>Aucune donnée disponible pour les graphiques.</p>
      </Container>
    );
  }

  // Préparer les données pour les graphiques
  const ordersChartData = {
    labels: ordersPerMonth.map(item => item.order_month),
    datasets: [
      {
        label: 'Commandes par mois',
        data: ordersPerMonth.map(item => item.order_count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const revenueChartData = {
    labels: revenuePerMonth.map(item => item.revenue_month),
    datasets: [
      {
        label: 'Revenu par mois (€)',
        data: revenuePerMonth.map(item => item.monthly_revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Dashboard Mensuel</h2>
      <Row>
        <Col md={6} className="mb-4">
          <h4>Commandes par Mois</h4>
          <Line data={ordersChartData} />
        </Col>
        <Col md={6} className="mb-4">
          <h4>Revenu par Mois</h4>
          <Bar data={revenueChartData} />
        </Col>
      </Row>
    </Container>
  );
};

export default MonthlyDashboard;