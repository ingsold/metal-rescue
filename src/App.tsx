import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Login } from './pages/Login';
import { Ingestion } from './pages/Ingestion';
import { MyDonations } from './pages/MyDonations';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPanel } from './pages/AdminPanel';
import { AdminGoldenSet } from './components/AdminGoldenSet';
import { AdminDonations } from './pages/AdminDonations';
import { AdminOrders } from './pages/AdminOrders';
import { AdminUsers } from './pages/AdminUsers';
import { Transparency } from './pages/Transparency';
import { ManageAllies } from './pages/ManageAllies';
import { ManageDeliveries } from './pages/ManageDeliveries';
import { UpcomingEvents } from './pages/UpcomingEvents';
import { ManageEvents } from './pages/ManageEvents';
import { Settings } from './pages/Settings';
import { Cart } from './pages/Cart';
import { MyOrders } from './pages/MyOrders';
import { AdminRoute } from './components/AdminRoute';
import { GoldenSetRoute } from './components/GoldenSetRoute';

function App() {
  return (
    <ToastProvider>
      <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="catalogo" element={<Catalog />} />
            <Route path="login" element={<Login />} />
            <Route path="donar" element={<Ingestion />} />
            <Route path="mis-donaciones" element={<MyDonations />} />
            <Route path="cart" element={<Cart />} />
            <Route path="mis-ordenes" element={<MyOrders />} />
            {/* Admin Protected Routes */}
            <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="admin-pendientes" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="admin-golden-set" element={<GoldenSetRoute><AdminGoldenSet /></GoldenSetRoute>} />
            <Route path="admin-donaciones" element={<AdminRoute><AdminDonations /></AdminRoute>} />
            <Route path="admin-ordenes" element={<AdminRoute><AdminOrders /></AdminRoute>} />
            <Route path="admin-usuarios" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="admin-toques" element={<AdminRoute><ManageEvents /></AdminRoute>} />
            <Route path="admin-entidades" element={<AdminRoute><ManageAllies /></AdminRoute>} />
            <Route path="admin-entregas" element={<AdminRoute><ManageDeliveries /></AdminRoute>} />
            <Route path="transparencia" element={<Transparency />} />
            <Route path="proximos-toques" element={<UpcomingEvents />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
    </ToastProvider>
  );
}

export default App;
