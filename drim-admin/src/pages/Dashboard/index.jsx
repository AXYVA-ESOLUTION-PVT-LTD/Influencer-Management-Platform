import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { withTranslation } from "react-i18next";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3d from "highcharts/highcharts-3d";
import ApexCharts from 'react-apexcharts';
import StatisticsBox from "../../components/Common/StatisticsBox";
import Mixchart from "../../components/Common/Chart/Mixchart";
import Barchart from "../../components/Common/Chart/Barchart";
import PieChart from "../../components/Common/Chart/PieChart";
Highcharts3d(Highcharts); 

const Dashboard = (props) => {
  // Meta title
  document.title = "Dashboard | Drim";

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

  const dataBoxes = [
    { title: "Active influencers", value: 120, rate: 5, isIncrease: true },
    { title: "Posts published", value: 30, rate: -10, isIncrease: false },
    { title: "Views", value: 15, rate: 2, isIncrease: true },
    { title: "Results", value: 350, rate: -20, isIncrease: false },
    { title: "Clicks", value: 7, rate: 0, isIncrease: false },
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
        formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
          // Show y-axis values for line series and hide for bar series
          if (w.config.series[seriesIndex].type === 'line') {
            return value; // Show values for line series
          }
          return ''; // Hide values for bar series
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
    {
      name: "Created by Influencers",
      type: "line",
      data: [25, 30, 35, 40, 45, 35, 50, 55, 60, 65, 55],
    },
    {
      name: "Clicks",
      type: "line",
      data: [30, 25, 30, 40, 35, 50, 55, 60, 70, 75, 80],
    },
    {
      name: "Video Views",
      type: "line",
      data: [20, 30, 40, 35, 50, 45, 55, 60, 65, 70, 75],
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

  // Highcharts donut chart options
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
    { name: "Dubai", y: 31 },
    { name: "South Arabia", y: 13.2 },
    { name: "United Arab Emirates", y: 12 },
    { name: "Sharjah", y: 10 },
    { name: "Riyadh", y: 6.3 },
    { name: "Abu Dhabi", y: 6.3 },
    { name: "Others", y: 9.0 },
  ];

  const pieChart2Data = [
    { name: "Lifestyle", y: 25.2 },
    { name: "Food and cooking", y: 14.3 },
    { name: "Fashion and shopping", y: 13.4 },
    { name: "Cosmetics and care", y: 7.5 },
    { name: "Travelling", y: 7.4 },
    { name: "Family,children", y: 6.6 },
    { name: "Activities and places", y: 3.4 },
    { name: "others", y: 10.2 },
  ];

  const pieChart3Data = [
    { name: "Instagram", y: 84.7 },
    { name: "Telegram", y: 12 },
    { name: "Tic Tok", y: 2.9 },
    { name: "Youtube", y: 0.5 },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboard")}
            breadcrumbItem={props.t("Overall statistics")}
          />
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
              <Barchart options={barChartOptions} series={barChartSeries} title="Influencers statistics"/>
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

export default withTranslation()(Dashboard);
