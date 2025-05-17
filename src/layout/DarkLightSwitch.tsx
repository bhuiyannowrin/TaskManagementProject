import { BsMoonStars, BsSun } from "react-icons/bs";

function DarkLightSwitch({ theme, setTheme }) {
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <button
      className="flex items-center justify-center rounded-md p-2 hover:bg-neutral-50 dark:hover:bg-neutral-400"
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <BsMoonStars className="text-xl text-gray-400" />
      ) : (
        <BsSun className="text-xl text-yellow-300" />
      )}
    </button>
  );
}

export default DarkLightSwitch;
