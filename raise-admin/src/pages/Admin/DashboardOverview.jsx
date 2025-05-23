import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { withTranslation } from "react-i18next";
import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import StatisticsBox from "../../components/Common/StatisticsBox";
import Mixchart from "../../components/Common/Chart/Mixchart";
import Barchart from "../../components/Common/Chart/Barchart";
import PieChart from "../../components/Common/Chart/PieChart";
import {
  areaChartOptions,
  areaChartSeries,
  barChartOptions,
  dataBoxes,
  donutChartOptions,
  pieChart1Data,
  pieChart2Data,
  pieChart3Data,
} from "../../data/DashboardData";
import { getTicketEngagementStatistics } from "../../store/dashboard/actions";
import { useDispatch, useSelector } from "react-redux";
Highcharts3d(Highcharts); 

const DashboardOverview = (props) => {
  // Meta title
  document.title = "Overview | Brandraise";

  const {
    approvedCounts,
    declinedCounts,
    onHoldCounts,
    loadingTicketStatistics,
  } = useSelector((state) => state.Dashboard);
  const dispatch = useDispatch();
  // State for filters
  const [filters, setFilters] = useState({
    category: "all",
    dateRange: "thisMonth",
  });

  // Sample statistics data
  const statistics = [
    { title: "Posts", count: 200, icon: "bx bx-news", filter: "all" },
    { title: "Influencers", count: 50, icon: "bx bxs-star", filter: "all" },
  ];

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  // Filtered statistics
  const filteredStatistics = statistics.filter((stat) => {
    if (filters.category === "all") return true;
    return stat.filter === filters.category;
  });

  const barChartSeries = [
    {
      name: "Approved",
      data: approvedCounts,
    },
    {
      name: "Declined",
      data: declinedCounts,
    },
    {
      name: "On hold",
      data: onHoldCounts,
    },
  ];

  useEffect(() => {
    dispatch(getTicketEngagementStatistics());
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Overview")}
            breadcrumbItem={props.t("Overall statistics")}
          /> */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">
            Overview
            </h4>
          </div>
          <Row className="mt-4">
            {dataBoxes.map((box, index) => (
              <StatisticsBox key={index} box={box} />
            ))}
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Mixchart  options={areaChartOptions} series={areaChartSeries} title="Post statistics"/>
            </Col>
            <Col md={6}>
              <Barchart options={barChartOptions} series={barChartSeries} title="Influencers statistics"
                loading={loadingTicketStatistics}
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <PieChart chartoptions={donutChartOptions} chartdata={pieChart1Data} title="Top followers locations" />
            </Col>
            <Col md={4}>
              <PieChart chartoptions={donutChartOptions} chartdata={pieChart2Data} title="Top topics"/>
            </Col>
            <Col md={4}>
              <PieChart chartoptions={donutChartOptions} chartdata={pieChart3Data} title="Post on social networks"/>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(DashboardOverview);
