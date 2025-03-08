import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Spinner,
} from "reactstrap";
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
  metricsData,
  subscriberHashtagData,
  tagData,
} from "../../data/InfluencerDetailsData";
import { areaChartOptions, donutChartOptions } from "../../data/DashboardData";
import CardComponent from "../../components/Influencer/CardComponent/CardComponent";
import ProgressBox from "../../components/Influencer/ProgressBox/ProgressBox";
import TableContainer from "../../components/Common/TableContainer";
import Pagination from "../../components/Common/Pagination";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getInfluencerBasicData,
  getInfluencerDemographicData,
  getInfluencerMediaData,
  getInfluencerMonthlyStatistics,
  getInfluencerPostStatistics,
  getInfluencerProfile,
  getInfluencerPublicationData,
} from "../../store/influencers/actions";
import PieChart from "../../components/Common/Chart/PieChart";

function InfluencerDetailsPage() {
  document.title = "Influencers | Brandraise ";

  const dispatch = useDispatch();

  const {
    influencerProfile,
    influencerBasicData,
    loadingBasicData,
    influencerPostStatistics,
    influencerMonthlyStatistics,
    influencerDemographicData,
    influencerPublicationData,
    influencerMediaData,
    totalRecords,
    loadingProfile,
    loadingPostStatistics,
    loadingMonthlyStatistics,
    loadingDemographicData,
    loadingPublicationData,
    loadingMediaData,
    errorProfile,
    errorBasicData,
    errorPostStatistics,
    errorMonthlyStatistics,
    errorDemographicData,
    errorPublicationData,
    errorMediaData,
  } = useSelector((state) => state.Influencer);
  const [limit, setLimit] = useState(10);
  const [pageCount, setPageCount] = useState(0);
  const [filterHeader, setFilterHeader] = useState({
    "opportunityId.title": true,
    createdAt: true,
    "influencerId.username": true,
    "influencerId.platform": true,
    status: true,
    type: true,
    publicationLink: true,
    screenshot: true,
    engagementRate: true,
    followerCount: true,
    likeCount: true,
    commentCount: true,
    shareCount: true,
    viewCount: true,
  });

  const { id } = useParams();
  useEffect(() => {
    dispatch(getInfluencerProfile(id));
    dispatch(getInfluencerBasicData(id));
    dispatch(getInfluencerPostStatistics(id));
    dispatch(getInfluencerMonthlyStatistics(id));
    dispatch(getInfluencerDemographicData(id));
    dispatch(getInfluencerPublicationData({ limit, pageCount, id }));
    dispatch(getInfluencerMediaData(id));
  }, [id]);

  useEffect(() => {
    dispatch(getInfluencerPublicationData({ limit, pageCount, id }));
  }, [limit, pageCount]);

  const getMetrics = (data) => {
    if (!data) return [];

    if (data.tiktok) {
      return [
        { title: "Followers", value: data.tiktok.follower_count },
        { title: "Likes", value: data.tiktok.likes_count },
        { title: "Videos", value: data.tiktok.video_count },
        { title: "Following", value: data.tiktok.following_count },
      ];
    }

    if (data.instagram) {
      return [
        { title: "Followers", value: data.instagram.followers_count },
        { title: "Following", value: data.instagram.follows_count },
        { title: "Posts", value: data.instagram.totalPosts },
        { title: "Total Likes", value: data.instagram.totalLikes },
      ];
    }

    if (data.facebook) {
      return [
        { title: "Friends", value: data.facebook.friends_count },
        { title: "Reactions", value: data.facebook.totalReactions },
        { title: "Posts", value: data.facebook.post_count },
        { title: "Comments", value: data.facebook.totalComments },
      ];
    }

    if (data.youtube) {
      return [
        { title: "Subscribers", value: data.youtube.totalSubscribers },
        { title: "Videos", value: data.youtube.totalVideos },
        { title: "Playlists", value: data.youtube.totalPlaylists },
        { title: "Total Likes", value: data.youtube.totalLikes },
      ];
    }

    return [];
  };

  const MonthlyPostAnalyticsData = [
    {
      name: "Posts Published",
      type: "bar",
      data: influencerMonthlyStatistics?.postCountArray || [],
    },
    {
      name: "Engagement Rate",
      type: "area",
      data: influencerMonthlyStatistics?.engagementRateArray || [],
    },
    {
      name: "Comments",
      type: "line",
      data: influencerMonthlyStatistics?.commentCountArray || [],
    },
  ];

  const PostAnalyticsData = [
    {
      name: "Posts Published",
      type: "bar",
      data: influencerPostStatistics?.approvedCounts || [],
    },
    {
      name: "Engagement Rate",
      type: "area",
      data: influencerPostStatistics?.declinedCounts || [],
    },
    {
      name: "Comments",
      type: "line",
      data: influencerPostStatistics?.onHoldCounts || [],
    },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "opportunityId.title",
        isVisible: filterHeader.project,
      },
      {
        Header: "Post Date",
        accessor: "createdAt",
        isVisible: filterHeader.postDate,
        Cell: ({ value }) => {
          const date = new Date(value);
          const formattedDate = `${String(date.getDate()).padStart(
            2,
            "0"
          )}.${String(date.getMonth() + 1).padStart(
            2,
            "0"
          )}.${date.getFullYear()} ${String(date.getHours()).padStart(
            2,
            "0"
          )}:${String(date.getMinutes()).padStart(2, "0")}`;
          return formattedDate;
        },
      },
      {
        Header: "Influencer",
        accessor: "influencerId.username",
        isVisible: filterHeader.influencer,
      },
      {
        Header: "Social Network",
        accessor: "influencerId.platform",
        isVisible: filterHeader.socialNetwork,
      },
      {
        Header: "Status",
        accessor: "status",
        isVisible: filterHeader.status,
        Cell: ({ value }) => {
          let badgeClass = "";
          let badgeText = value;

          switch (value) {
            case "Pending":
              badgeClass = "badge bg-warning";
              badgeText = "Pending";
              break;
            case "Declined":
              badgeClass = "badge bg-danger";
              badgeText = "Declined";
              break;
            case "Cancelled":
              badgeClass = "badge bg-secondary";
              badgeText = "Cancelled";
              break;
            case "Published":
              badgeClass = "badge bg-success";
              badgeText = "Published";
              break;
            default:
              badgeClass = "badge bg-light";
              badgeText = "Unknown";
              break;
          }

          return <span className={badgeClass}>{badgeText}</span>;
        },
      },
      { Header: "Type", accessor: "type", isVisible: filterHeader.type },
      {
        Header: "Publication Link",
        accessor: "publicationLink",
        isVisible: true,
        Cell: ({ value }) => {
          return (
            <a href={value} target="_blank" rel="noopener noreferrer">
              {value}
            </a>
          );
        },
      },
      {
        Header: "Screen Shots",
        accessor: "screenshot",
        isVisible: true,
        Cell: ({ value }) => {
          const screenshot = value;

          return (
            <div>
              {screenshot && (
                <div>
                  <span
                    onClick={() => handleImageClick(screenshot)}
                    className="publication-screenshot-link"
                  >
                    Image
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        Header: "Engagement Rate (ER)",
        accessor: "engagementRate",
        isVisible: filterHeader.ER,
      },
      {
        Header: "Follower",
        accessor: "followerCount",
        isVisible: filterHeader.follower,
      },
      {
        Header: "Like",
        accessor: "likeCount",
        isVisible: filterHeader.likes,
      },
      {
        Header: "Comments",
        accessor: "commentCount",
        isVisible: filterHeader.comments,
      },
      {
        Header: "share",
        accessor: "shareCount",
        isVisible: filterHeader.shares,
      },
      {
        Header: "Views",
        accessor: "viewCount",
        isVisible: filterHeader.views,
      },
    ],
    [filterHeader]
  );

  const visibleColumns = useMemo(
    () => columns.filter((column) => filterHeader[column.accessor]),
    [columns, filterHeader]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col md="6">
              <UserDataCard
                userData={influencerProfile}
                loading={loadingProfile}
              />
            </Col>
            <Col md="6">
              <Card className="influencer-custom-height">
                <CardBody>
                  <Row>
                    {loadingBasicData ? (
                      <Col md="12" className="text-center">
                        <Spinner color="primary" />
                      </Col>
                    ) : (
                      getMetrics(influencerBasicData).map((metric, index) => (
                        <Col md="6" key={index}>
                          <MetricCard
                            title={metric.title}
                            value={metric.value}
                          />
                        </Col>
                      ))
                    )}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="6" className="mb-1">
              <Mixchart
                options={areaChartOptions}
                series={MonthlyPostAnalyticsData}
                title="Monthly Post Analytics"
                loading={loadingMonthlyStatistics}
              />
            </Col>
            <Col md="6" className="mb-1">
              <Mixchart
                options={areaChartOptions}
                series={PostAnalyticsData}
                title="Post Analytics"
                loading={loadingPostStatistics}
              />
            </Col>
          </Row>
          <Card className="h-100">
            <CardBody>
              <CardTitle tag="h5" className="mb-5">
                Audience Metrics
              </CardTitle>
              <Row>
                <Col md={4}>
                  <PieChart
                    chartoptions={donutChartOptions}
                    chartdata={
                      influencerDemographicData?.genderDemographics || []
                    }
                    title="Gender Distribution"
                    loading={loadingDemographicData}
                  />
                </Col>
                <Col md={4}>
                  <PieChart
                    chartoptions={donutChartOptions}
                    chartdata={influencerDemographicData?.ageDemographics || []}
                    title="Age Distribution"
                    loading={loadingDemographicData}
                  />
                </Col>
                <Col md={4}>
                  <PieChart
                    chartoptions={donutChartOptions}
                    chartdata={influencerDemographicData?.countryViews || []}
                    title="Location Distribution"
                    loading={loadingDemographicData}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>

          <div className="media-scroll-container">
            <Row>
              {loadingMediaData ? (
                <Col md="12" className="text-center">
                  <Spinner color="primary" />
                </Col>
              ) : influencerMediaData && influencerMediaData.length > 0 ? (
                influencerMediaData.map((data, index) => (
                  <CardComponent
                    key={index}
                    image={data.post_image_url}
                    title={data.post_title || "Untitled Post"}
                    uploadTime={new Date(
                      data.post_created_time
                    ).toLocaleDateString()}
                    views={data.view_count || 0}
                    likes={data.like_count || 0}
                    comments={data.comment_count || 0}
                    share_url={data.post_url}
                    platform={data.platform}
                  />
                ))
              ) : (
                <p>No media posts available</p>
              )}
            </Row>
          </div>

          <Card>
            <CardBody>
              {loadingPublicationData ? (
                <div className="text-center space-top">
                  <Spinner style={{ color: "var(--primary-purple)" }} />{" "}
                </div>
              ) : (
                <>
                  {influencerPublicationData?.length ? (
                    <>
                      <CardTitle tag="h5">Publications</CardTitle>
                      <TableContainer
                        columns={visibleColumns}
                        data={influencerPublicationData}
                        isGlobalFilter={true}
                        isAddOptions={false}
                        customPageSize={10}
                        className="custom-header-css"
                        isPagination={false}
                      />
                      <Pagination
                        totalData={totalRecords}
                        setLimit={setLimit}
                        setPageCount={setPageCount}
                        limit={limit}
                        pageCount={pageCount}
                        currentPage={pageCount}
                      />
                    </>
                  ) : (
                    <h1 className="text-center space-top">
                      No publications Found
                    </h1>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default InfluencerDetailsPage;
