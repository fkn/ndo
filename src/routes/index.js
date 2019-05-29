/* eslint-disable global-require */

import { fetchCourse } from '../actions/courses';
import { setSecondMenu } from '../actions/menu';
import { getCourseSecondMenu } from './menu';

// The top-level (parent) route
const routes = {
  path: '',

  // Keep in mind, routes are evaluated in order
  children: [
    {
      path: '/courses',
      load: () => import(/* webpackChunkName: 'courses' */ './courses'),
    },
    {
      path: '/courses/:idCourse',
      async action({ next, store, params }) {
        const child = await next();
        if (store.getState().course.id !== params.idCourse) {
          await store.dispatch(fetchCourse(params.idCourse));
        }
        store.dispatch(
          setSecondMenu('course', getCourseSecondMenu(store.getState().course)),
        );
        return child;
      },
      children: [
        {
          path: '',
          load: () => import(/* webpackChunkName: 'courses' */ './course'),
        },
        {
          path: '/users',
          load: () =>
            import(/* webpackChunkName: 'courses' */ './course-users'),
        },
        {
          path: '/marks',
          load: () =>
            import(/* webpackChunkName: 'courses' */ './course-marks'),
        },
        {
          path: '/:idUnit',
          load: () => import(/* webpackChunkName: 'unit' */ './unit'),
        },
      ],
    },
    {
      path: '/users',
      load: () => import(/* webpackChunkName: 'users' */ './users'),
    },
    {
      path: '/users/:idUser',
      load: () => import(/* webpackChunkName: 'users' */ './user'),
    },
    {
      path: '',
      load: () => import(/* webpackChunkName: 'home' */ './home'),
    },
    {
      path: '/login',
      load: () => import(/* webpackChunkName: 'home' */ './login'),
    },
    // {
    //   path: '/register',
    //   load: () => import(/* webpackChunkName: 'register' */ './register'),
    // },
    {
      path: '/files',
      load: () => import(/* webpackChunkName: 'files' */ './files'),
    },
    {
      path: '/tests',
      load: () => import(/* webpackChunkName: 'tests' */ './tests'),
    },
    {
      path: '/codejudge',
      load: () => import(/* webpackChunkName: 'codejudge' */ './codejudge'),
    },
    {
      path: '/users/:idUser',
      load: () => import(/* webpackChunkName: 'users' */ './user'),
    },
    // Wildcard routes, e.g. { path: '(.*)', ... } (must go last)
    {
      path: '(.*)',
      load: () => import(/* webpackChunkName: 'not-found' */ './not-found'),
    },
  ],

  async action({ next, store, pathname }) {
    // Execute each child route until one of them return the result
    const route = await next();

    if (!pathname.startsWith('/courses/')) {
      store.dispatch(setSecondMenu('course', []));
    }

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - NDO`;
    route.description = route.description || '';

    return route;
  },
};

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.children.unshift({
    path: '/error',
    action: require('./error').default,
  });
}

export default routes;
