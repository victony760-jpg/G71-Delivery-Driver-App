import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';
import Footer from '../components/navigation/Footer';
import PageTransition from '../components/common/PageTransition';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
}
