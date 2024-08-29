import React from 'react'
import { Card, CardBody, CardTitle } from 'reactstrap'
import ApexCharts from 'react-apexcharts';

function Mixchart({ options, series ,title}) {
    return (
      <Card>
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <ApexCharts
            options={options}
            series={series}
            type="line"
            height={350}
          />
        </CardBody>
      </Card>
    );
  }

export default Mixchart
