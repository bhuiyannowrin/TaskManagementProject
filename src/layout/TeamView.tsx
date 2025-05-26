import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BiCalendarEvent } from "react-icons/bi";

const defaultAvatars = [
  "https://hwchamber.co.uk/wp-content/uploads/2022/04/avatar-placeholder.gif",
];

const TeamView = ({ setSelectedTask }) => {
  const [members, setMembers] = useState([]);
  const [tabs, setTabs] = useState({});

  useEffect(() => {
    const storedLogin = JSON.parse(localStorage.getItem("logindata"));
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const grouped = storedTasks.reduce((acc, task) => {
      const creator = task.creator || "Unknown";
      if (!acc[creator]) acc[creator] = [];
      acc[creator].push(task);
      return acc;
    }, {});

    const formattedMembers = Object.entries(grouped).map(([creator, tasks], idx) => ({
      id: creator,
      name: creator,
      avatar: defaultAvatars[idx % defaultAvatars.length],
      tasks,
    }));

    setMembers(formattedMembers);
  }, []);

  const getCompletion = (tasks) => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === "Done").length;
    return total === 0 ? 0 : Math.round((done / total) * 100);
  };

  const handleTabChange = (id, value) => {
    setTabs((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {members.map((member) => {
        const completion = getCompletion(member.tasks);
        const tab = tabs[member.id] || "all";

        return (
          <div
            key={member.id}
            className="bg-var(--bg) text-var(--text) rounded-lg p-4 shadow-lg border border-gray-800"
          >
            <div className="flex items-center gap-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-14 h-14 rounded-full border"
              />
              <div>
                <h2 className="text-lg font-semibold">{member.name}</h2>
                <p className="text-gray-400 text-sm">{member.tasks.length} tasks</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-var(--text)">Completion</span>
                <span className="var(--text)">{completion}%</span>
              </div>
              <div className="w-full h-2 border-2 rounded">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>

            <Tabs value={tab} onValueChange={(val) => handleTabChange(member.id, val)} className="mt-4">
              <TabsList className="flex justify-between bg-gray-800 rounded-md p-1 mb-2">
                {["all", "todo", "In Progress", "done"].map((val) => (
                  <TabsTrigger
                    key={val}
                    value={val}
                    className="px-3 py-1 rounded-md
                      data-[state=active]:bg-gray-900
                      data-[state=active]:font-bold
                      data-[state=active]:text-white"
                  >
                    {val === "all"
                      ? "All"
                      : val === "todo"
                      ? "To Do"
                      : val === "In Progress"
                      ? "In Progress"
                      : "Done"}
                  </TabsTrigger>
                ))}
              </TabsList>

              {["all", "todo", "In Progress", "done"].map((val) => {
                const filteredTasks =
                  val === "all"
                    ? member.tasks
                    : member.tasks.filter(
                        (task) => task.status.toLowerCase() === val.toLowerCase()
                      );

                return (
                  <TabsContent key={val} value={val}>
                    {filteredTasks.length === 0 ? (
                      <p className="text-sm text-gray-500">No tasks available</p>
                    ) : (
                      filteredTasks.map((task, index) => (
                        <div
                          key={index}
                           onClick={() => setSelectedTask(task)} 
                          className="bg-(--bg) rounded-lg p-3 mb-2 border border-gray-700 cursor-pointer"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{task.title}</h3>
                            <span
                              className={`text-white text-xs px-2 py-1 rounded-full
                                ${
                                  task.priority === "High"
                                    ? "bg-red-700"
                                    : task.priority === "Medium"
                                    ? "bg-blue-500"
                                    : "bg-green-700 text-purple-300"
                                }`}
                            >
                              {task.priority}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.status === "Todo"
                                  ? "bg-gray-700 text-blue-300"
                                  : task.status === "Review"
                                  ? "bg-yellow-800 text-yellow-300"
                                  : task.status === "Done"
                                  ? "bg-green-700 text-green-300"
                                  : "bg-purple-700 text-purple-300"
                              }`}
                            >
                              {task.status}
                            </span>
                            <div className="flex items-center gap-1">
                              <BiCalendarEvent />
                              <span>{task.dueDate}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        );
      })}
    </div>
  );
};

export default TeamView;
