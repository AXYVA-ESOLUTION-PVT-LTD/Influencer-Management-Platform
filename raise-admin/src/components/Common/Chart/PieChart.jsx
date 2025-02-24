import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3d from "highcharts/highcharts-3d";
import React from "react";
import { Alert, Card, CardBody, CardTitle, Spinner } from "reactstrap";
Highcharts3d(Highcharts);

function PieChart({ chartoptions, chartdata, title, loading }) {
  if (!chartdata) {
    return (
      <Card>
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <Alert color="danger">
            <i className="fas fa-exclamation-circle"></i> No data in the metrics
          </Alert>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center chart-loading-container">
              <Spinner color="primary chart-loading-spinner" />
            </div>
          ) : (
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                ...chartoptions,
                series: [{ ...chartoptions.series[0], data: chartdata }],
              }}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
}

export default PieChart;
