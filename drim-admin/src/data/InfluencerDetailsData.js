import '../assets/themes/colors.scss';
// Chart options and series
export const areaChartOptions = {
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
  
  export const areaChartSeries = [
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
  
  export const MainData = [
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
  
  export const chartOptions = {
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
  export const genderChartOptions = {
    ...chartOptions,
    colors: [
      "var(--primary-black)", 
      "var(--primary-purple)", 
      "var(--secondary-blue)"
    ], // Colors for Audience Gender
    title: {
      text: "Audience Gender",
    },
  };
  
  export const ageChartOptions = {
    ...chartOptions,
    colors: [
      "var(--primary-black)", 
      "var(--primary-purple)", 
      "var(--secondary-blue)"
    ],// Colors for Age by Category
    title: {
      text: "Age by Category",
    },
  };
  
  export const languageChartOptions = {
    ...chartOptions,
    colors: [
      "var(--primary-black)", 
      "var(--primary-purple)", 
      "var(--primary-off-white)", 
      "var(--secondary-yellow)", 
      "var(--secondary-red)", 
      "var(--secondary-blue)"
    ],
    title: {
      text: "Audience Language",
    },
  };
  
  // Sample data series for each chart
  export const genderSeries = [44, 33, 23];
  export const ageSeries = [25, 35, 20];
  export const languageSeries = [30, 25, 20, 15, 5, 5];
  
  export const metrics = [
    { title: "Reach", value: "69,76k" },
    { title: "Subscribers", value: "226,07k" },
    { title: "Engagement Rate (ER)", value: "1,2%" },
    { title: "Views", value: "500K" },
  ];
  
  export const metricsData = [
    { title: "Average number of reactions", value: "5796" },
    { title: "Average number of comments", value: "101" },
    { title: "Average number of views", value: "55742" },
    { title: "Reactions of real subscribers", value: "In development" },
    { title: "Number of posts per week", value: "4" },
  ];
  
  export const userData = {
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz9XyMm2fcQCxkFmgn5558mIhd5oZpAKifEA&s",
    name: "Merk Fran",
    profileUrl: "#",
    publication: "200",
    subscribers: "500K",
    subscriptions: "50",
  };
  
  export const cardData = [
    {
      image: "https://via.placeholder.com/150",
      title: "Post 1",
      uploadTime: "5 months ago",
      views: "1.2K",
      likes: "320",
      comments: "45",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Post 2",
      uploadTime: "4 months ago",
      views: "2.1K",
      likes: "410",
      comments: "50",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Post 3",
      uploadTime: "3 months ago",
      views: "900",
      likes: "210",
      comments: "30",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Post 4",
      uploadTime: "2 months ago",
      views: "1.5K",
      likes: "350",
      comments: "55",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Post 5",
      uploadTime: "1 month ago",
      views: "2.3K",
      likes: "480",
      comments: "60",
    },
    {
      image: "https://via.placeholder.com/150",
      title: "Post 6",
      uploadTime: "2 weeks ago",
      views: "3.4K",
      likes: "600",
      comments: "75",
    },
  ];

  export const tagData = [
    { title: "#React", progress: 75 },
    { title: "#JavaScript", progress: 60 },
    { title: "#WebDevelopment", progress: 85 },
    { title: "#Frontend", progress: 50 },
    { title: "#UIUX", progress: 90 },
  ];

  export const subscriberHashtagData = [
    { title: "#Tech", progress: 70 },
    { title: "#AI", progress: 65 },
    { title: "#Programming", progress: 80 },
    { title: "#Coding", progress: 55 },
    { title: "#Innovation", progress: 85 },
  ];

  export const data = [
    {
      added: '2024-09-01 12:00',
      post: 'Sample Post 1',
      dynamics: '',
      type: 'Video',
      er: '0.2',
      likes: '150',
      comments: '45',
      views: '2000',
      videoViews: '1500',
      ad: 'No',
      tags: '#Sample #Video'
    },
    {
      added: '2024-09-02 14:30',
      post: 'Sample Post 2',
      dynamics: '',
      type: 'Image',
      er: '0.1',
      likes: '200',
      comments: '50',
      views: '3000',
      videoViews: '',
      ad: 'Yes',
      tags: '#Sample #Image'
    },
    {
      added: '2024-09-03 09:45',
      post: 'Sample Post 3',
      dynamics: '',
      type: 'Article',
      er: '0.3',
      likes: '250',
      comments: '60',
      views: '5000',
      videoViews: '',
      ad: 'No',
      tags: '#Sample #Article'
    },
    {
      added: '2024-09-04 11:20',
      post: 'Sample Post 4',
      dynamics: '',
      type: 'Video',
      er: '0.15',
      likes: '180',
      comments: '70',
      views: '2200',
      videoViews: '1800',
      ad: 'Yes',
      tags: '#Sample #Video #Tutorial'
    },
    {
      added: '2024-09-05 16:00',
      post: 'Sample Post 5',
      dynamics: '',
      type: 'Infographic',
      er: '0.25',
      likes: '300',
      comments: '80',
      views: '4000',
      videoViews: '',
      ad: 'No',
      tags: '#Sample #Infographic'
    }
  ];
  


export const columns = [
  {
    Header: 'Added',
    accessor: 'added',
  },
  {
    Header: 'Post',
    accessor: 'post',
  },
  {
    Header: 'Dynamics',
    accessor: 'dynamics',
  },
  {
    Header: 'Type',
    accessor: 'type',
  },
  {
    Header: 'ER',
    accessor: 'er',
  },
  {
    Header: 'Likes',
    accessor: 'likes',
  },
  {
    Header: 'Comments',
    accessor: 'comments',
  },
  {
    Header: 'Views',
    accessor: 'views',
  },
  {
    Header: 'Video Views',
    accessor: 'videoViews',
  },
  {
    Header: 'Ad',
    accessor: 'ad',
  },
  {
    Header: 'Tags',
    accessor: 'tags',
  }
];
