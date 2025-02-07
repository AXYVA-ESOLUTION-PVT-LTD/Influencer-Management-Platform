import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "reactstrap";
import PLATFORMS from '../../constants/platform';
// Import Breadcrumb
import StatisticsBox from "../../components/Common/StatisticsBox";
import Mixchart from "../../components/Common/Chart/Mixchart";
import Barchart from "../../components/Common/Chart/Barchart";
// i18n
import { withTranslation } from "react-i18next";

import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import {
  areaChartOptions,
  barChartOptions
} from "../../data/DashboardData";
import { useDispatch, useSelector } from "react-redux";
import {
  getMonthlyPerformanceAnalytics,
  getTicketEngagementStatistics,
  getFacebookUserData,
  getFacebookMonthlyPerformanceAnalytics,
  getTikTokUserData,
  getInstagramUserData,
  getInstagramMonthlyPerformanceAnalytics,
} from "../../store/dashboard/actions";
Highcharts3d(Highcharts);

const DashboardOverview = (props) => {
  // Meta title
  document.title = "Influencer Dashboard | Brandraise";

  const dispatch = useDispatch();
  const {
    loadingUserData,
    loadingAnalytics,
    dashboardData,
    facebookUserData,
    instagramUserData,
    monthlyPostCount,
    monthlyEngagementRate,
    monthlyCommentCount,
    approvedCounts,
    declinedCounts,
    onHoldCounts,
    loadingTicketStatistics,
  } = useSelector((state) => state.Dashboard);

  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    let userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);

    if (userData.platform == PLATFORMS.TIKTOK) {
      dispatch(getTikTokUserData());
      dispatch(getMonthlyPerformanceAnalytics());
    } else if (userData.platform == PLATFORMS.FACEBOOK) {
      dispatch(getFacebookUserData());
      dispatch(getFacebookMonthlyPerformanceAnalytics());
    }
    else if (userData.platform == PLATFORMS.INSTAGRAM) {
      dispatch(getInstagramUserData());
      dispatch(getInstagramMonthlyPerformanceAnalytics());
    }
    // Common engagement statistics API call
    dispatch(getTicketEngagementStatistics());
  }, [dispatch]);

  useEffect(() => {
    let userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);

    if (userData.platform == PLATFORMS.TIKTOK) {
      if (dashboardData?.userInfo?.user && dashboardData?.userVideodata) {
        setUserInfo(dashboardData.userInfo.user);
      }
    } else if (userData.platform == PLATFORMS.FACEBOOK) {
      setUserInfo(facebookUserData);
    }
    else if (userData.platform == PLATFORMS.INSTAGRAM) {
      setUserInfo(instagramUserData);
    }
    
  }, [dashboardData, facebookUserData ,instagramUserData]);

  const formattedEngagementRate = Array.isArray(monthlyEngagementRate)
    ? monthlyEngagementRate.map((rate) => parseFloat(rate.toFixed(1)))
    : [];

  const areaChartSeriesTemplate = [
    {
      name: "Posts Published",
      type: "bar",
      data: monthlyPostCount,
    },
    {
      name: "Engagement Rate",
      type: "area",
      data: formattedEngagementRate,
    },
    {
      name: "Comments",
      type: "line",
      data: monthlyCommentCount,
    },
  ];

  let userDataString = localStorage.getItem("user");
  const userData = JSON.parse(userDataString);

  const dataBoxes =
    userData.platform === PLATFORMS.TIKTOK
      ? [
          {
            title: "Followers",
            value: userInfo?.follower_count,
          },
          {
            title: "Likes",
            value: userInfo?.likes_count,
          },
          {
            title: "Videos",
            value: userInfo?.video_count,
          },
          {
            title: "Following",
            value: userInfo?.following_count,
          },
        ]
      : userData.platform === PLATFORMS.FACEBOOK
      ? [
          {
            title: "Friends",
            value: userInfo?.friends_count,
          },
          {
            title: "Likes",
            value: userInfo?.totalReactions,
          },
          {
            title: "Post",
            value: userInfo?.post_count,
          },
          {
            title : "Comment",
            value : userInfo?.totalComments
          }
        ]
        :userData.platform === PLATFORMS.INSTAGRAM
        ? [
          {
            title: "Followers", 
            value: userInfo?.followers_count,
          },
          {
            title: "Following", 
            value: userInfo?.follows_count,
          },
          {
            title: "Posts", 
            value: userInfo?.totalPosts,
          },
          {
            title: "Likes", 
            value: userInfo?.totalLikes,
          },
          ]
      : [];

  const barChartSeries = [
    {
      name: "Approved",
      data: approvedCounts,
    },
    {
      name: "Declined",
      data: declinedCounts,
    },
    {
      name: "On hold",
      data: onHoldCounts,
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          {/* <Breadcrumbs
            title={props.t("Dashboard")}
            breadcrumbItem={props.t("Influencer Dashboard")}
          /> */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-size-18 text-uppercase">
              Influencer Dashboard
            </h4>
          </div>
          <Row className="mt-4 text-center">
            {loadingUserData ? (
              <div className="d-flex justify-content-center align-items-center w-100 box-loading-container">
                <Spinner color="primary" className="chart-loading-spinner" />
              </div>
            ) : (
              dataBoxes.map((box, index) => (
                <StatisticsBox key={index} box={box} />
              ))
            )}
          </Row>
          <Row className="mt-4">
            <Col md={6}>
              <Mixchart
                options={areaChartOptions}
                series={areaChartSeriesTemplate}
                title="Monthly Performance"
                loading={loadingAnalytics}
              />
            </Col>
            <Col md={6}>
              <Barchart
                options={barChartOptions}
                series={barChartSeries}
                title="Engagement Statistics"
                loading={loadingTicketStatistics}
              />
            </Col>
          </Row>
          {/* <Row>
            <Card className="p-4 mb-4">
              <Row>
                {userVideodata?.length > 0 ? (
                  userVideodata.map((video, index) => (
                    <CardComponent
                      key={index}
                      image={video.cover_image_url}
                      title={video.title}
                      uploadTime={new Date(
                        video.create_time * 1000
                      ).toLocaleString()}
                      views={video.view_count}
                      likes={video.like_count}
                      comments={video.comment_count}
                      share_url={video.share_url}
                    />
                  ))
                ) : (
                  <div>No video data found</div>
                )}
              </Row>
            </Card>
          </Row> */}
          {/* <Row>
            <Col md={4}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart1Data}
                title="Gender Distribution"
              />
            </Col>
            <Col md={4}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart2Data}
                title="Age Distribution"
              />
            </Col>
            <Col md={4}>
              <PieChart
                chartoptions={donutChartOptions}
                chartdata={pieChart3Data}
                title="Language Distribution"
              />
            </Col>
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(DashboardOverview);
