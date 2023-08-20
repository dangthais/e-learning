import {Avatar, Badge, Card, Col, Image, Popover, Row, Typography} from "antd";
import {IoMdNotifications} from 'react-icons/io';
import {Link} from "react-router-dom";
import Logo from '../../../../public/images/logo_ong_vang.jpg';
import profile from '../../../../public/images/profile.png';
import UserMenu from '../../../components/shared/UserMenu';
import {useProfileQuery} from "../../../services/users/index.jsx";
import {useGetMyCourseQuery} from "../../../services/courses/index.jsx";
import {imageUrl} from "../../../common/imageUrl.jsx";
import {useGetPostsByUserQuery} from "../../../services/forum/index.jsx";
import {handleDisplayCkeditor} from "../../../common/handleDisplayCkeditor.jsx";

const {Text, Title, Paragraph,} = Typography

function Profile() {
  const {data: user} = useProfileQuery()
  const {data} = useGetMyCourseQuery()
  const {data: posts} = useGetPostsByUserQuery()
  return (
    <div className="wrapper__profile">
      <div className="profile--header">
        <Row align="middle" className='horizontal-header'>
          <Col sm={4} md={6} lg={12} xl={12}>
            <Row justify="start" align="middle" className='navbar-logo'>
              <Link to='/'>
                <img src={Logo} alt='logo'/>
              </Link>
              <h4>FptPolytechnic</h4>
            </Row>
          </Col>
          <Col sm={4} md={6} lg={12} xl={12}>
            <Row justify="end" align="middle" className='navbar-action'>
              <>
                <Col flex='60px' className='notification'>
                  <Popover
                    placement="bottomRight"
                    title={<h4 className='title-notification'>Thông báo</h4>}
                    trigger="click"
                  >
                    <Badge count={2} size="small">
                      <IoMdNotifications size='2em' className='icon-light'/>
                    </Badge>
                  </Popover>
                </Col>
                <Col flex='35px' className='avatar'>
                  <Popover
                    placement="bottomRight"
                    content={<UserMenu/>}
                    trigger="click"
                  >
                    <Avatar src={user?.image} size={35} alt='avatar'/>
                  </Popover>
                </Col>
              </>
            </Row>
          </Col>
        </Row>
      </div>
      <div className="profile--content">
        <div className="background-profile" style={backgroundProfile}>
          <Row justify='space-between' align='bottom' className="info-my">
            <Col xl={9}>
              <Avatar src={user?.image} size={156} alt='avatar'/>
            </Col>
            <Col xl={14} className="info--text">
              <h5>{user?.name}</h5>
            </Col>
          </Row>
        </div>
        <div className="course--my">
          <h5 style={{marginBottom: 10}}>Các khóa học đã tham gia</h5>
          {data && data.courses.map((course, index) => {
            return (
              <div key={index}>
                <Row justify='start' align='start' gutter={[20, 50]}>
                  {course.studies.map(item => {
                    const status = item?.status === 0 ? "Đang học" : "Đã hoàn thành"
                    const color = item?.status === 0 ? "pink" : "green"
                    return (
                      <Badge.Ribbon text={status} color={color}>
                        <Card type="inner" title={course?.name} hoverable>
                          <Row gutter={20}>
                            <Col span={15}>
                              <Paragraph
                                ellipsis={{
                                  rows: 5,
                                }}
                              >
                                {course?.featured}
                              </Paragraph>
                            </Col>
                            <Col span={9}>
                              <Image preview={false} src={`${imageUrl}${course?.image}`} height={160} alt='avatar'/>
                            </Col>
                          </Row>
                        </Card>
                      </Badge.Ribbon>
                    )
                  })}
                </Row>
              </div>
            )
          })}
        </div>
        <div className="course--my1">
          <h5 style={{marginBottom: 10}}>Các bài viết của bạn</h5>
          {posts && posts.map(post => {
            return (
              <div key={post.id}>
                <Card type="inner" title={post.title} hoverable>
                  <span
                    style={{lineHeight: 2.5, fontWeight: 500, fontSize: 20}}
                    dangerouslySetInnerHTML={{__html: handleDisplayCkeditor(post?.content)}}
                  ></span>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

const backgroundProfile = {
  backgroundImage: `url(${profile})`,
  backgroundSize: 'cover',
  width: '100%',
  height: '300px',
  borderRadius: '5px'
}

export default Profile;
