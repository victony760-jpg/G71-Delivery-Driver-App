import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ROLES } from '../utils/constants';
import PublicLayout from '../layouts/PublicLayout';
import AdminLayout from '../layouts/AdminLayout';
import DriverLayout from '../layouts/DriverLayout';
import ProtectedRoute from './ProtectedRoute';
const Home = lazy(() => import('../pages/public/Home'));
const TrackOrder = lazy(() => import('../pages/public/TrackOrder'));
const TrackShipment = lazy(() => import('../pages/public/TrackShipment'));
const RequestDelivery = lazy(() => import('../pages/public/RequestDeliveryPage'));
const PricingCalculator = lazy(
  () => import('../pages/public/PricingCalculator'),
);
const Login = lazy(() => import('../pages/public/Login'));
const FAQ = lazy(() => import('../pages/public/Faq'));
const ContactSupport = lazy(() => import('../pages/public/Contact'));
const NotFound = lazy(() => import('../pages/public/NotFound'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const ServiceRequests = lazy(() => import('../pages/admin/ServiceRequests'));
const DispatchBoard = lazy(() => import('../pages/admin/DispatchBoard'));
const ManageDrivers = lazy(() => import('../pages/admin/ManageDrivers'));
const DriverApplications = lazy(
  () => import('../pages/admin/DriverApplications'),
);
const AdminLiveMap = lazy(() => import('../pages/admin/AdminLiveMap'));
const DriverPortal = lazy(() => import('../pages/driver/DriverPortal'));
const NewAssignments = lazy(() => import('../pages/driver/NewAssignment'));
const ActiveDeliveries = lazy(() => import('../pages/driver/ActiveDeliveries'));
const JobDetail = lazy(() => import('../pages/driver/JobDetail'));
const About = lazy(() => import('../pages/public/About'));
const Career = lazy(() => import('../pages/public/Career'));
const PrivacyPolicy = lazy(() => import('../pages/public/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../pages/public/TermsOfService'));
const DriverProfile = lazy(() => import('../pages/driver/DriverProfile'));
const DeliveryHistory = lazy(() => import('../pages/driver/DeliveryHistory'));
const DriverPerformance = lazy(
  () => import('../pages/admin/DriverPerformance'),
);
const SystemLogs = lazy(() => import('../pages/admin/SystemLogs'));
const AdminRates = lazy(() => import('../pages/admin/AdminRates'));

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/track-order" element={<TrackOrder />} />
          <Route path="/track/:id" element={<TrackShipment />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/request-delivery" element={<RequestDelivery />} />
          <Route path="/request" element={<RequestDelivery />} />
          <Route path="/pricing" element={<PricingCalculator />} />
          <Route path="/about" element={<About />} />
          <Route path="/career" element={<Career />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<ContactSupport />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="requests" element={<ServiceRequests />} />
          <Route path="dispatch" element={<DispatchBoard />} />
          <Route path="drivers" element={<ManageDrivers />} />
          <Route path="applications" element={<DriverApplications />} />
          <Route path="live-map" element={<AdminLiveMap />} />
          <Route path="drivers/:driverId" element={<DriverProfile />} />
          <Route path="performance" element={<DriverPerformance />} />
          <Route path="rates" element={<AdminRates />} />
          <Route path="logs" element={<SystemLogs />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route
          path="/driver"
          element={
            <ProtectedRoute allowedRoles={[ROLES.DRIVER]}>
              <DriverLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DriverPortal />} />
          <Route path="new" element={<NewAssignments />} />
          <Route path="active" element={<ActiveDeliveries />} />
          <Route path="job/:id" element={<JobDetail />} />
          <Route path="profile" element={<DriverProfile />} />
          <Route path="history" element={<DeliveryHistory />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
