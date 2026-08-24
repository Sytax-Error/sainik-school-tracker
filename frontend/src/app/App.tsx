import { Routes, Route } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardPage } from "@/pages/DashboardPage";
import { PhasePage } from "@/pages/PhasePage";
import { ContractPage } from "@/pages/ContractPage";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/hooks";

export function App(): JSX.Element {
  return (
    <ThemeProvider>
      <ToastProvider>
        <MainLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/contract" element={<ContractPage />} />
            <Route path="/phase/:phaseId" element={<PhasePage />} />
          </Routes>
        </MainLayout>
      </ToastProvider>
    </ThemeProvider>
  );
}
