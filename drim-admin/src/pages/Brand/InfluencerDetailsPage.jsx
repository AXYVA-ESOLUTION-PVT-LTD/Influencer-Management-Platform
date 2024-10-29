import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Mixchart from "../../components/Common/Chart/Mixchart";
import ApexCharts from "react-apexcharts";
import MetricCard from "../../components/Common/MetricCard";
import MetricListCard from "../../components/Common/MetricListCard";
import ReactionRangeCard from "../../components/Common/ReactionRangeCard";
import DataCard from "../../components/Common/DataCard";
import UserDataCard from "../../components/Common/UserDataCard";
import {
  ageChartOptions,
  ageSeries,
  cardData,
  columns,
  data,
  genderChartOptions,
  genderSeries,
  languageChartOptions,
  languageSeries,
  MainData,
  metrics,
  metricsData,
  subscriberHashtagData,
  tagData,
  userData,
} from "../../data/InfluencerDetailsData";
import { areaChartOptions, areaChartSeries } from "../../data/DashboardData";
import CardComponent from "../../components/Influencer/CardComponent/CardComponent";
import ProgressBox from "../../components/Influencer/ProgressBox/ProgressBox";
import TableContainer from "../../components/Common/TableContainer";

function InfluencerDetailsPage() {
  document.title = "Influencers | Brandraise ";

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleViewClick = (publication) => {
    setSelectedPublication(publication);
    toggleModal();
  };



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col md="6" className="mb-4">
              <UserDataCard
                imageUrl={userData.imageUrl}
                name={userData.name}
                profileUrl={userData.profileUrl}
                publication={userData.publication}
                subscribers={userData.subscribers}
                subscriptions={userData.subscriptions}
              />
            </Col>
            <Col md="6" className="mb-4">
              <Card className="h-100">
                <CardBody>
                  <Row>
                    {metrics.map((metric, index) => (
                      <Col md="6" className="mb-3" key={index}>
                        <MetricCard title={metric.title} value={metric.value} />
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            {MainData.map((data, index) => (
              <DataCard
                key={index}
                title={data.title}
                desc={data.desc}
                data={data.data}
                tag={data.tag}
              />
            ))}
          </Row>
          <Row>
            {/* First Column */}
            <Col md="6" className="mb-1">
              <Row>
                <Col md="12" className="mb-4">
                  <ReactionRangeCard
                    title="Range of reactions"
                    percentage="88,35%"
                    badgeColor="success"
                    badgeText="Good"
                    description="Influencer's audience reacts to his/her content naturally"
                  />
                </Col>
                <Col md="12">
                  <MetricListCard metrics={metricsData} />
                </Col>
              </Row>
            </Col>
            <Col md="6" className="mb-1">
              <Mixchart
                options={areaChartOptions}
                series={areaChartSeries}
                title="Post statistics"
              />
            </Col>
          </Row>
          <Row>
            <Col className="mb-4">
              <Mixchart
                options={areaChartOptions}
                series={areaChartSeries}
                title="Post statistics"
              />
            </Col>
          </Row>
          <Card className="h-100">
            <CardBody>
              <CardTitle tag="h5" className="mb-5">
                Audience Metrics
              </CardTitle>
              <Row>
                <Col md="4">
                  <Card>
                    <ApexCharts
                      options={genderChartOptions}
                      series={genderSeries}
                      type="donut"
                      height={300}
                    />
                  </Card>
                </Col>
                <Col md="4">
                  <Card>
                    <ApexCharts
                      options={ageChartOptions}
                      series={ageSeries}
                      type="donut"
                      height={300}
                    />
                  </Card>
                </Col>
                <Col md="4">
                  <Card>
                    <ApexCharts
                      options={languageChartOptions}
                      series={languageSeries}
                      type="donut"
                      height={300}
                    />
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card className="p-4 mb-4">
            <Row>
              {cardData.map((data, index) => (
                <CardComponent
                  key={index}
                  image={data.image}
                  title={data.title}
                  uploadTime={data.uploadTime}
                  views={data.views}
                  likes={data.likes}
                  comments={data.comments}
                />
              ))}
            </Row>
          </Card>
          <Row>
            <Col md="6" className="mb-4">
              <ProgressBox title="Tags" data={tagData} />
            </Col>
            <Col md="6" className="mb-4">
              <ProgressBox
                title="Subscriber Hashtags"
                data={subscriberHashtagData}
              />
            </Col>
          </Row>

          <Card>
      <CardBody>
        <CardTitle tag="h5">Publications</CardTitle>
        <TableContainer
          columns={columns}
          data={data}
          isGlobalFilter={true}
          isAddOptions={false}
          customPageSize={10}
          className="custom-header-css"
          isPagination={true}
        />
      </CardBody>
    </Card>

        </Container>
      </div>
    </React.Fragment>
  );
}

export default InfluencerDetailsPage;
