import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Button } from "react-bootstrap";
import { Line, Pie } from "react-chartjs-2";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";
import OrdersDashboard from "../../components/admin/OrdersDashboard";
import SubTrainerModal from "../../components/admin/SubTrainerModal";
import SubAdminModal from "../../components/admin/SubAdminModal";
import ManageFormation from '../../components/manageformation';



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
  const apiUrl = import.meta.env.VITE_API_URL;
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formationStats, setFormationStats] = useState({
    monthlyStats: [],
    priceDistribution: [],
  });

  const [showTrainerModal, setShowTrainerModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false); // État pour la deuxième modal

  const handleOpenTrainerModal = () => setShowTrainerModal(true);
  const handleCloseTrainerModal = () => setShowTrainerModal(false);

  const handleOpenAdminModal = () => setShowAdminModal(true); // Ouvrir la deuxième modal
  const handleCloseAdminModal = () => setShowAdminModal(false); // Fermer la deuxième modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiResponse = await fetch(`${apiUrl}/admin/kpi`);
        const kpiJson = await kpiResponse.json();
        setKpiData(kpiJson);

        const statsResponse = await fetch(`${apiUrl}/admin/stats`);
        const statsJson = await statsResponse.json();
        setFormationStats(statsJson);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
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
        label: "Formations créées par mois",
        data: formationStats.monthlyStats.map((stat) => stat.formation_count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const priceDistributionData = {
    labels: formationStats.priceDistribution.map(
      (stat) => `${stat.price_range}€`
    ),
    datasets: [
      {
        label: "Répartition des prix",
        data: formationStats.priceDistribution.map((stat) => stat.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between mb-4">
        <Button as={Link} to="/admin/category" variant="primary">
          Passer au gestionnaire de catégorie
        </Button>
        <Button variant="primary" onClick={handleOpenTrainerModal}>
          Ajouter un Formateur
        </Button>
        <Button variant="secondary" onClick={handleOpenAdminModal}>
          Ajouter un Administrateur
        </Button>
      </div>

      <SubTrainerModal show={showTrainerModal} handleClose={handleCloseTrainerModal} />
      <SubAdminModal show={showAdminModal} handleClose={handleCloseAdminModal} />
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
          <div style={{ width: "60%", margin: "0 auto" }}>
            <Pie data={priceDistributionData} />
          </div>
        </Col>
      </Row>
      <OrdersDashboard />
    </Container>
  );
};

export default AdminDashboard;
