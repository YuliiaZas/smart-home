export const ERROR_MESSAGES = {
  emptyHomeData: {
    dashboards: 'You don’t have any dashboards yet.',
    tabs: 'You don’t have any tabs in this dashboard.',
    create: 'They’ll appear here as soon as you create them.',
  },
  login: {
    required: 'This field is required',
    minlength: (minLength: number) => `Minimum length is ${minLength}`,
    invalid: 'Invalid username or password',
  },
  notFound: {
    title: '404 - Page Not Found',
    description: 'Sorry, the page you are looking for does not exist.',
    homeLink: 'Return to Home Page',
  },
};
