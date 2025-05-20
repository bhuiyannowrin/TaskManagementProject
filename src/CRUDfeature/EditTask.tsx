import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { BiTrash } from "react-icons/bi";
import { BsGripVertical } from "react-icons/bs";
import "./AddTask.css";

export default function EditTask({ closeModal, task, updateTask }) {
  const [title, setTitle] = useState(task.title || "")
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority || "Low");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [progress, setProgress] = useState(task.progress || 0);

  useEffect(() => {
    setTitle(task.title || "");
    setDescription(task.description || "");
    setPriority(task.priority || "Low");
    setDueDate(task.dueDate || "");
    setSubtasks(task.subtasks || []);
    setProgress(task.progress || 0);
  }, [task]);

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "", completed: false }]);
  };

  const handleSubtaskChange = (index, value) => {
    const updated = [...subtasks];
    updated[index].title = value;
    setSubtasks(updated);
  };

  const handleCheckboxChange = (index) => {
    const updated = [...subtasks];
    updated[index].completed = !updated[index].completed;
    setSubtasks(updated);
  };

  const removeSubtask = (index) => {
    const updated = [...subtasks];
    updated.splice(index, 1);
    setSubtasks(updated);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(subtasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setSubtasks(reordered);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate,
      subtasks,
      progress,
      updatedAt: new Date().toISOString(), 
    };

    updateTask(updatedTask);
    closeModal();
  };


  const progressBackground = `linear-gradient(to right, #4caf50 ${progress}%, #ddd ${progress}%)`;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={closeModal}>
          &times;
        </button>
        <h2 style={{ textAlign: "left" }}>Edit Task</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border border-[#555] rounded-[6px] bg-var(--bg) text-var(--text)"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border border-[#555] rounded-[6px] bg-var(--bg) text-var(--text)"
          />
        </div>

        <div className="form-group">
          <label>Priority</label>
          <div className="priority-options">
            {["Low", "Medium", "High"].map((p) => (
              <label key={p}>
                <input
                  type="radio"
                  name="priority"
                  checked={priority === p}
                  onChange={() => setPriority(p)}
                />
                {p}
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border border-[#555] rounded-[6px] bg-var(--bg) text-var(--text)"
          />
        </div>

        <div className="progress-section">
          <strong>Progress</strong>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="progress-slider"
            style={{ background: progressBackground }}
          />
          <span className="progress-percent">{progress}%</span>
        </div>

        <div className="form-group">
          <div style={{ display: "flex", alignItems: "center", gap: "150px" }}>
            <label>Subtasks</label>
            <button className="add-subtask-btn" onClick={handleAddSubtask}>
              + Add Subtask
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subtasks">
              {(provided) => (
                <div
                  className="subtask-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {subtasks.length === 0 ? (
                    <p className="text-left text-xs mt-2 text-[#666]">
                      No subtasks yet. Add one to break down this task.
                    </p>
                  ) : (
                    subtasks.map((subtask, index) => (
                      <Draggable
                        key={index}
                        draggableId={`subtask-${index}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="subtask-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="cursor-grab text-muted-foreground">
                              <BsGripVertical className="h-4 w-4" />
                            </div>
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => handleCheckboxChange(index)}
                            />
                            <input
                              type="text"
                              value={subtask.title}
                              onChange={(e) =>
                                handleSubtaskChange(index, e.target.value)
                              }
                              placeholder="Subtask Title"
                              className="p-2 border border-[#555] rounded-[6px] bg-var(--bg) text-var(--text)"
                            />
                            <button
                              onClick={() => removeSubtask(index)}
                              className="delete-subtask-btn"
                            >
                              <BiTrash className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={closeModal}>
            Cancel
          </button>
          <button className="create-btn" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
