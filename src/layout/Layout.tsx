import { useState, useEffect } from "react";
import "./Layout.css";
import "./BoardListView.css";
import DarkLightSwitch from "./DarkLightSwitch";
import { BiBell, BiCalendarEvent } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import AddTask from "../CRUDfeature/AddTask";
import { taskFilter, taskSort } from "./Types";
import BoardView from "./BoardView";
import ListView from "./ListView";
import CalendarView from "./CalendarView";
import TaskDetailModal from "./TaskDetailModal";
import EditTask from "../CRUDfeature/EditTask";

export default function Layout() {
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
  const [openTaskMenuId, setOpenTaskMenuId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const pushNotification = (msg: string) => {
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

  const handleThreeDotsClick = (taskId: string) => {
    setOpenTaskMenuId((prevId) => (prevId === taskId ? null : taskId));
  };

  const handleThreeDotsOptionClick = (option: string, taskId: string) => {
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

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="header-top">
          <h1 className="logo">TaskMaster</h1>
          <div className="header-right">
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="icon-btn">
              <DarkLightSwitch />
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

                      if (msg.toLowerCase().includes("add")) {
                        backgroundColor = "lightgreen";
                      } else if (msg.toLowerCase().includes("edit")) {
                        backgroundColor = "lightyellow";
                      } else if (msg.toLowerCase().includes("delete")) {
                        backgroundColor = "lightcoral";
                      } else if (msg.toLowerCase().includes("duplicate")) {
                        backgroundColor = "lightgray";
                      }

                      return (
                        <li key={i} style={{ backgroundColor, padding: "10px" }}>
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
          </div>
        </div>

        <div className="header-bottom">
          <div className="tab-group-left">
            <button className="tab" onClick={() => setView("board")}>
              Board
            </button>
            <button className="tab" onClick={() => setView("list")}>
              List
            </button>
            <button className="tab" onClick={() => setView("calendar")}>
              <BiCalendarEvent /> Calendar
            </button>
            <button className="tab">Team</button>
          </div>

          <div className="tab-group-right">
            <div className="dropdown-wrapper">
              <button
                className="tab"
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
                className="tab"
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

      <div className="view-container">
        {view === "board" && (
          <BoardView
            filteredTasks={sortedTasks}
            handleThreeDotsClick={handleThreeDotsClick}
            handleThreeDotsOptionClick={handleThreeDotsOptionClick}
            openTaskMenuId={openTaskMenuId}
            setShowCreateModal={setShowCreateModal}
            setSelectedTask={setSelectedTask}
          />
        )}

        {view === "list" && (
          <ListView
            filteredTasks={sortedTasks}
            handleThreeDotsClick={handleThreeDotsClick}
            handleThreeDotsOptionClick={handleThreeDotsOptionClick}
            openTaskMenuId={openTaskMenuId}
            setSelectedTask={setSelectedTask}
          />
        )}

        {view === "calendar" && <CalendarView tasks={sortedTasks} />}
      </div>
    </div>
  );
}
