import { useEffect, useState } from "react";
import DashboardSection from "../../components/app/DashboardSection";
import SmallVideo from "../../components/app/SmallVideo";
import Video from "../../components/app/Video";
import CalendarIcon from "../../components/icons/CalendarIcon";
import PlayIcon from "../../components/icons/PlayIcon";
import request from "../../lib/request";
import UserInformation from "../../types/UserInformation";
import CourseType from "../../types/Course";
import VideoData from "../../types/VideoData";
import Course from "../../components/app/Course";
import AppLoadingIndicator from "../../components/app/LoadingIndicators/AppLoadingIndicator";

export default function AppPage() {
  const [userInformation, setUserInformation] =
    useState<UserInformation | null>(null);
  const [userCourses, setUserCourses] = useState<CourseType[] | null>(null);
  const [lastSeen, setLastSeen] = useState<VideoData[] | null>(null);
  const [saved, setSaved] = useState<VideoData[] | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    async function fetchCourses() {
      const res = await request("api/user/courses");

      if (res.error) {
        console.error(res.error);
      } else {
        setUserCourses(res.courses.slice(0, 2));
      }
    }

    async function fetchUserInformation() {
      const res = await request("api/user/information");

      if (res.error) {
        console.error(res.error);
      } else {
        setUserInformation(res);
      }
    }

    async function fetchLastSeen() {
      const res = await request("api/user/lastseen");

      if (res.error) {
        console.error(res.error);
      } else {
        setLastSeen(res.videos.slice(0, 3));
      }
    }

    async function fetchSaved() {
      const res = await request("api/user/save");

      if (res.error) {
        console.error(res.error);
      } else {
        setSaved(res.videos.slice(0, 3));
      }
    }

    fetchCourses();
    fetchUserInformation();
    fetchLastSeen();
    fetchSaved();
  }, []);

  return (
    <div className="px-3 mt-3 max-w-screen-3xl mx-auto 3xl:px-0">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5 lg:auto-rows-fr">
        <div className="md:col-span-3">
          <DashboardSection title="Neues" icon={<CalendarIcon />}>
            <div className="p-3 flex flex-col gap-4 md:flex-row">
              <div>
                <h1 className="text-3xl mb-2">
                  Guten Tag {userInformation?.realName}!
                </h1>
                <p>
                  Du hast seit dem letzen Mal <b>2 neue Vorlesungen</b>{" "}
                  verpasst.
                </p>
              </div>
              <Video
                link="#"
                image="/images/video.jpg"
                title="Putting bits on the wire"
                course={{ name: "Rechnernetze", emoji: "🌐" }}
                addedAt="04 Jan 2025 00:12:00 GMT"
                duration={3000}
                watched={false}
              />
            </div>
          </DashboardSection>
        </div>
        <div className="md:col-span-2">
          <DashboardSection title="Weiterschauen" icon={<PlayIcon />}>
            {lastSeen !== null ? (
              <div>
                {lastSeen.length > 0 ? (
                  <div className="p-3 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {lastSeen?.map((video, index) =>
                      index + 1 < lastSeen?.length && lastSeen?.length === 3 ? (
                        <SmallVideo
                          key={video.video._id}
                          link={`/app/videos/${video.video._id}`}
                          image={`${backendUrl}/api/video/image/${video.video._id}`}
                          title={video.video.title}
                          course={video.foundIn[0].name}
                          progress={video.progress}
                        />
                      ) : (
                        <div
                          key={video.video._id}
                          className="col-span-2 md:col-span-1"
                        >
                          <SmallVideo
                            key={video.video._id}
                            link={`/app/videos/${video.video._id}`}
                            image={`${backendUrl}/api/video/image/${video.video._id}`}
                            title={video.video.title}
                            course={video.foundIn[0].name}
                            progress={video.progress}
                          />
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="p-3">Keine Videos gefunden</p>
                )}
              </div>
            ) : (
              <AppLoadingIndicator />
            )}
          </DashboardSection>
        </div>

        <div className="md:col-span-2">
          <DashboardSection
            title="Später ansehen"
            icon={<PlayIcon />}
            link="/app/saved"
          >
            {saved !== null ? (
              <div>
                {saved.length > 0 ? (
                  <div className="p-3 grid grid-cols-2 gap-4 md:grid-cols-3">
                    {saved?.map((video, index) =>
                      index + 1 < saved?.length && saved?.length === 3 ? (
                        <SmallVideo
                          key={video.video._id}
                          link={`/app/videos/${video.video._id}`}
                          image={` ${backendUrl}/api/video/image/${video.video._id}`}
                          title={video.video.title}
                          course={video.foundIn[0].name}
                          progress={video.progress}
                        />
                      ) : (
                        <div
                          key={video.video._id}
                          className="col-span-2 md:col-span-1"
                        >
                          <SmallVideo
                            key={video.video._id}
                            link={`/app/videos/${video.video._id}`}
                            image={`${backendUrl}/api/video/image/${video.video._id}`}
                            title={video.video.title}
                            course={video.foundIn[0].name}
                            progress={video.progress}
                          />
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="p-3">Du hast noch keine Videos gespeichert</p>
                )}
              </div>
            ) : (
              <AppLoadingIndicator />
            )}
          </DashboardSection>
        </div>
        <div className="md:col-span-3">
          <DashboardSection
            title="Deine Kurse"
            icon={<PlayIcon />}
            link="/app/courses"
          >
            {userCourses !== null ? (
              <div>
                {userCourses.length > 0 ? (
                  <div className="p-3 grid md:grid-cols-2 gap-4">
                    {userCourses?.map((course) => (
                      <Course
                        key={course._id}
                        name={course.name}
                        image={`${backendUrl}/api/course/image/${course._id}`}
                        link={`/app/courses/${course._id}`}
                        emoji={course.emoji}
                        lastChanged={course.lastChanged}
                        progress={course.progress}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="p-3">Du hast noch keine Kurse</p>
                )}
              </div>
            ) : (
              <AppLoadingIndicator number={2} />
            )}
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}
