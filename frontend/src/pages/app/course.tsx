import { useParams } from "react-router-dom";
import UserIcon from "../../components/icons/UserIcon";
import CourseProperty from "../../components/app/CourseProperty";
import { formatDate } from "../../lib/formatDate";
import LastChangedIcon from "../../components/icons/LastChangedIcon";
import LanguageIcon from "../../components/icons/LanguageIcon";
import ProgressBar from "../../components/app/ProgressBar";
import { useState } from "react";
import Video from "../../components/app/Video";

export default function CoursePage() {
  const { courseSlug } = useParams();

  const course = {
    name: "Web Technologies",
    image: "/images/webtech.png",
    emoji: "🌐",
    teachers: "Prof. Dr. Max Mustermann, Dr. Maria Musterfrau",
    lastChanged: new Date(),
    languages: "German, English",
    progress: { current: 3, total: 10 },
    description:
      "This course is about web technologies. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
    videos: [
      {
        id: 1,
        title: "Introduction",
        duration: "12:34",
        uploaded: new Date(),
        image: "/images/video.jpg",
        link: "/video/1",
      },
      {
        id: 2,
        title: "HTML Basics",
        duration: "23:45",
        uploaded: new Date(),
        image: "/images/video.jpg",
        link: "/video/2",
      },
      {
        id: 3,
        title: "CSS Basics",
        duration: "34:56",
        uploaded: new Date(),
        image: "/images/video.jpg",
        link: "/video/3",
      },
      {
        id: 4,
        title: "JavaScript Basics",
        duration: "45:67",
        uploaded: new Date(),
        image: "/images/video.jpg",
        link: "/video/4",
      },
    ],
  };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const shortDescription = course.description.slice(0, 100) + "...";

  return (
    <div className="max-w-screen-3xl mx-auto">
      <div className="px-3 3xl:px-0 mt-3">
        <div className="py-6 rounded-t-xl bg-bg-300 grid place-content-center md:place-content-start relative mb-8">
          <img
            src={course.image}
            alt={course.name}
            className="object-cover md:ml-6"
          />
          <div className="absolute -bottom-7 left-0 p-4 bg-white rounded-r-2xl">
            <p className="text-4xl">{course.emoji}</p>
          </div>
        </div>
        <h1 className="text-2xl font-medium mb-4">{course.name}</h1>
        <div className="grid xl:grid-cols-2 xl:gap-10">
          <div className="flex flex-col gap-4 text-sm">
            <CourseProperty
              icon={<UserIcon />}
              name="Lehrende(-r)"
              value={course.teachers}
            />
            <CourseProperty
              icon={<LastChangedIcon />}
              name="Zuletzt geändert"
              value={formatDate(course.lastChanged)}
            />
            <CourseProperty
              icon={<LanguageIcon />}
              name="Sprache"
              value={course.languages}
            />
            <CourseProperty icon={<LanguageIcon />} name="Fortschritt">
              <div className="flex items-center gap-2">
                <span>
                  {course.progress.current}/{course.progress.total}
                </span>
                <div className="w-full">
                  <ProgressBar
                    progress={
                      (course.progress.current / course.progress.total) * 100
                    }
                  />
                </div>
              </div>
            </CourseProperty>
          </div>
          <div>
            <h2 className="text-xl font-medium mt-8 mb-2 xl:mt-0">
              Beschreibung
            </h2>
            <p className="mb-3 xl:hidden">
              {showFullDescription ? course.description : shortDescription}
            </p>
            <p className="hidden xl:block">{course.description}</p>
            <p
              className="text-center text-gray cursor-pointer hover:text-black transition-colors xl:hidden"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Weniger anzeigen" : "Alles anzeigen..."}
            </p>
          </div>
        </div>
        <div className="md:mt-16">
          <h2 className="text-xl font-medium mt-8 mb-2">
            Videos ({course.videos.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {course.videos.map((video) => (
              <Video
                key={video.id}
                link={video.link}
                image={video.image}
                title={video.title}
                course={{ name: course.name, emoji: course.emoji }}
                addedAt={video.uploaded}
                duration={video.duration}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
