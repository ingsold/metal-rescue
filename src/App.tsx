import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { Login } from './pages/Login';
import { Ingestion } from './pages/Ingestion';
import { MyDonations } from './pages/MyDonations';
import { AdminPanel } from './pages/AdminPanel';
import { AdminDonations } from './pages/AdminDonations';
import { AdminOrders } from './pages/AdminOrders';
import { AdminUsers } from './pages/AdminUsers';
import { Transparency } from './pages/Transparency';
import { UpcomingEvents } from './pages/UpcomingEvents';
import { ManageEvents } from './pages/ManageEvents';
import { Settings } from './pages/Settings';
import { Cart } from './pages/Cart';

function App() {
  return (
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
            <Route path="admin" element={<AdminPanel />} />
            <Route path="admin-donaciones" element={<AdminDonations />} />
            <Route path="admin-ordenes" element={<AdminOrders />} />
            <Route path="admin-usuarios" element={<AdminUsers />} />
            <Route path="admin-toques" element={<ManageEvents />} />
            <Route path="transparencia" element={<Transparency />} />
            <Route path="proximos-toques" element={<UpcomingEvents />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
