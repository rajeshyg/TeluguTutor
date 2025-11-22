export const createPageUrl = (page) => {
  const routes = {
    'Home': '/',
    'Learn': '/learn',
    'Progress': '/progress',
    'MicroPractice': '/practice'
  };
  return routes[page] || '/';
};
