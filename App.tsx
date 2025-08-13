import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { SupabaseConnectionTest } from "./components/SupabaseConnectionTest";
import { Button } from "./components/ui/button";
import { DashboardPage } from "./components/DashboardPage";
import { DiseaseSubmenuPage } from "./components/DiseaseSubmenuPage";
import { ResumeKasusPage } from "./components/ResumeKasusPage";
import { FormPencatatanKasusPage } from "./components/FormPencatatanKasusPage";
import { WeeklyReportPage } from "./components/WeeklyReportPage";
import { LabResultsPage } from "./components/LabResultsPage";
import { SurveillanceGuidelinesPage } from "./components/SurveillanceGuidelinesPage";
import { Toaster } from "./components/ui/sonner";

export type Page =
  | "login"
  | "register"
  | "connection-test"
  | "dashboard"
  | "disease-submenu"
  | "resume-kasus"
  | "form-pencatatan"
  | "weekly-report"
  | "lab-results"
  | "surveillance-guidelines";

export interface User {
  id: string;
  username: string;
  puskesmas: string;
  location: string;
}

export interface NavigationState {
  currentPage: Page;
  selectedDisease?: string;
  selectedForm?: string;
  selectedCase?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [navigation, setNavigation] = useState<NavigationState>(
    {
      currentPage: "login",
    },
  );
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setNavigation({ currentPage: "dashboard" });
  };

  const handleLogout = () => {
    setUser(null);
    setNavigation({ currentPage: "login" });
  };

  const navigate = (
    page: Page,
    options?: {
      disease?: string;
      form?: string;
      caseId?: string;
    },
  ) => {
    setNavigation({
      currentPage: page,
      selectedDisease: options?.disease,
      selectedForm: options?.form,
      selectedCase: options?.caseId,
    });
  };

  const handleRegister = () => {
    setNavigation({ currentPage: "register" });
  };

  const handleBackToLogin = () => {
    setNavigation({ currentPage: "login" });
  };

  const handleTestConnection = () => {
    setNavigation({ currentPage: "connection-test" });
  };

  const renderPage = () => {
    switch (navigation.currentPage) {
      case "login":
        return <LoginPage onLogin={handleLogin} onRegister={handleRegister} onTestConnection={handleTestConnection} />;
      case "register":
        return <RegisterPage onBack={handleBackToLogin} />;
      case "connection-test":
        return (
          <div className="p-4">
            <SupabaseConnectionTest />
            <div className="flex justify-center mt-4">
              <Button onClick={handleBackToLogin}>Back to Login</Button>
            </div>
          </div>
        );
      case "dashboard":
        return (
          <DashboardPage
            user={user!}
            onNavigate={navigate}
            onLogout={handleLogout}
            isOnline={isOnline}
          />
        );
      case "disease-submenu":
        return (
          <DiseaseSubmenuPage
            disease={navigation.selectedDisease!}
            onNavigate={navigate}
            onBack={() => navigate("dashboard")}
            isOnline={isOnline}
          />
        );
      case "resume-kasus":
        return (
          <ResumeKasusPage
            disease={navigation.selectedDisease!}
            form={navigation.selectedForm!}
            onNavigate={navigate}
            onBack={() =>
              navigate("disease-submenu", {
                disease: navigation.selectedDisease,
              })
            }
            isOnline={isOnline}
          />
        );
      case "form-pencatatan":
        return (
          <FormPencatatanKasusPage
            disease={navigation.selectedDisease!}
            form={navigation.selectedForm!}
            caseId={navigation.selectedCase}
            onNavigate={navigate}
            onBack={() =>
              navigate("resume-kasus", {
                disease: navigation.selectedDisease,
                form: navigation.selectedForm,
              })
            }
            isOnline={isOnline}
          />
        );
      case "weekly-report":
        return (
          <WeeklyReportPage
            user={user!}
            onNavigate={navigate}
            onBack={() => navigate("dashboard")}
            isOnline={isOnline}
          />
        );
      case "lab-results":
        return (
          <LabResultsPage
            user={user!}
            onBack={() => navigate("dashboard")}
            isOnline={isOnline}
          />
        );
      case "surveillance-guidelines":
        return (
          <SurveillanceGuidelinesPage
            onBack={() => navigate("dashboard")}
            isOnline={isOnline}
          />
        );
      default:
        return <LoginPage onLogin={handleLogin} onRegister={handleRegister} onTestConnection={handleTestConnection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            fontSize: "14px",
            minHeight: "44px",
          },
        }}
      />
    </div>
  );
}