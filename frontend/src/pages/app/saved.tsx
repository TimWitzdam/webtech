import Video from "../../components/app/Video";
import SavedIcon from "../../components/icons/SavedIcon";
import { useState, useEffect } from "react";

export default function SavedPage() {
  const [savedVideos, setSavedVideos] = useState([]);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendURL}/api/user/saved`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        const body = await res.json();
        if (!body) {
          console.error("Something wen't wrong!"); //TODO: change too toasts
          return;
        }
        if (body.status) {
          console.log(body.status);
          return;
        }
        if (!body.videos) {
          console.log("Something wen't wrong!");
          return;
        }
        setSavedVideos(body.videos);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const temporaryVideos = [
    {
      id: 1,
      title: "Putting bits on the wire",
      course: { name: "Rechnernetze", emoji: "🌐" },
      image: "/images/video.jpg",
      link: "/app/courses/rechnernetze",
      addedAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      duration: "12:34",
    },
    {
      id: 2,
      title: "Putting bits on the wire",
      course: { name: "Rechnernetze", emoji: "🌐" },
      image: "/images/video.jpg",
      link: "/app/courses/rechnernetze",
      addedAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      duration: "12:34",
    },
    {
      id: 3,
      title: "Putting bits on the wire",
      course: { name: "Rechnernetze", emoji: "🌐" },
      image: "/images/video.jpg",
      link: "/app/courses/rechnernetze",
      addedAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      duration: "12:34",
    },
    {
      id: 4,
      title: "Putting bits on the wire",
      course: { name: "Rechnernetze", emoji: "🌐" },
      image: "/images/video.jpg",
      link: "/app/courses/rechnernetze",
      addedAt: new Date(Date.parse("04 Jan 2025 00:12:00 GMT")),
      duration: "12:34",
    },
  ];

  return (
    <div className="max-w-screen-3xl mx-auto 3xl:px-0">
      <div className="px-3 flex items-center gap-3 mb-4 text-primary border-b border-border-100 bg-bg-100 py-4">
        <SavedIcon />
        <h1 className="font-medium text-2xl">Gespeicherte Videos</h1>
      </div>
      <div className="px-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {temporaryVideos.map((video) => (
          <Video
            key={video.id}
            link={video.link}
            image={video.image}
            title={video.title}
            course={video.course}
            addedAt={video.addedAt}
            duration={video.duration}
          />
        ))}
      </div>
    </div>
  );
}
