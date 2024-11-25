import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import OrdersDashboard from '../../components/admin/OrdersDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const AdminDashboard = () => {
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formationStats, setFormationStats] = useState({
    monthlyStats: [],
    priceDistribution: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiResponse = await fetch('http://localhost:3000/admin/kpi');
        const kpiJson = await kpiResponse.json();
        setKpiData(kpiJson);

        const statsResponse = await fetch('http://localhost:3000/admin/stats');
        const statsJson = await statsResponse.json();
        setFormationStats(statsJson);
      } catch (error) {
        console.error('Erreur lors du chargement des données', error);
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

  if (!kpiData || !formationStats) {
    return (
      <Container className="text-center mt-5">
        <p>Impossible de charger les données.</p>
      </Container>
    );
  }

  const { totalUsers, totalOrders, totalRevenue, totalFormations } = kpiData;

  const monthlyStatsChartData = {
    labels: formationStats.monthlyStats.map((stat) => stat.creation_month),
    datasets: [
      {
        label: 'Formations créées par mois',
        data: formationStats.monthlyStats.map((stat) => stat.formation_count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const priceDistributionData = {
    labels: formationStats.priceDistribution.map((stat) => `${stat.price_range}€`),
    datasets: [
      {
        label: 'Répartition des prix',
        data: formationStats.priceDistribution.map((stat) => stat.count),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Utilisateurs</Card.Title>
              <Card.Text>{totalUsers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Commandes</Card.Title>
              <Card.Text>{totalOrders}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Revenu total</Card.Title>
              <Card.Text>{totalRevenue} €</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center mb-3">
            <Card.Body>
              <Card.Title>Formations</Card.Title>
              <Card.Text>{totalFormations}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-4">
          <h4>Formations Créées par Mois</h4>
          <Line data={monthlyStatsChartData} />
        </Col>
        <Col md={6} className="mb-4">
          <h4>Répartition des Prix des Formations</h4>
          <div style={{ width: '60%', margin: '0 auto' }}>
            <Pie data={priceDistributionData} />
          </div>
        </Col>
      </Row>
<OrdersDashboard/>
    </Container>
  );
};

export default AdminDashboard;