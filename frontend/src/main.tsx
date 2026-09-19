import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { ToastProvider } from './context/ToastContext'
import { ConfirmProvider } from './context/ConfirmContext'
import AppLayout from './components/AppLayout'
import BuildingsPage from './pages/BuildingsPage'
import CreateBuildingPage from './pages/CreateBuildingPage'
import BuildingGridPage from './pages/BuildingGridPage'
import RoomPage from './pages/RoomPage'
import ResidentsPage from './pages/ResidentsPage'
import AddResidentPage from './pages/AddResidentPage'
import EditResidentPage from './pages/EditResidentPage'
import ResidentDetailPage from './pages/ResidentDetailPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ConfirmProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<BuildingsPage />} />
              <Route path="/buildings/new" element={<CreateBuildingPage />} />
              <Route path="/buildings/:buildingId" element={<BuildingGridPage />} />
              <Route path="/buildings/:buildingId/rooms/:roomId" element={<RoomPage />} />
              <Route path="/residents" element={<ResidentsPage />} />
              <Route path="/residents/new" element={<AddResidentPage />} />
              <Route path="/residents/:residentId" element={<ResidentDetailPage />} />
              <Route path="/residents/:residentId/edit" element={<EditResidentPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ConfirmProvider>
    </ToastProvider>
  </StrictMode>,
)