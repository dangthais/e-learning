import { Badge, Button, Col, Row, Tag } from "antd";
import { HiUserGroup } from 'react-icons/hi';
import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { imageUrl } from "../../../common/imageUrl";
import { useGetCoursesQuery } from '../../../services/courses';
import { useProfileQuery } from '../../../services/users';

function Courses() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filterHistory, setFilterHistory] = useState();
  const { data: courses } = useGetCoursesQuery();
  const { data: users, isFetching } = useProfileQuery();

  useEffect(() => {
    if (!isFetching && courses) {
      const { data } = courses;
      setLoading(true);
      if ((!users?.id)) return setFilterHistory(data);
    };

    if (courses && users) {
      const { histories } = users;
      if (histories.length == 0) {
        const { data } = courses;
        setLoading(true);
        return setFilterHistory(data);
      };

      let filterCourse = histories.reduce((accumulator, currentValue) => {
        let existCourseId = accumulator.find((item) => item.course_id == currentValue.course_id);
        if (existCourseId) {
          existCourseId.lessonId.push(currentValue.lesson_id);
        }
        else {
          accumulator.push({
            course_id: currentValue.course_id,
            lessonId: [currentValue.lesson_id]
          });
        }
        return accumulator;
      }, []);

      let historyNew = filterCourse.map((item) => {
        return {
          courseId: item.course_id,
          lessonId: Math.max.apply(null, item.lessonId)
        }
      });

      const mapHistory = new Map(historyNew.map((item) => [item.courseId, item]));
      let newCourse = courses.data.map((items) => {
        let arrCourse = [];
        items.courses.map((course) => {
          const { studies } = course;
          let existLesson = course;
          const checkExistUserInCourse = studies.some((item) => item.user_id == users.id);
          const checkExistCourseId = mapHistory.get(course.id);
          if (checkExistCourseId) {
            existLesson = { ...course, completed: checkExistCourseId.lessonId }
          };
          arrCourse.push(existLesson)
        })
        return { ...items, courses: arrCourse };
      });
      setFilterHistory(newCourse)
      setLoading(true);
    }
  }, [courses, users, isFetching]);

  return (
    <div className="wrapper__courses">
      <div className="courses">
        {loading && filterHistory.map((course) => (
          <div key={course.id} className="course-body">
            {course?.courses?.length > 0 && <>
              <h3 className="course-name">{course.name}</h3>
              <Row justify='start' align='middle' gutter={[40, 30]}>
                {course?.courses?.map((item) => (
                  <Col key={item.id} xl={6} md={6} className="less-item">
                    <Link
                      to={item?.completed ? `/lessons/${item?.completed}` : `/courses/${item.id}`}
                      className="thumbnail-link"
                    >
                      <Badge.Ribbon
                        text={item.is_free == 1 ? 'Miễn phí' : 'Mất phí'}
                        color={item.is_free == 1 ? 'cyan' : 'volcano'}
                      >
                        <img
                          src={`${imageUrl}${item.image}`}
                          className="avatar-courses"
                          alt={`lesson-${item.id}`}
                        />
                      </Badge.Ribbon>
                      <div className="overlay">
                        {item?.completed
                          ? <Button
                            shape="round"
                            className="btn-action-views"
                            onClick={() => navigate(`/lessons/${item?.completed}`)}
                          >Tiếp tục học
                          </Button>
                          : <Button shape="round" className="btn-action-views">Xem khóa học</Button>
                        }
                      </div>
                    </Link>
                    <Row justify='space-between' align='middle' className="horizontal-info">
                      <Col xl={18}>
                        <h6>
                          <Link to={`/courses/${item.id}`}>{item.name}</Link>
                        </h6>
                      </Col>
                      <Col xl={4}>
                        <div className="subcribe">
                          <Tag color="blue">
                            <HiUserGroup style={{ paddingBottom: 3 }} size={16} />
                            <span>{item.study_count}</span>
                          </Tag>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                ))}
              </Row>
            </>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;
