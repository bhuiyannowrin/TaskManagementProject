import { BsThreeDotsVertical } from "react-icons/bs";
import { BiCalendarEvent } from "react-icons/bi";
import { threeDotsOptions, priorityColors } from "./Types";
import { FiTag } from "react-icons/fi";

export default function BoardView({
  filteredTasks,
  handleThreeDotsClick,
  handleThreeDotsOptionClick,
  openTaskMenuId,
  setShowCreateModal,
  setSelectedTask,
  updateTask,
}) {
  return (
    <div className="board-view">
      {["Todo", "In Progress", "Review", "Done"].map((status) => (
        <div key={status} className="board-column">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 style={{ margin: 0 }}>
              {status} (
              {filteredTasks
                .map((task) => {
                  let computedStatus = task.status;
                  const progress = task.progress || 0;

                  if (progress >= 31 && progress < 90) {
                    computedStatus = "In Progress";
                  } else if (progress >= 90 && progress < 100) {
                    computedStatus = "Review";
                  } else if (progress === 100) {
                    computedStatus = "Done";
                  }

                  return { ...task, computedStatus };
                })
                .filter((task) => task.computedStatus === status).length})
            </h3>
            <button
              style={{
                color: "whitesmoke",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "24px",
                width: "24px",
                fontSize: "16px",
                backgroundColor: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => setShowCreateModal(true)}
            >
              +
            </button>
          </div>

          {filteredTasks
            .map((task) => {
              let computedStatus = task.status;
              const progress = task.progress || 0;

              if (progress >= 30 && progress < 90) {
                computedStatus = "In Progress";
              } else if (progress >= 90 && progress < 100) {
                computedStatus = "Review";
              } else if (progress === 100) {
                computedStatus = "Done";
              }

              return { ...task, computedStatus };
            })
            .filter((task) => task.computedStatus === status)
            .map((task) => (
              <div
                key={task.id}
                className="task-card"
                onClick={() => setSelectedTask(task)}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "150px",
                  }}
                >
                  <button
                    className="priority-button"
                    style={{
                      backgroundColor:
                        priorityColors[task.priority.toLowerCase()],
                    }}
                  >
                    {task.priority} Priority
                  </button>

                  <div
                    className="dropdown-wrapper"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="tab"
                      onClick={() => handleThreeDotsClick(task.id)}
                    >
                      <BsThreeDotsVertical />
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
                <small
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
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

                      let newStatus = task.status;
                      if (newProgress >= 30 && newProgress < 90) {
                        newStatus = "In Progress";
                      } else if (newProgress >= 90 && newProgress < 100) {
                        newStatus = "Review";
                      } else if (newProgress === 100) {
                        newStatus = "Done";
                      }

                      updateTask({
                        ...task,
                        progress: newProgress,
                        status: newStatus,
                        updatedAt: new Date().toISOString(),
                      });
                    }}
                    className="progress-slider"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      background: `linear-gradient(to right, #4caf50 ${task.progress}%, #ddd ${task.progress}%)`,
                    }}
                  />
                  <span className="progress-percent">{task.progress || 0}%</span>
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
