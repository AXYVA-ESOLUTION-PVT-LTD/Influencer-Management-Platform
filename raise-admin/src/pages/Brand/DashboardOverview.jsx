import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col, Spinner
} from "reactstrap";
// Import Breadcrumb
import StatisticsBox from "../../components/Common/StatisticsBox";
import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import Mixchart from "../../components/Common/Chart/Mixchart";
import Barchart from "../../components/Common/Chart/Barchart";

Highcharts3d(Highcharts);
// i18n
import { withTranslation } from "react-i18next";
import {
  barChartOptions,
  donutChartOptions,
  lineChartOptions
} from "../../data/DashboardData";
import {
  getBrandStatistics,
  getInfluencerStatistics,
  getInfluencerStatisticsByCountry,
  getInfluencerStatisticsByPlatform,
  getOpportunityStatistics,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import PieChart from "../../components/Common/Chart/PieChart";

const DashboardOverview = (props) => {
  // Meta title
  document.title = "Dashboard | Brandraise";

  const dispatch = useDispatch();

  const {
    brandStatisticsLoading,
    opportunityStatisticsLoading,
    influencerStatisticsLoading,
    brandStatistics,
    opportunityStatistics,
    influencerStatistics,
    influencerStatisticsByPlatform,
    influencerStatisticsByPlatformLoading,
    influencerStatisticsByCountry,
    influencerStatisticsByCountryLoading,
  } = useSelector((state) => state.Brand);

  useEffect(() => {
    dispatch(getBrandStatistics());
    dispatch(getOpportunityStatistics());
    dispatch(getInfluencerStatistics());
    dispatch(getInfluencerStatisticsByCountry())
    dispatch(getInfluencerStatisticsByPlatform())
  }, []);

  const areaChartSeriesTemplate = [
    {
      name: "Posts Published",
      data: opportunityStatistics?.monthlyOpportunities,
    },
  ];

  const dataBoxes = [
    {
      title: "Active influencers",
      value: brandStatistics?.activeInfluencerCount ||0 ,
    },
    {
      title: "Posts published",
      value: brandStatistics?.opportunityCount || 0,
    },
    {
      title: "Views",
      value: brandStatistics?.totalViews || 0,
    },
  ];

  const barChartSeries = [
    {
      name: "Approved",
      data: influencerStatistics?.approvedCounts,
    },
    {
      name: "Declined",
      data: influencerStatistics?.declinedCounts,
    },
    {
      name: "On hold",
      data: influencerStatistics?.onHoldCounts,
    },
  ];

  const pieChart1Options = influencerStatisticsByCountry?.countryChartData;

  const pieChart2Options = influencerStatisticsByPlatform?.pieChartData;

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
            <h4 className="font-size-18 text-uppercase">Brand Dashboard</h4>
          </div>
          <Row className="mt-4">
            {brandStatisticsLoading ? (
              <div className="d-flex justify-content-center align-items-center w-100 box-loading-container">
                <Spinner color="primary" className="chart-loading-spinner" />
              </div>
            ) : (
              dataBoxes.map((box, index) => (
                <StatisticsBox key={index} box={box} />
              ))
            )}
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Mixchart
                options={lineChartOptions}
                series={areaChartSeriesTemplate}
                title="Post statistics"
                loading={opportunityStatisticsLoading}
              />
            </Col>
            <Col md={6}>
              <Barchart
                options={barChartOptions}
                series={barChartSeries}
                title="Influencers statistics"
                loading={influencerStatisticsLoading}
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart1Options}
                title="Influencer locations"
                loading={influencerStatisticsByCountryLoading}
              />
            </Col>
            <Col md={6}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart2Options}
                title="Influencer Platform"
                loading={influencerStatisticsByPlatformLoading}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(DashboardOverview);
