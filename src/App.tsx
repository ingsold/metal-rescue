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
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin-pendientes" element={<AdminPanel />} />
            <Route path="admin-golden-set" element={<AdminGoldenSet />} />
            <Route path="admin-donaciones" element={<AdminDonations />} />
            <Route path="admin-ordenes" element={<AdminOrders />} />
            <Route path="admin-usuarios" element={<AdminUsers />} />
            <Route path="admin-toques" element={<ManageEvents />} />
            <Route path="admin-entidades" element={<ManageAllies />} />
            <Route path="admin-entregas" element={<ManageDeliveries />} />
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
