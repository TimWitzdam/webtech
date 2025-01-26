import Video from "../../components/app/Video";
import SavedIcon from "../../components/icons/SavedIcon";
import { useState, useEffect } from "react";
import request from "../../lib/request";
import VideoData from "../../types/VideoData";
import AppLoadingIndicator from "../../components/app/LoadingIndicators/AppLoadingIndicator";

export default function SavedPage() {
  const [videos, setVideos] = useState<VideoData[] | null>(null);

  useEffect(() => {
    async function fetchVideos() {
      const res = await request(`api/user/save`);

      if (res.error) {
        console.error(res.error);
      } else {
        setVideos(res.videos);
      }
    }

    fetchVideos();
  }, []);

  return (
    <div className="max-w-screen-3xl mx-auto 3xl:px-0">
      <div className="px-3 flex items-center gap-3 mb-4 text-primary border-b border-border-100 bg-bg-100 py-4">
        <SavedIcon />
        <h1 className="font-medium text-2xl">Gespeicherte Videos</h1>
      </div>
      {videos !== null ? (
        <div>
          {videos.length > 0 ? (
            <div className="px-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map((video) => (
                <Video
                  key={video.video._id}
                  link={`/app/videos/${video.video._id}`}
                  image={`${import.meta.env.VITE_BACKEND_URL}/api/video/image/${video.video._id}`}
                  title={video.video.title}
                  course={{
                    name: video.foundIn[0]?.name,
                    emoji: video.foundIn[0]?.emoji,
                  }}
                  addedAt={video.video.creationDate}
                  duration={video.video.length}
                  watched={video.seen}
                />
              ))}
            </div>
          ) : (
            <p className="px-3">Keine Videos gespeichert</p>
          )}
        </div>
      ) : (
        <AppLoadingIndicator />
      )}
    </div>
  );
}
