import { useEffect, useState } from "react";
import Course from "../../components/app/Course";
import DashboardSection from "../../components/app/DashboardSection";
import SmallVideo from "../../components/app/SmallVideo";
import Video from "../../components/app/Video";
import CalendarIcon from "../../components/icons/CalendarIcon";
import PlayIcon from "../../components/icons/PlayIcon";
import request from "../../lib/request";

export default function AppPage() {
  const [userCourses, setUserCourses] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const res = await request("api/user/courses");

      if (res.error) {
        console.error(res.error);
      } else {
        setUserCourses(res.courses);
      }
    }

    fetchData();
  }, []);

  const continueWatching = [
    {
      id: 1,
      title: "Putting bits on the wire",
      course: "Rechnernetze",
      image: "/images/video.jpg",
      progress: 22,
    },
    {
      id: 2,
      title: "Putting bits on the wire",
      course: "Rechnernetze",
      image: "/images/video.jpg",
      progress: 22,
    },
    {
      id: 3,
      title: "Putting bits on the wire",
      course: "Rechnernetze",
      image: "/images/video.jpg",
      progress: 22,
    },
  ];

  const watchLater = [
    {
      id: 1,
      title: "Putting bits on the wire",
      course: "Rechnernetze",
      image: "/images/video.jpg",
      progress: 22,
    },
    {
      id: 2,
      title: "Putting bits on the wire",
      course: "Rechnernetze",
      image: "/images/video.jpg",
      progress: 22,
    },
    {
      id: 3,
      title: "Putting bits on the wire",
      course: "Rechnernetze",
      image: "/images/video.jpg",
      progress: 22,
    },
  ];

  const courses = [
    {
      id: 1,
      name: "Rechnernetze",
      link: "/app/courses/rechnernetze",
      image: "/images/webtech.png",
      emoji: "🌐",
      lastChanged: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      progress: { current: 2, total: 5 },
    },
    {
      id: 2,
      name: "Web Technologies",
      link: "/app/courses/web-technologies",
      image: "/images/webtech.png",
      emoji: "🌐",
      lastChanged: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      progress: { current: 2, total: 5 },
    },
  ];

  return (
    <div className="px-3 mt-3 max-w-screen-3xl mx-auto 3xl:px-0">
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5 lg:auto-rows-fr">
        <div className="md:col-span-3">
          <DashboardSection title="Neues" icon={<CalendarIcon />}>
            <div className="p-3 flex flex-col gap-4 md:flex-row">
              <div>
                <h1 className="text-3xl mb-2">Guten Tag Tim!</h1>
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
                addedAt={new Date(Date.parse("04 Jan 2025 00:12:00 GMT"))}
                duration="12:34"
              />
            </div>
          </DashboardSection>
        </div>
        <div className="md:col-span-2">
          <DashboardSection title="Weiterschauen" icon={<PlayIcon />} link="/#">
            <div className="p-3 grid grid-cols-2 gap-4 md:grid-cols-3">
              {continueWatching.map((video, index) =>
                index + 1 < continueWatching.length ? (
                  <SmallVideo
                    key={video.id}
                    link="#"
                    image={video.image}
                    title={video.title}
                    course={video.course}
                    progress={video.progress}
                  />
                ) : (
                  <div key={video.id} className="col-span-2 md:col-span-1">
                    <SmallVideo
                      link="#"
                      image={video.image}
                      title={video.title}
                      course={video.course}
                      progress={video.progress}
                    />
                  </div>
                ),
              )}
            </div>
          </DashboardSection>
        </div>
        <div className="md:col-span-2">
          <DashboardSection
            title="Später ansehen"
            icon={<PlayIcon />}
            link="/app/saved"
          >
            <div className="p-3 grid grid-cols-2 gap-4 md:grid-cols-3">
              {watchLater.map((video, index) =>
                index + 1 < watchLater.length ? (
                  <SmallVideo
                    key={video.id}
                    link="#"
                    image={video.image}
                    title={video.title}
                    course={video.course}
                    progress={video.progress}
                  />
                ) : (
                  <div key={video.id} className="col-span-2 md:col-span-1">
                    <SmallVideo
                      link="#"
                      image={video.image}
                      title={video.title}
                      course={video.course}
                      progress={video.progress}
                    />
                  </div>
                ),
              )}
            </div>
          </DashboardSection>
        </div>
        <div className="md:col-span-3">
          <DashboardSection
            title="Deine Kurse"
            icon={<PlayIcon />}
            link="/app/courses"
          >
            <div className="p-3 grid md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <Course
                  key={course.id}
                  name={course.name}
                  link={course.link}
                  image={course.image}
                  emoji={course.emoji}
                  lastChanged={course.lastChanged}
                  progress={course.progress}
                />
              ))}
            </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}
