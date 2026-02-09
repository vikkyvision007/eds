import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Load nav as fragment (the Google Doc content)
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  if (fragment) {
    // Add the content from the fragment HTML to the block
    block.innerHTML = fragment.innerHTML;
  }

  // Get the logo and navigation wrapper
  const logoWrapper = block.firstElementChild;
  const navWrapper = block.lastElementChild;

  // Add classes to the elements
  if (logoWrapper) {
    // Check if the first child is an image, otherwise it's text
    const logoLink = logoWrapper.querySelector('a') || document.createElement('a');
    if (!logoLink.href) logoLink.href = '/';
    logoLink.classList.add('logo');

    // Wrap content if it isn't linked already
    if (!logoLink.parentElement.isEqualNode(logoWrapper)) {
      logoWrapper.innerHTML = '';
      logoWrapper.appendChild(logoLink);
    }
  }

  if (navWrapper) {
    navWrapper.classList.add('nav-menu');
    // Ensure all links are wrapped in a <nav> for semantic HTML and styling
    const nav = document.createElement('nav');
    navWrapper.querySelectorAll('a').forEach((link) => {
      nav.appendChild(link);
    });
    navWrapper.innerHTML = '';
    navWrapper.appendChild(nav);
  }

  // Add active class to current page link
  const currentPath = window.location.pathname.split('.')[0];
  const activeLink = block.querySelector(`a[href="${currentPath}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
}
