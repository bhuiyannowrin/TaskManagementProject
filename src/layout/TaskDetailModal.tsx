import { useState } from "react";
import {
  BiCalendarEvent,
  BiEdit,
  BiFile,
  BiMessage,
  BiPointer,
} from "react-icons/bi";
import { BsClock } from "react-icons/bs";
import { FiDownload as Download } from "react-icons/fi";
import "./TaskDetailModal.css";

export default function TaskDetailModal({ task, onClose, setEditTaskId }) {
  const [activeTab, setActiveTab] = useState("details");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  if (!task) return null;

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...fileArray]);
  };

  const handleAddComment = () => {
    if (newComment.trim() !== "") {
      const newEntry = {
        author: "You",
        text: newComment,
        date: new Date().toLocaleString(),
      };
      setComments((prev) => [newEntry, ...prev]);
      setNewComment("");
    }
  };

  const handleEditClick = () => {
    setEditTaskId(task.id);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <button className="edit-btn" onClick={handleEditClick}>
          <BiEdit />
        </button>

        <div className={`priority-badge ${task.priority.toLowerCase()}`}>
          {task.priority} Priority
        </div>

        <h2 className="task-title">{task.title}</h2>

        <div className="tab-header">
          {["details", "comments", "files", "activity"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "activity" ? <BsClock /> : null}{" "}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "comments" && (
                <span className="badge">{comments.length}</span>
              )}
              {tab === "files" && (
                <span className="badge">{uploadedFiles.length}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <>
            <div className="meta-info">
              <span>
                <BiCalendarEvent /> Due: {task.dueDate}
              </span>
              <span>
                <BiPointer /> XYZ
              </span>
              <span>
                <BiMessage /> {comments.length} comments
              </span>
              <span>
                <BiFile /> {uploadedFiles.length} files
              </span>
            </div>

            <div className="description">
              <strong>Description</strong>
              <p>{task.description}</p>
            </div>

            <div className="progress-section">
              <strong>Progress</strong>
              <input
                type="range"
                min="0"
                max="100"
                value={task.progress || 0}
                readOnly
                className="progress-slider"
              />
              <span className="progress-percent">{task.progress || 0}%</span>
            </div>

            <div className="tags">
              {task.tags?.map((tag, i) => (
                <span className="tag" key={i}>
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}

        {activeTab === "comments" && (
          <div className="tab-content">
            <div className="comment-input-section">
              <textarea
                placeholder="Add a comment... (use @ to mention someone)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-textarea"
              />
              <button className="add-comment-btn" onClick={handleAddComment}>
                Add Comment
              </button>
            </div>

            {comments.map((comment, idx) => (
              <div className="comment" key={idx}>
                <div className="comment-author">{comment.author}</div>
                <div className="comment-date">{comment.date}</div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "files" && (
          <div
            className="tab-content"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileUpload(e.dataTransfer.files);
            }}
          >
            <div className="upload-section file-drop-zone">
              <label htmlFor="file-upload" className="upload-label">
                Upload file or drag and drop here
              </label>
              <input
                id="file-upload"
                type="file"
                style={{ display: "none" }}
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>

            {uploadedFiles.length > 0 && (
              <>
                <h5 className="attachment-heading">
                  Attachments ({uploadedFiles.length})
                </h5>
                {uploadedFiles.map((file, index) => (
                  <div className="file-item" key={index}>
                    <span className="file-name">{file.name}</span>
                    <button
                      className="download-btn"
                      onClick={() => {
                        const url = URL.createObjectURL(file);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = file.name;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="tab-content">
            <p>No activity yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
