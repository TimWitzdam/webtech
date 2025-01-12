import Course from "../../components/app/Course";

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
    <div className="px-3 mt-3 max-w-screen-3xl mx-auto 3xl:px-0">
      <h1 className="font-medium text-3xl mb-4">Deine Kurse</h1>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
