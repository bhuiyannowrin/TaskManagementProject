import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { BiCalendarEvent } from "react-icons/bi";
import { FiTag } from "react-icons/fi";
import { threeDotsOptions } from "./Types";

export default function BoardView({
  filteredTasks,
  handleThreeDotsClick,
  handleThreeDotsOptionClick,
  openTaskMenuId,
  setShowCreateModal,
  setSelectedTask,
  updateTask,
}) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(filteredTasks);
  }, [filteredTasks]);

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t.id.toString() === taskId);
    if (!task || task.status === newStatus) return;

    const progressByStatus = {
      Todo: 0,
      "In Progress": 31,
      Review: 90,
      Done: 100,
    };

    const updatedTask = {
      ...task,
      status: newStatus,
      progress: progressByStatus[newStatus],
      updatedAt: new Date().toISOString(),
    };

    const updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t));

    setTasks(updatedTasks);
    updateTask(updatedTask);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const getComputedStatus = (task) => {
    const progress = task.progress || 0;
    if (progress >= 31 && progress < 90) return "In Progress";
    if (progress >= 90 && progress < 100) return "Review";
    if (progress === 100) return "Done";
    return "Todo";
  };

  return (
    <div className="board-view">
      {["Todo", "In Progress", "Review", "Done"].map((status) => (
        <div
          key={status}
          className="board-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="flex flex-nowrap items-center gap-8">
            <h3 className="m-0 text-var(--text) font-bold">
              {status} (
              {
                tasks
                  .map((task) => ({
                    ...task,
                    computedStatus: getComputedStatus(task),
                  }))
                  .filter((task) => task.computedStatus === status).length
              }
              )
            </h3>

            {status === "Todo" && (
              <button
                className="text-var(--text) inline-flex justify-center 
                items-center h-8 w-8 border-none cursor-pointer text-2xl m-0"
                onClick={() => setShowCreateModal(true)}
              >
                +
              </button>
            )}
          </div>

          {tasks
            .map((task) => ({
              ...task,
              computedStatus: getComputedStatus(task),
            }))
            .filter((task) => task.computedStatus === status)
            .map((task) => (
              <div
                key={task.id}
                className="task-card"
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => setSelectedTask(task)}
                style={{ cursor: "grab" }}
              >
                <div className="flex items-center gap-20">
                  <button
                    className={`priority-button ${task.priority.toLowerCase()}`}
                  >
                    {task.priority} Priority
                  </button>

                  <div
                    className="dropdown-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={() => handleThreeDotsClick(task.id)}>
                      <BsThreeDots />
                    </button>

                    {openTaskMenuId === task.id && (
                      <div className="dropdown-menu">
                        {threeDotsOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() =>
                              handleThreeDotsOptionClick(opt, task.id)
                            }
                          >
                            {opt}
                          </button>
                        ))}

                      </div>
                    )}
                  </div>
                </div>

                <h2>{task.title}</h2>
                <p>{task.description}</p>
                <small className="flex items-center gap-1">
                  <BiCalendarEvent /> {task.dueDate}
                </small>

                <div className="progress-section">
                  <strong>Progress</strong>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={task.progress || 0}
                    onChange={(e) => {
                      const newProgress = Number(e.target.value);
                      let newStatus = getComputedStatus({
                        ...task,
                        progress: newProgress,
                      });

                      const updated = {
                        ...task,
                        progress: newProgress,
                        status: newStatus,
                        updatedAt: new Date().toISOString(),
                      };

                      setTasks((prev) =>
                        prev.map((t) => (t.id === task.id ? updated : t))
                      );
                      updateTask(updated);
                    }}
                    className="progress-slider"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: `linear-gradient(to right, #4caf50 ${task.progress}%, #ddd ${task.progress}%)`,
                    }}
                  />
                  <span className="progress-percent">
                    {task.progress || 0}%
                  </span>

                </div>

                <div className="subtasks">
                  {task.subtasks.map((subtask, index) => (
                    <div key={index} className="subtask-card">
                      <FiTag /> {subtask.title}
                    </div>
                  ))}
                </div>

              </div>
            ))}
        </div>
      ))}
    </div>
  );
}