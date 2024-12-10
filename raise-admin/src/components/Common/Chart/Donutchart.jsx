import React from 'react';
import ApexCharts from 'react-apexcharts'; 

const Donutchart = ({ options, series }) => {
  return (
    <ApexCharts
      options={options}
      series={series}
      type="donut"
      height={300}
    />
  );
};

export default Donutchart;
