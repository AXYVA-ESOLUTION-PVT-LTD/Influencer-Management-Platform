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

const DashboardOverview = (props) => {
  // Meta title
  document.title = "Dashboard | Raise";

  const dataBoxes = [
    { title: "Views", value: 15, rate: 2, isIncrease: true },
    { title: "Clicks", value: 70, rate: 55, isIncrease: true },
    { title: "Approximate reach", value: 40, rate: 8, isIncrease: true },
    { title: "Approximate views", value: 8, rate: -1, isIncrease: false },
    { title: "Likes", value: 100, rate: 12, isIncrease: true },
    { title: "Comments", value: 100, rate: 12, isIncrease: true },
  ];

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
      name: "Posts Published",
      type: "bar",
      data: [35, 30, 45, 40, 50, 60, 35, 65, 70, 40, 80], // Updated client data
    },
    {
      name: "Engagement Rate",
      type: "area",
      data: [12, 18, 22, 30, 40, 25, 35, 45, 50, 40, 60], // Updated client data
    },
    {
      name: "Comments",
      type: "line",
      data: [25, 30, 35, 40, 45, 50, 35, 60, 65, 40, 75], // Updated client data
    },
  ];
  
  const barChartOptions = {
    chart: {
      height: 350,
      type: "bar",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%", // Medium width
        endingShape: "rounded", // Rounded bar edges
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
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
      labels: {
        style: {
          colors: "#9E9E9E", // Label color
          fontSize: "12px", // Font size
        },
      },
    },
    yaxis: {
      title: {
        text: "Count", // Updated title
      },
      labels: {
        style: {
          colors: "#9E9E9E", // Label color
          fontSize: "12px", // Font size
        },
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
    colors: ["#003f5c", "#2f4b7c", "#665191"],
  };

  const barChartSeries = [
    {
      name: "Approved",
      data: [30, 40, 35, 50, 45, 55, 60, 65, 70],
    },
    {
      name: "Declined",
      data: [20, 30, 25, 35, 30, 40, 45, 50, 55],
    },
    {
      name: "On hold",
      data: [10, 20, 15, 25, 20, 30, 35, 40, 45],
    },
  ];

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
        name: "Share",
        data: [],
      },
    ],
  };

  const pieChart1Data = [
    { name: "New York", y: 25 },
    { name: "Los Angeles", y: 20 },
    { name: "Chicago", y: 15 },
    { name: "Houston", y: 10 },
    { name: "Phoenix", y: 8 },
    { name: "Philadelphia", y: 7 },
    { name: "San Antonio", y: 5 },
    { name: "San Diego", y: 4 },
    { name: "Dallas", y: 3 },
    { name: "San Jose", y: 3 },
  ]; 
  
  const pieChart2Data = [
    { name: "Technology", y: 30 },
    { name: "Health", y: 22 },
    { name: "Education", y: 18 },
    { name: "Finance", y: 15 },
    { name: "Entertainment", y: 10 },
    { name: "Travel", y: 5 },
  ];
  
  const pieChart3Data = [
    { name: "Facebook", y: 30 },
    { name: "Twitter", y: 20 },
    { name: "LinkedIn", y: 15 },
    { name: "Snapchat", y: 10 },
    { name: "Reddit", y: 5 },
  ];
  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("ClientDashboard")}
            breadcrumbItem={props.t("ClientDashboard")}
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
            {/* <Col md={4}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart2Data}
                title="Top topics"
              />
            </Col> */}
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
