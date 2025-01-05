import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import Login from "./pages/login";
import AppPage from "./pages/app/app";
import AppLayout from "./layouts/appLayout";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<AppPage />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
