import { useParams } from "react-router-dom";
import UserIcon from "../../components/icons/UserIcon";
import CourseProperty from "../../components/app/CourseProperty";
import { formatDate } from "../../lib/formatDate";
import LastChangedIcon from "../../components/icons/LastChangedIcon";
import LanguageIcon from "../../components/icons/LanguageIcon";
import ProgressBar from "../../components/app/ProgressBar";
import { useEffect, useState } from "react";
import Video from "../../components/app/Video";
import ProgressIcon from "../../components/icons/ProgressIcon";
import request from "../../lib/request";

export default function CoursePage() {
  const { courseID } = useParams();
  const [courseInformation, setCourseInformation] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [teachersString, setTeachersString] = useState("");
  const [languagesString, setLanguagesString] = useState("");

  useEffect(() => {
    async function fetchCourse() {
      const res = await request(`api/course/${courseID}`);

      if (res.error) {
        console.error(res.error);
      } else {
        setCourseInformation(res.course);
        setTeachersString(
          res.course.collaborators
            .map((teacher: { realName: string }) => teacher.realName)
            .join(", "),
        );
        setLanguagesString(res.course.languages.join(", "));
        let shortDescription = res.course.description;
        if (res.course.description.length > 100) {
          shortDescription = res.course.description.slice(0, 100) + "...";
        }
        setShortDescription(shortDescription);
      }
    }

    fetchCourse();
  }, []);

  return (
    <div className="max-w-screen-3xl mx-auto">
      <div className="px-3 3xl:px-0 mt-3">
        <div className="py-6 rounded-t-xl bg-bg-300 grid place-content-center md:place-content-start relative mb-8 h-[147px]">
          <div className="absolute -bottom-7 left-0 p-4 bg-white rounded-r-2xl">
            <p className="text-4xl">{courseInformation?.emoji}</p>
          </div>
        </div>
        <h1 className="text-2xl font-medium mb-4">{courseInformation?.name}</h1>
        <div className="grid xl:grid-cols-2 xl:gap-10">
          <div className="flex flex-col gap-4 text-sm">
            <CourseProperty
              icon={<UserIcon />}
              name="Lehrende(-r)"
              value={teachersString}
            />
            <CourseProperty
              icon={<LastChangedIcon />}
              name="Zuletzt geändert"
              value={formatDate(courseInformation?.lastChanged)}
            />
            <CourseProperty
              icon={<LanguageIcon />}
              name="Sprache"
              value={languagesString}
            />
            <CourseProperty icon={<ProgressIcon />} name="Fortschritt">
              <div className="flex items-center gap-2">
                <span>
                  {courseInformation?.progress.current}/
                  {courseInformation?.progress.total}
                </span>
                <div className="w-full">
                  <ProgressBar
                    progress={
                      (courseInformation?.progress.current /
                        courseInformation?.progress.total) *
                      100
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
              {showFullDescription
                ? courseInformation?.description
                : shortDescription}
            </p>
            <p className="hidden xl:block">{courseInformation?.description}</p>
            {courseInformation?.description.length > 100 && (
              <p
                className="text-center text-gray cursor-pointer hover:text-black transition-colors xl:hidden"
                onClick={() => setShowFullDescription(!showFullDescription)}
              >
                {showFullDescription ? "Weniger anzeigen" : "Alles anzeigen..."}
              </p>
            )}
          </div>
        </div>
        <div className="md:mt-16">
          <h2 className="text-xl font-medium mt-8 mb-2">
            Videos ({courseInformation?.videos.length})
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courseInformation?.videos.map((video) => (
              <Video
                key={video._id}
                link={`/app/videos/${video._id}`}
                image={`${import.meta.env.VITE_BACKEND_URL}/api/video/image/${video._id}`}
                title={video.title}
                course={{
                  name: courseInformation?.name,
                  emoji: courseInformation?.emoji,
                }}
                addedAt={video.creationDate}
                duration={video.length}
                watched={video.seen}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
