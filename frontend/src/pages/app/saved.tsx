import Video from "../../components/app/Video";
import SavedIcon from "../../components/icons/SavedIcon";

export default function SavedPage() {
  const savedVideos = [
    {
      id: 1,
      title: "Putting bits on the wire",
      course: { name: "Rechnernetze", emoji: "🌐" },
      image: "/images/video.jpg",
      link: "/app/courses/rechnernetze",
      addedAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
    },
    {
      id: 2,
      title: "Putting bits on the wire",
      course: { name: "Rechnernetze", emoji: "🌐" },
      image: "/images/video.jpg",
      link: "/app/courses/rechnernetze",
      addedAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
    },
    {
      id: 3,
      title: "Putting bits on the wire",
      course: { name: "Rechnernetze", emoji: "🌐" },
      image: "/images/video.jpg",
      link: "/app/courses/rechnernetze",
      addedAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
    },
    {
      id: 4,
      title: "Putting bits on the wire",
      course: { name: "Rechnernetze", emoji: "🌐" },
      image: "/images/video.jpg",
      link: "/app/courses/rechnernetze",
      addedAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
    },
  ];

  return (
    <div className="max-w-screen-3xl mx-auto 3xl:px-0">
      <div className="px-3 flex items-center gap-3 mb-4 text-primary border-b border-border-100 bg-bg-100 py-4">
        <SavedIcon />
        <h1 className="font-medium text-2xl">Gespeicherte Videos</h1>
      </div>
      <div className="px-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {savedVideos.map((video) => (
          <Video
            key={video.id}
            link={video.link}
            image={video.image}
            title={video.title}
            course={video.course}
            addedAt={video.addedAt}
          />
        ))}
      </div>
    </div>
  );
}
