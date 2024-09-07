import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import StatisticsBox from "../../components/Common/StatisticsBox";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3d from "highcharts/highcharts-3d";
import Mixchart from "../../components/Common/Chart/Mixchart";
import Barchart from "../../components/Common/Chart/Barchart";
import PieChart from "../../components/Common/Chart/PieChart";

Highcharts3d(Highcharts);
// i18n
import { withTranslation } from "react-i18next";
import {
  areaChartOptions,
  areaChartSeries,
  barChartOptions,
  barChartSeries,
  dataBoxes,
  donutChartOptions,
  pieChart1Data,
  pieChart2Data,
  pieChart3Data,
} from "../../data/DashboardData";

const DashboardOverview = (props) => {
  // Meta title
  document.title = "Dashboard | Raise";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Brand Dashboard")}
            breadcrumbItem={props.t("Brand Dashboard")}
          /> */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18" style={{ textTransform: "uppercase" }}>
            Brand Dashboard
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
                title="Post statistics"
              />
            </Col>
            <Col md={6}>
              <Barchart
                options={barChartOptions}
                series={barChartSeries}
                title="Influencers statistics"
              />
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart1Data}
                title="Top followers locations"
              />
            </Col>
            <Col md={4}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart2Data}
                title="Top topics"
              />
            </Col>
            <Col md={4}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart3Data}
                title="Post on social networks"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(DashboardOverview);
