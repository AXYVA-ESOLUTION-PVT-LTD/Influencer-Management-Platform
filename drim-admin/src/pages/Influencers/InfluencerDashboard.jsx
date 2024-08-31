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
Highcharts3d(Highcharts);

const InfluencerDashboard = (props) => {
  // Meta title
  document.title = "Influencer Dashboard | Drim";

  // Data for statistics boxes
  const dataBoxes = [
    { title: "Total Followers", value: 45000, rate: 5, isIncrease: true },
    { title: "Total Likes", value: 12000, rate: -150, isIncrease: false },
    { title: "Total Comments", value: 3200, rate: 200, isIncrease: true },
    { title: "New Followers This Month", value: 800, rate: 30, isIncrease: true },
    { title: "Average Likes Per Post", value: 150, rate: -10, isIncrease: false },
    { title: "Average Comments Per Post", value: 35, rate: 5, isIncrease: true },
  ];

  // Area chart options
  const areaChartOptions = {
    chart: {
      height: 350,
      type: "line",
      stacked: false,
    },
    stroke: {
      width: [2, 2, 2, 2, 2, 2],
      curve: "smooth",
    },
    plotOptions: {
      line: {
        curve: "smooth", // Smooth line curves
        dataLabels: {
          enabled: true, // Enable data labels for line series
          formatter: function (value) {
            return value; // Show data labels for line series
          },
        },
      },
      bar: {
        columnWidth: "50%", // Width for bar type series
        endingShape: "rounded", // Rounded ends for bars
        dataLabels: {
          enabled: false, // Disable data labels for bar series
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
      colors: ["#003f5c", "#2f4b7c", "#665191", "#6a4c93", "#4a4e69", "#6c757d"], // Updated marker colors
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
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (value) {
          return value;
        },
      },
    },
    colors: ["#003f5c", "#2f4b7c", "#665191", "#6a4c93", "#4a4e69", "#6c757d"],
  };

  const areaChartSeries = [
    {
      name: "Posts",
      type: "bar",
      data: [1500, 1000, 750, 400, 1950, 1000, 900, 650, 1550, 1690, 1050, 1070],
    },
    {
      name: "Likes",
      type: "area",
      data: [1200, 1300, 1500, 600, 700, 1800, 900, 700, 2100, 2200, 1000, 1200],
    },
    {
      name: "Comments",
      type: "line",
      data: [200, 1920, 1950, 1660, 970, 1080, 1290, 1300, 910, 320, 330, 340],
    },
  ];

  // Bar chart options
  const barChartOptions = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false, // Disable data labels
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"], // Border color for bars
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
    },
    yaxis: {
      title: {
        text: "Count",
      },
    },
    fill: {
      opacity: 1, 
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " items";
        },
      },
    },
    colors: ["#003f5c", "#2f4b7c"],
  };

  const barChartSeries = [
    {
      name: "Engaged",
      data: [40, 75, 90, 55, 65, 75, 70, 75, 59, 75, 90, 95],
    },
    {
      name: "Not Engaged",
      data: [10, 45, 50, 25, 50, 35, 40, 35, 50, 30, 60, 65],
    },
  ];

  // Donut chart options
  const donutChartOptions = {
    chart: {
      type: "pie",
      height: 350,
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
    },
   title: {
      text: null,
    },
    plotOptions: {
      pie: {
        innerSize: "50%",
        depth: 45,
        colors: [
          "#003f5c", 
          "#2f4b7c", 
          "#665191", 
          "#d45087", 
          "#f95d6a", 
          "#ffa600", 
          "#b3b3b3", 
        ], 
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.percentage:.1f} %",
          style: {
            color: "#333", // Color for data labels
            fontSize: "14px",
            fontFamily: "Arial, sans-serif",
          },
        },
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f} %</b>",
    },
    series: [
      {
        name: "Shares",
        data: [],
      },
    ],
  };

  const pieChart1Data = [
    ['Male', 45],
    ['Female', 55],
  ]

  const pieChart2Data = [
    ['0-18', 25],
    ['19-35', 35],
    ['36-50', 20],
    ['51+', 20],
  ]

  const pieChart3Data =  [
    ['English', 50],
    ['Spanish', 30],
    ['Other', 20],
  ]

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboard")}
            breadcrumbItem={props.t("Influencer Dashboard")}
          />
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

export default withTranslation()(InfluencerDashboard);
