import React from 'react'
import { Card, CardBody, CardTitle, Spinner } from 'reactstrap'
import ApexCharts from 'react-apexcharts';

function Mixchart({ options, series ,title, loading}) {
    return (
      <Card>
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          {loading ? (
          <div className="d-flex justify-content-center align-items-center chart-loading-container">
            <Spinner color="primary chart-loading-spinner"/>
          </div>
        ) : (
          <ApexCharts
            options={options}
            series={series}
            type="line"
            height={350}
          />
        )}
        </CardBody>
      </Card>
    );
  }

export default Mixchart
