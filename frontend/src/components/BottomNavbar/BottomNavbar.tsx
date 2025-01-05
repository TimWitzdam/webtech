import CoursesIcon from "../icons/CoursesIcon";
import HomeIcon from "../icons/HomeIcon";
import SavedIcon from "../icons/SavedIcon";
import SettingsIcon from "../icons/SettingsIcon";
import BottomNavbarRoute from "./BottomNavbarRoute";

export default function BottomNavbar() {
  return (
    <div className="fixed bottom-0 left-0 bg-white border-t border-border-100 w-full px-3 flex justify-between text-sm">
      <BottomNavbarRoute icon={<HomeIcon />} name="Startseite" url="/app" />
      <BottomNavbarRoute
        icon={<SavedIcon />}
        name="Gespeichert"
        url="/app/saved"
      />
      <BottomNavbarRoute
        icon={<CoursesIcon />}
        name="Kurse"
        url="/app/courses"
      />
      <BottomNavbarRoute
        icon={<SettingsIcon />}
        name="Einstellungen"
        url="/app/settings"
      />
    </div>
  );
}
