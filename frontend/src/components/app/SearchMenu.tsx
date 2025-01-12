import Arrow from "../icons/Arrow";
import CoursesIcon from "../icons/CoursesIcon";
import PlayIcon from "../icons/PlayIcon";

interface CoursesSearchResult {
  id: number;
  name: string;
  link: string;
}

interface VideosSearchResult {
  id: number;
  name: string;
  course: string;
  link: string;
}

type Props = {
  searchResults: {
    courses: CoursesSearchResult[];
    videos: VideosSearchResult[];
  };
  closeSearchMenu: () => void;
};

export default function SearchMenu(props: Props) {
  return (
    <div className="absolute top-0 lg:top-full left-0 lg:mt-1 w-full h-full lg:h-auto bg-white lg:border lg:border-border-100 lg:rounded-xl z-50 lg:max-h-[60vh] overflow-y-scroll">
      <div className="lg:hidden pt-3 px-3 flex items-center justify-between gap-2">
        <button
          className="rotate-180 text-primary p-2"
          onClick={props.closeSearchMenu}
        >
          <Arrow />
        </button>
        <div className="w-full border border-border-100 rounded-full focus-within:border-primary">
          <input
            className="outline-none rounded-full py-2 pl-4 w-full"
            type="text"
            placeholder="Suche..."
          />
        </div>
      </div>
      {props.searchResults.courses.length === 0 &&
        props.searchResults.videos.length === 0 && (
          <div className="p-3">Keine Ergebnisse</div>
        )}
      {props.searchResults.courses.length > 0 && (
        <div>
          <div className="p-3 border-b border-border-100">Kurse</div>
          <div
            className={`border-border-100 grid ${props.searchResults.videos.length > 0 && "border-b"}`}
          >
            {props.searchResults.courses.map((course, index) => (
              <a
                key={course.id}
                href={course.link}
                className={`px-3 flex gap-2 py-4 hover:bg-bg-300 ${index + 1 === props.searchResults.courses.length && props.searchResults.videos.length === 0 && "lg:rounded-b-xl"}`}
              >
                <div className="text-primary">
                  <CoursesIcon size={19} />
                </div>
                <span className="leading-none">{course.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      {props.searchResults.videos.length > 0 && (
        <div>
          <div className="p-3 border-b border-border-100">Videos</div>
          <div className="grid">
            {props.searchResults.videos.map((video, index) => (
              <a
                key={video.id}
                href={video.link}
                className={`px-3 py-3 flex gap-2 hover:bg-bg-300 ${index + 1 === props.searchResults.videos.length && "lg:rounded-b-xl"}`}
              >
                <PlayIcon size={16} />
                <div>
                  <p className="leading-none">{video.name}</p>
                  <span className="text-xs text-gray">{video.course}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
