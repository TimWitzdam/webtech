import { useEffect, useState } from "react";
import Course from "../../components/app/Course";
import CoursesIcon from "../../components/icons/CoursesIcon";
import request from "../../lib/request";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      const res = await request(`api/user/courses`);

      if (res.error) {
        console.error(res.error);
      } else {
        setCourses(res.courses);
      }
    }

    fetchCourses();
  }, []);

  const coursesI = [
    {
      _id: 1,
      name: "Rechnernetze",
      slug: "rechnernetze",
      emoji: "🌐",
      lastChanged: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      progress: { current: 2, total: 5 },
    },
    {
      _id: 2,
      name: "Web Technologies",
      slug: "web-technologies",
      emoji: "🌐",
      lastChanged: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      progress: { current: 2, total: 5 },
    },
  ];

  return (
    <div className="max-w-screen-3xl mx-auto 3xl:px-0">
      <div className="px-3 flex items-center gap-3 mb-4 text-primary border-b border-border-100 bg-bg-100 py-4">
        <CoursesIcon />
        <h1 className="font-medium text-2xl">Deine Kurse</h1>
      </div>
      <div className="px-3 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Course
            key={course._id}
            name={course.name}
            link={`/app/courses/${course._id}`}
            image={`${import.meta.env.VITE_BACKEND_URL}/api/course/image/${course._id}`}
            emoji={course.emoji}
            lastChanged={course.lastChanged}
            progress={course.progress}
          />
        ))}
      </div>
    </div>
  );
}
