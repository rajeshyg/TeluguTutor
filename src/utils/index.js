export const createPageUrl = (page, params = '') => {
  const routes = {
    'Home': '/',
    'Learn': '/learn',
    'Progress': '/progress',
    'MicroPractice': '/practice'
  };
  const baseUrl = routes[page] || '/';
  return `${baseUrl}${params}`;
};
