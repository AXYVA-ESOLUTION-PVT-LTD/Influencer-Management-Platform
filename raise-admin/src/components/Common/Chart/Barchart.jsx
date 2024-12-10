import React from 'react'
import ApexCharts from 'react-apexcharts';
import { Card, CardBody, CardTitle } from 'reactstrap';

function Barchart({ options, series ,title}) {
  return (
    <>
           <Card>
                <CardBody>
                  <CardTitle tag="h5">{title}</CardTitle>
                  <ApexCharts
                    options={options}
                    series={series}
                    type="bar"
                    height={350}
                  />
                </CardBody>
              </Card>
    </>
  )
}

export default Barchart
