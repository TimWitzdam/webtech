import Course from "../../components/app/Course";
import DashboardSection from "../../components/app/DashboardSection";
import SmallVideo from "../../components/app/SmallVideo";
import Video from "../../components/app/Video";
import CalendarIcon from "../../components/icons/CalendarIcon";
import PlayIcon from "../../components/icons/PlayIcon";

export default function AppPage() {
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
              />
            </div>
          </DashboardSection>
        </div>
        <div className="md:col-span-2">
          <DashboardSection title="Weiterschauen" icon={<PlayIcon />} link="/#">
            <div className="p-3 grid grid-cols-2 gap-4 md:grid-cols-3">
              <SmallVideo
                link="#"
                image="/images/video.jpg"
                title="Putting bits on the wire"
                course="Rechnernetze"
                progress={22}
              />
              <SmallVideo
                link="#"
                image="/images/video.jpg"
                title="Putting bits on the wire"
                course="Rechnernetze"
                progress={22}
              />
              <div className="col-span-2 md:col-span-1">
                <SmallVideo
                  link="#"
                  image="/images/video.jpg"
                  title="Putting bits on the wire"
                  course="Rechnernetze"
                  progress={22}
                />
              </div>
            </div>
          </DashboardSection>
        </div>
        <div className="md:col-span-2">
          <DashboardSection
            title="Später ansehen"
            icon={<PlayIcon />}
            link="/#"
          >
            <div className="p-3 grid grid-cols-2 gap-4 md:grid-cols-3">
              <SmallVideo
                link="#"
                image="/images/video.jpg"
                title="Putting bits on the wire"
                course="Rechnernetze"
                progress={22}
              />
              <SmallVideo
                link="#"
                image="/images/video.jpg"
                title="Putting bits on the wire"
                course="Rechnernetze"
                progress={22}
              />
              <div className="col-span-2 md:col-span-1">
                <SmallVideo
                  link="#"
                  image="/images/video.jpg"
                  title="Putting bits on the wire"
                  course="Rechnernetze"
                  progress={22}
                />
              </div>
            </div>
          </DashboardSection>
        </div>
        <div className="md:col-span-3">
          <DashboardSection title="Deine Kurse" icon={<PlayIcon />} link="/#">
            <div className="p-3 grid md:grid-cols-2 gap-4">
              <Course
                name="Web Technologies"
                image="/images/webtech.png"
                link="#"
                emoji="🖥️"
                lastChanged={new Date(Date.parse("04 Jan 2025 00:12:00 GMT"))}
                progress={{ current: 2, total: 32 }}
              />
              <Course
                name="Web Technologies"
                image="/images/webtech.png"
                link="#"
                emoji="🖥️"
                lastChanged={new Date(Date.parse("04 Jan 2025 00:12:00 GMT"))}
                progress={{ current: 2, total: 32 }}
              />
            </div>
          </DashboardSection>
        </div>
      </div>
    </div>
  );
}
