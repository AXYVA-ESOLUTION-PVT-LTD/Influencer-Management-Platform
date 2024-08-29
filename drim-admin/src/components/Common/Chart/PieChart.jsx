import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3d from "highcharts/highcharts-3d";
import React from 'react'
import { Card, CardBody, CardTitle } from 'reactstrap'
Highcharts3d(Highcharts); 
function PieChart({ chartoptions, chartdata ,title}) {
  return (
    <>
         <Card>
                <CardBody>
                  <CardTitle tag="h5">{title}</CardTitle>
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                      ...chartoptions,
                      series: [
                        { ...chartoptions.series[0], data: chartdata },
                      ],
                    }}
                  />
                </CardBody>
              </Card>
    </>
  )
}

export default PieChart
