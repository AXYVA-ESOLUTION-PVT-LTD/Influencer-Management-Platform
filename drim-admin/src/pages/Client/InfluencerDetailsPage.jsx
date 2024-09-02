import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Table,
  Progress,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Mixchart from "../../components/Common/Chart/Mixchart";
import ApexCharts from "react-apexcharts";
import MetricCard from "../../components/Common/MetricCard";
import MetricListCard from "../../components/Common/MetricListCard";
import ReactionRangeCard from "../../components/Common/ReactionRangeCard";
import DataCard from "../../components/Common/DataCard";
import UserDataCard from "../../components/Common/UserDataCard";

function InfluencerDetailsPage() {

  document.title = "Influencers | Raise ";
  
  const areaChartOptions = {
    chart: {
      height: 350,
      type: "line",
      stacked: false,
    },
    stroke: {
      width: [2, 2, 2, 2, 2, 2], // Uniform stroke width for lines
      curve: "smooth",
    },
    plotOptions: {
      bar: {
        columnWidth: "50%", // Width for bar type series
        endingShape: "rounded", // Rounded ends for bars
        dataLabels: {
          enabled: false, // Disable data labels for bar series
        },
      },
      line: {
        curve: "smooth", // Smooth line curves
        dataLabels: {
          enabled: true, // Enable data labels for line series
          formatter: function (value) {
            return value; // Show data labels for line series
          },
        },
      },
      area: {
        dataLabels: {
          enabled: false, // Disable data labels for area series
        },
      },
    },
    markers: {
      size: 6, // Size of the markers
      colors: [
        "#003f5c",
        "#2f4b7c",
        "#665191",
        "#6a4c93",
        "#4a4e69",
        "#6c757d",
      ], // Updated marker colors
      strokeColors: "#fff", // Border color for markers
      strokeWidth: 2, // Border width for markers
      hover: {
        size: 8, // Size of markers on hover
      },
    },
    fill: {
      opacity: [0.85, 0.5, 0.5, 0.5, 0.5, 0.5], // Opacity for different series
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
      ],
      title: {
        text: "Month",
      },
      labels: {
        style: {
          colors: "#9E9E9E", // Label color
          fontSize: "12px", // Font size
        },
      },
    },
    yaxis: {
      title: {
        text: "Values",
      },
      labels: {
        style: {
          colors: "#9E9E9E", // Label color
          fontSize: "12px", // Font size
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (
          value,
          { series, seriesIndex, dataPointIndex, w }
        ) {
          // Show y-axis values for line series and hide for bar series
          if (w.config.series[seriesIndex].type === "line") {
            return value; // Show values for line series
          }
          return ""; // Hide values for bar series
        },
      },
    },
    colors: ["#003f5c", "#2f4b7c", "#665191", "#6a4c93", "#4a4e69", "#6c757d"], // Updated colors for each series
  };

  const areaChartSeries = [
    {
      name: "Orders",
      type: "bar",
      data: [12, 25, 18, 40, 28, 35, 25, 30, 20, 45, 40],
    },
    {
      name: "Repeated Posts",
      type: "area",
      data: [22, 18, 20, 30, 40, 25, 30, 35, 50, 55, 60],
    },
    {
      name: "First Posts",
      type: "line",
      data: [15, 20, 25, 30, 35, 30, 35, 25, 45, 50, 45],
    },
  ];

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleViewClick = (publication) => {
    setSelectedPublication(publication);
    toggleModal();
  };

  const MainData = [
    {
      title: "Engagement rate (ER)",
      desc: "Percentage of subscribers engaging with the content",
      data: "2,79%",
      tag: "High",
    },
    {
      title: "Account activity",
      desc: "Average number of publications per week",
      data: "3,33",
      tag: "Moderate",
    },
    {
      title: "Audience quality",
      desc: "The number of real people and influencers among the subscribers",
      data: "2,79%",
      tag: "Satisfactory",
    },
    {
      title: "Audience reachability",
      desc: "Subscribers whose number of subscriptions does not exceed 1000",
      data: "23,38%",
      tag: "High",
    },
  ];

  const chartOptions = {
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
    },
  };

  // Individual series and color options for each chart
  const genderChartOptions = {
    ...chartOptions,
    colors: ["#003f5c", "#2f4b7c", "#665191"], // Colors for Audience Gender
    title: {
      text: "Audience Gender",
    },
  };

  const ageChartOptions = {
    ...chartOptions,
    colors: ["#6a4c93", "#4a4e69", "#6c757d"], // Colors for Age by Category
    title: {
      text: "Age by Category",
    },
  };

  const languageChartOptions = {
    ...chartOptions,
    colors: ["#003f5c", "#2f4b7c", "#665191", "#6a4c93", "#4a4e69", "#6c757d"], // Colors for Audience Language
    title: {
      text: "Audience Language",
    },
  };

  // Sample data series for each chart
  const genderSeries = [44, 33, 23];
  const ageSeries = [25, 35, 20];
  const languageSeries = [30, 25, 20, 15, 5, 5];

  const metrics = [
    { title: "Reach", value: "69,76k" },
    { title: "Subscribers", value: "226,07k" },
    { title: "Engagement Rate (ER)", value: "1,2%" },
    { title: "Views", value: "500K" },
  ];

  const metricsData = [
    { title: "Average number of reactions", value: "5796" },
    { title: "Average number of comments", value: "101" },
    { title: "Average number of views", value: "55742" },
    { title: "Reactions of real subscribers", value: "In development" },
    { title: "Number of posts per week", value: "4" },
  ];

  const userData = {
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz9XyMm2fcQCxkFmgn5558mIhd5oZpAKifEA&s",
    name: "Merk Fran",
    profileUrl: "#",
    publication: "200",
    subscribers: "500K",
    subscriptions: "50",
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col md="6" className="mb-4">
              <UserDataCard
                imageUrl={userData.imageUrl}
                name={userData.name}
                profileUrl={userData.profileUrl}
                publication={userData.publication}
                subscribers={userData.subscribers}
                subscriptions={userData.subscriptions}
              />
            </Col>
            <Col md="6" className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <Row>
                    {metrics.map((metric, index) => (
                      <Col md="6" className="mb-3" key={index}>
                        <MetricCard title={metric.title} value={metric.value} />
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            {MainData.map((data, index) => (
              <DataCard
                key={index}
                title={data.title}
                desc={data.desc}
                data={data.data}
                tag={data.tag}
              />
            ))}
          </Row>
          <Row>
            {/* First Column */}
            <Col md="6" className="mb-1">
              <Row>
                <Col md="12" className="mb-4">
                  <ReactionRangeCard
                    title="Range of reactions"
                    percentage="88,35%"
                    badgeColor="success"
                    badgeText="Good"
                    description="Influencer's audience reacts to his/her content naturally"
                  />
                </Col>
                <Col md="12">
                  <MetricListCard metrics={metricsData} />
                </Col>
              </Row>
            </Col>
            <Col md="6" className="mb-1">
              <Mixchart
                options={areaChartOptions}
                series={areaChartSeries}
                title="Post statistics"
              />
            </Col>
          </Row>
          <Row>
            <Col className="mb-4">
              <Mixchart
                options={areaChartOptions}
                series={areaChartSeries}
                title="Post statistics"
              />
            </Col>
          </Row>
          <Card className="h-100">
            <CardBody>
              <CardTitle tag="h5" className="mb-5">
                Audience Metrics
              </CardTitle>
              <Row>
                <Col md="4">
                  <Card>
                    <ApexCharts
                      options={genderChartOptions}
                      series={genderSeries}
                      type="donut"
                      height={300}
                    />
                  </Card>
                </Col>
                <Col md="4">
                  <Card>
                    <ApexCharts
                      options={ageChartOptions}
                      series={ageSeries}
                      type="donut"
                      height={300}
                    />
                  </Card>
                </Col>
                <Col md="4">
                  <Card>
                    <ApexCharts
                      options={languageChartOptions}
                      series={languageSeries}
                      type="donut"
                      height={300}
                    />
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default InfluencerDetailsPage;
