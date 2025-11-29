export const createPageUrl = (page, params = '') => {
  const routes = {
    'Home': '/',
    'Learn': '/learn',
    'Progress': '/progress',
    'MicroPractice': '/practice',
    'Login': '/login'
  };
  const baseUrl = routes[page] || '/';
  return `${baseUrl}${params}`;
};
