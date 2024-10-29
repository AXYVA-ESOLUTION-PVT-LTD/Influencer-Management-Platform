import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
} from "reactstrap";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import StatisticsBox from "../../components/Common/StatisticsBox";
import Mixchart from "../../components/Common/Chart/Mixchart";
import Barchart from "../../components/Common/Chart/Barchart";
import PieChart from "../../components/Common/Chart/PieChart";

// i18n
import { withTranslation } from "react-i18next";

// Importing Highcharts
import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import Donutchart from "../../components/Common/Chart/Donutchart";
import { areaChartOptions, areaChartSeries, barChartOptions, barChartSeries, dataBoxes, donutChartOptions, pieChart1Data, pieChart2Data, pieChart3Data } from "../../data/DashboardData";
Highcharts3d(Highcharts);

const DashboardOverview = (props) => {
  // Meta title
  document.title = "Influencer Dashboard | Brandraise";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Dashboard")}
            breadcrumbItem={props.t("Influencer Dashboard")}
          /> */}
            <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18" style={{ textTransform: "uppercase" }}>
            Influencer Dashboard
            </h4>
          </div>
          <Row className="mt-4">
            {dataBoxes.map((box, index) => (
              <StatisticsBox key={index} box={box} />
            ))}
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Mixchart
                options={areaChartOptions}
                series={areaChartSeries}
                title="Monthly Performance"
              />
            </Col>
            <Col md={6}>
              <Barchart
                options={barChartOptions}
                series={barChartSeries}
                title="Engagement Statistics"
              />
            </Col>
          </Row>
          <Row>
          <Col md={4}>
              <PieChart chartoptions={donutChartOptions} chartdata={pieChart1Data} title="Gender Distribution" />
            </Col>
            <Col md={4}>
              <PieChart chartoptions={donutChartOptions} chartdata={pieChart2Data} title="Age Distribution"/>
            </Col>
            <Col md={4}>
              <PieChart chartoptions={donutChartOptions} chartdata={pieChart3Data} title="Language Distribution"/>
            </Col>
    </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(DashboardOverview);
