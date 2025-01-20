import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/login";
import AppPage from "./pages/app/app";
import AppLayout from "./layouts/appLayout";
import CoursesPage from "./pages/app/courses";
import SavedPage from "./pages/app/saved";
import CoursePage from "./pages/app/course";
import VideoPage from "./pages/app/video";

const Router = () => {
  let loggedIn = false;

  function getCookie(cookies: string, name: string) {
    const value = `; ${cookies}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }

  const cookies = document.cookie;

  if (getCookie(cookies, "auth_session")) {
    loggedIn = true;
  } else {
    loggedIn = false;
  }

  return (
    <BrowserRouter>
      {loggedIn ? (
        <Routes>
          <Route path="/" element={<Navigate to="/app/" />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<AppPage />} />
            <Route path="courses">
              <Route index element={<CoursesPage />} />
              <Route path=":courseID" element={<CoursePage />} />
            </Route>
            <Route path="videos">
              <Route path=":videoID" element={<VideoPage />} />
            </Route>
            <Route path="saved" element={<SavedPage />} />
          </Route>
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default Router;
