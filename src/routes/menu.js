/* eslint-disable import/prefer-default-export */

export function getCourseSecondMenu(course) {
  return [
    {
      id: course.id,
      title: 'Units',
      link: `/courses/${course.id}`,
    },
    {
      id: `${course.id}/users`,
      title: 'Users',
      link: `/courses/${course.id}/users`,
    },
    {
      id: `${course.id}/marks`,
      title: 'Marks',
      link: `/courses/${course.id}/marks`,
    },
  ];
}
