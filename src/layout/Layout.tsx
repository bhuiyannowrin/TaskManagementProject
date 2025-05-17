import { useState, useEffect } from "react";
import "./Layout.css";
import "./BoardListView.css";
import DarkLightSwitch from "./DarkLightSwitch";
import { BiBell } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { FaChevronDown, FaUserCircle } from "react-icons/fa";
import { LayoutGrid, List, Calendar, Users, Search } from "lucide-react";
import AddTask from "../CRUDfeature/AddTask";
import { taskFilter, taskSort } from "./Types";
import BoardView from "./BoardView";
import ListView from "./ListView";
import CalendarView from "./CalendarView";
import TaskDetailModal from "./TaskDetailModal";
import EditTask from "../CRUDfeature/EditTask";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TeamView from "./TeamView";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ onLogout, user }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [view, setView] = useState("board");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Tasks");
  const [selectedSort, setSelectedSort] = useState("Priority (High to Low)");
  const [openTaskMenuId, setOpenTaskMenuId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const pushNotification = (msg) => {
    setNotifications((prev) => [msg, ...prev]);
  };

  const addTask = (task) => {
    const newTask = { ...task, updatedAt: new Date().toISOString() };
    setTasks((prevTasks) => [...prevTasks, newTask]);
    pushNotification(`You added new task: "${task.title}"`);
  };

  const updateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    pushNotification(`You edited task: "${updatedTask.title}"`);
  };

  const handleThreeDotsClick = (taskId) => {
    setOpenTaskMenuId((prevId) => (prevId === taskId ? null : taskId));
  };

  const handleThreeDotsOptionClick = (option, taskId) => {
    const task = tasks.find((t) => t.id === taskId);

    if (option === "Edit" || option === "Add Subtask") {
      setEditTaskId(taskId);
    }

    if (option === "Duplicate") {
      if (!task) return;
      const newTask = {
        ...task,
        id: Date.now().toString(),
        title: task.title + " (Copy)",
        updatedAt: new Date().toISOString(),
      };
      setTasks((prev) => [...prev, newTask]);
      pushNotification(`You duplicated task: "${task.title}"`);
    }

    if (option === "Delete") {
      if (task) {
        pushNotification(`You deleted task: "${task.title}"`);
        setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
      }
    }
    setOpenTaskMenuId(null);
  };

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((t) => {
      if (selectedFilter === "All Tasks") return true;
      if (selectedFilter === "My Tasks") return t.owner === "me";
      if (selectedFilter === "Completed") return t.status === "Done";
      if (selectedFilter === "In Progress") return t.status === "In Progress";
      if (selectedFilter === "High Priority") return t.priority === "High";
      return true;
    });

  const priorityRank = {
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (selectedSort === "Due Date (Assending)") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (selectedSort === "Due Date (Descending)") {
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (selectedSort === "Priority (High to Low)") {
      return priorityRank[b.priority] - priorityRank[a.priority];
    }
    if (selectedSort === "Priority (Low to High)") {
      return priorityRank[a.priority] - priorityRank[b.priority];
    }
    if (selectedSort === "Recently Updated") {
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    }
    return 0;
  });

  const views = [
    { key: "board", label: "Board", icon: <LayoutGrid size={16} /> },
    { key: "list", label: "List", icon: <List size={16} /> },
    { key: "calendar", label: "Calendar", icon: <Calendar size={16} /> },
    { key: "team", label: "Team", icon: <Users size={16} /> },
  ];

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}, [theme]);

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-top">
          <h1 className="logo">TaskMaster</h1>
          <div className="header-right">
            <div className="relative hidden md:block border-2 border-gray-400 rounded-sm">
              <Search className="absolute left-2.5 top-1 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search tasks..."
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="icon-btn">
              <DarkLightSwitch theme={theme} setTheme={setTheme} />

            </button>
            <div className="notification-wrapper">
              <button
                className="icon-btn"
                onClick={() => setShowNotifications((prev) => !prev)}
                style={{ position: "relative" }}
              >
                <BiBell />
                {notifications.length > 0 && (
                  <span className="badge">{notifications.length}</span>
                )}
              </button>
              {showNotifications && (
                <div className="notification-panel">
                  <h4>Notifications</h4>
                  <ul>
                    {notifications.map((msg, i) => {
                      let backgroundColor = "lightgray";
                      if (msg.toLowerCase().includes("add"))
                        backgroundColor = "lightgreen";
                      else if (msg.toLowerCase().includes("edit"))
                        backgroundColor = "lightyellow";
                      else if (msg.toLowerCase().includes("delete"))
                        backgroundColor = "lightcoral";
                      else if (msg.toLowerCase().includes("duplicate"))
                        backgroundColor = "lightgray";
                      return (
                        <li
                          key={i}
                          style={{
                            backgroundColor,
                            borderRadius: "8px",
                            padding: "10px",
                          }}
                        >
                          {msg}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
            <button className="icon-btn">
              <FiSettings />
            </button>
            <button
              className="new-task-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + New Task
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="border-2 rounded-2xl"> 
                  <FaUserCircle size={40} className="text-var(--text)" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel> Account </DropdownMenuLabel>
                <DropdownMenuItem> 
                  <FaUserCircle size={30} className="text-var(--text)" />                  
                  <p>{user.email}</p>
                </DropdownMenuItem>
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled> Switch Account </DropdownMenuItem>
                  <DropdownMenuItem disabled> Manage Profile </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel> Task Master </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled> Profile and visibility </DropdownMenuItem>
                  <DropdownMenuItem disabled> Activity </DropdownMenuItem>
                  <DropdownMenuItem disabled> Cards </DropdownMenuItem>
                  <DropdownMenuItem disabled> Settings </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Theme
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onClick={()=> setTheme("light")}> Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={()=> setTheme("dark")}> Dark</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowCreateModal(true)}>
                    Create Workspace
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled> Help</DropdownMenuItem>
                <DropdownMenuItem disabled> Shortcut</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Tabs value={view} onValueChange={setView} className="">
          <div className="header-bottom">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
              {views.map((v) => (
                <TabsTrigger
                  key={v.key}
                  value={v.key}
                  className="outline-none m-1 p-1 border-0 focus:border-0 bg-transparent"
                >
                  {v.icon}
                  <span>{v.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="tab-group-right">
              <div className="dropdown-wrapper">
                <button
                  className="inline-flex items-center justify-center gap-2 h-9 px-3 border-2"
                  onClick={() => setShowFilterMenu((prev) => !prev)}
                >
                  Filter <FaChevronDown />
                </button>
                {showFilterMenu && (
                  <div className="dropdown-menu">
                    {taskFilter.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedFilter(opt);
                          setShowFilterMenu(false);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="dropdown-wrapper">
                <button
                  className="inline-flex items-center justify-center gap-2 h-9 px-3 border-2"
                  onClick={() => setShowSortMenu((prev) => !prev)}
                >
                  Sort <FaChevronDown />
                </button>
                {showSortMenu && (
                  <div className="dropdown-menu">
                    {taskSort.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedSort(opt);
                          setShowSortMenu(false);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <TabsContent value="board">
            <BoardView
              filteredTasks={sortedTasks}
              handleThreeDotsClick={handleThreeDotsClick}
              handleThreeDotsOptionClick={handleThreeDotsOptionClick}
              openTaskMenuId={openTaskMenuId}
              setShowCreateModal={setShowCreateModal}
              setSelectedTask={setSelectedTask}
            />
          </TabsContent>

          <TabsContent value="list">
            <ListView
              filteredTasks={sortedTasks}
              handleThreeDotsClick={handleThreeDotsClick}
              handleThreeDotsOptionClick={handleThreeDotsOptionClick}
              openTaskMenuId={openTaskMenuId}
              setSelectedTask={setSelectedTask}
            />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView tasks={sortedTasks} />
          </TabsContent>

          <TabsContent value="team">
            <TeamView />
          </TabsContent>
        </Tabs>
      </div>

      {showCreateModal && (
        <AddTask
          closeModal={() => setShowCreateModal(false)}
          addTask={addTask}
        />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          setEditTaskId={setEditTaskId}
        />
      )}

      {editTaskId && (
        <EditTask
          task={tasks.find((t) => t.id === editTaskId)}
          closeModal={() => setEditTaskId(null)}
          updateTask={updateTask}
        />
      )}
    </div>
  );
}
