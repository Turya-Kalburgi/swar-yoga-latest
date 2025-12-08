import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { pageStateAPI, getCurrentUserId } from '../utils/database';

/**
 * Hook to save current page state on route changes
 * and restore the last page on app load
 */
export const usePageStatePersistence = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Save page state when location changes (only for authenticated users)
  useEffect(() => {
    const userId = getCurrentUserId();
    if (!userId) {
      // Don't track pages for unauthenticated users
      return;
    }

    const pageName = location.pathname || '/';
    const pageData = {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    };

    // Save to database
    pageStateAPI.savePage(pageName, pageData);
  }, [location.pathname, location.search, location.hash]);

  // Restore last page on app mount (optional - called from App component)
  const restoreLastPage = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        // No user logged in, don't restore
        return null;
      }

      const lastPage = await pageStateAPI.getLastPage();
      
      if (lastPage && lastPage.pageData && lastPage.pageData.pathname) {
        const fullPath = lastPage.pageData.pathname + (lastPage.pageData.search || '') + (lastPage.pageData.hash || '');
        console.log('📄 Restoring last visited page:', lastPage.pageName);
        navigate(fullPath, { replace: true });
        return lastPage;
      }
    } catch (err) {
      console.warn('Could not restore last page:', err);
    }
    return null;
  };

  return { restoreLastPage };
};

export default usePageStatePersistence;
