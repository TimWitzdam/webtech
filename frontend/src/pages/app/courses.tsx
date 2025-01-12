import Course from "../../components/app/Course";
import CoursesIcon from "../../components/icons/CoursesIcon";

export default function CoursesPage() {
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
    {
      id: 3,
      name: "Web Technologies",
      link: "/app/courses/web-technologies",
      image: "/images/webtech.png",
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
    </div>
  );
}
