import { createBrowserRouter } from "react-router";
import { MainIDE } from "./components/MainIDE";
import { AlgorithmVisualization } from "./components/AlgorithmVisualization";
import { AIAnalysisDashboard } from "./components/AIAnalysisDashboard";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignupPage,
  },
  {
    path: "/forgot-password",
    Component: ForgotPasswordPage,
  },
  {
    path: "/ide",
    Component: MainIDE,
  },
  {
    path: "/visualize",
    Component: AlgorithmVisualization,
  },
  {
    path: "/analysis",
    Component: AIAnalysisDashboard,
  },
]);