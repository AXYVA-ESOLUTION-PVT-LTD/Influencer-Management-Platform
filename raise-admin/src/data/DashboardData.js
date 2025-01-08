import '../assets/themes/colors.scss';
export const dataBoxes = [
  { title: "Views", value: 15, rate: 2, isIncrease: true },
  { title: "Clicks", value: 70, rate: 55, isIncrease: false },
  { title: "Approximate reach", value: 40, rate: 8, isIncrease: true },
  { title: "Approximate views", value: 8, rate: -1, isIncrease: false },
  { title: "Likes", value: 100, rate: 12, isIncrease: true },
  { title: "Comments", value: 100, rate: 12, isIncrease: false },
];

export const areaChartOptions = {
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
    colors:  [
      "var(--primary-purple)", 
      "var(--secondary-purple-light)", 
      "var(--secondary-blue)",  
      "var(--primary-pink)", 
      "var(--secondary-blue)"
    ], 
    strokeColors: "var(--primary-white)", // Border color for markers
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
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    title: {
      text: "Month",
    },
    labels: {
      style: {
        colors: "var(--primary-black)",
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
        colors: "var(--primary-black)",
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
        if (w.config.series[seriesIndex].type === "line") {
          return value; // Show values for line series
        }
        return ""; // Hide values for bar series
      },
    },
  },
  colors: [
    "var(--primary-purple)", 
    "var(--secondary-skyblue)", 
    "var(--secondary-blue)", 
    "var(--primary-pink)", 
    "var(--secondary-blue)"
  ],
};  

export const areaChartSeries = [
  {
    name: "Posts Published",
    type: "bar",
    data: [35, 30, 45, 40, 50, 60, 35, 65, 70, 40, 80],
  },
  {
    name: "Engagement Rate",
    type: "area",
    data: [12, 18, 22, 30, 40, 25, 35, 45, 50, 40, 60],
  },
  {
    name: "Comments",
    type: "line",
    data: [25, 30, 35, 40, 45, 50, 35, 60, 65, 40, 75], 
  },
];

export const barChartOptions = {
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
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    labels: {
      style: {
        colors: "var(--primary-black)",
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
        colors: "var(--primary-black)",
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
  colors:[
    "var(--secondary-skyblue)", 
    "var(--primary-purple)", 
    "var(--secondary-blue)"
  ],
};

export const barChartSeries = [
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

export const donutChartOptions = {
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
  credits: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      innerSize: "50%",
      depth: 45,
      colors: [
        "var(--secondary-skyblue)", 
        "var(--primary-purple)", 
        "var(--primary-pink)", 
        "var(--secondary-yellow)", 
        "var(--secondary-blue)",
        "var(--secondary-red)", 
        "var(--secondary-yellow)", 
      ],
      dataLabels: {
        enabled: true,
        format: "{point.name}: {point.percentage:.1f} %",
        style: {
          colors: "var(--primary-black)",
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

export const pieChart1Data = [
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

export const pieChart2Data = [
  { name: "Technology", y: 30 },
  { name: "Health", y: 22 },
  { name: "Education", y: 18 },
  { name: "Finance", y: 15 },
  { name: "Entertainment", y: 10 },
  { name: "Travel", y: 5 },
];

export const pieChart3Data = [
  { name: "Facebook", y: 30 },
  { name: "Twitter", y: 20 },
  { name: "LinkedIn", y: 15 },
  { name: "Snapchat", y: 10 },
  { name: "Reddit", y: 5 },
];
