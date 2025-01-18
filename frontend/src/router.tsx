import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import Login from "./pages/login";
import AppPage from "./pages/app/app";
import AppLayout from "./layouts/appLayout";
import CoursesPage from "./pages/app/courses";
import SavedPage from "./pages/app/saved";
import CoursePage from "./pages/app/course";
import VideoPage from "./pages/app/video";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<AppPage />} />
          <Route path="courses">
            <Route index element={<CoursesPage />} />
            <Route path=":courseSlug" element={<CoursePage />} />
          </Route>
          <Route path="videos">
            <Route path=":videoID" element={<VideoPage />} />
          </Route>
          <Route path="saved" element={<SavedPage />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
