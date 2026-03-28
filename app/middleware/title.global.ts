export default defineNuxtRouteMiddleware((to) => {
  // A dictionary mapping paths to titles

  const titles = {
    '/about': 'About Us',
    '/academics': 'Academics',
    '/news-events': 'News & Events',
    '/alumni': 'Alumni',
    '/contact': 'Contact Us'
  };

  // Check if the path exists in our dictionary, otherwise set a default
  to.meta.pageTitle = titles[to.path] || '';
});