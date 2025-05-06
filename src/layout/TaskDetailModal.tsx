import { useEffect, useState } from "react";

import {
  BiCalendarEvent,
  BiEdit,
  BiFile,
  BiMessage,
  BiCommentDetail,
  BiPaperclip,
  BiUser
} from "react-icons/bi";
import { BsClock } from "react-icons/bs";
import { FiDownload as Download } from "react-icons/fi";
import "./TaskDetailModal.css";

function timeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];
  for (let i = 0; i < intervals.length; i++) {
    const interval = Math.floor(seconds / intervals[i].seconds);
    if (interval >= 1) return `${interval} ${intervals[i].label}${interval > 1 ? "s" : ""} ago`;
  }
  return "Just now";
}

export default function TaskDetailModal({ task, onClose, setEditTaskId }) {
  const [activeTab, setActiveTab] = useState("details");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (task) {
      const savedComments = localStorage.getItem(`comments-${task.id}`);
      const savedFiles = localStorage.getItem(`files-${task.id}`);
      if (savedComments) setComments(JSON.parse(savedComments));
      if (savedFiles) setUploadedFiles(JSON.parse(savedFiles));
    }
  }, [task]);

  const saveToLocalStorage = (commentsData, filesData) => {
    localStorage.setItem(`comments-${task.id}`, JSON.stringify(commentsData));
    localStorage.setItem(`files-${task.id}`, JSON.stringify(filesData));
  };

  const handleFileUpload = (files) => {
    const fileArrayPromises = Array.from(files).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              data: e.target.result
            },
            author: "You",
            date: new Date().toISOString()
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileArrayPromises).then((newFiles) => {
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      saveToLocalStorage(comments, updatedFiles);
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newEntry = {
        author: "You",
        text: newComment,
        date: new Date().toISOString()
      };
      const updatedComments = [newEntry, ...comments];
      setComments(updatedComments);
      setNewComment("");
      saveToLocalStorage(updatedComments, uploadedFiles);
    }
  };

  const handleEditClick = () => {
    setEditTaskId(task.id);
    onClose();
  };

  const combinedActivities = [
    ...comments.map((c) => ({ ...c, type: "comment" })),
    ...uploadedFiles.map((f) => ({ ...f, type: "file" }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <button className="edit-btn" onClick={handleEditClick}><BiEdit /></button>

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
              {tab === "activity" && <BsClock />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "comments" && <span className="badge">{comments.length}</span>}
              {tab === "files" && <span className="badge">{uploadedFiles.length}</span>}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <>
            <div className="meta-info">
              <span><BiCalendarEvent /> Due: {task.dueDate}</span>
              <span><BiUser /> XYZ</span>
              <span><BiMessage /> {comments.length} comments</span>
              <span><BiFile /> {uploadedFiles.length} files</span>
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
                style={{
                  background: `linear-gradient(to right, #4caf50 ${task.progress}%, #ddd ${task.progress}%)`
                }}
              />
              <span className="progress-percent">{task.progress || 0}%</span>
            </div>
            <div className="tags">
              {task.tags?.map((tag, i) => (
                <span className="tag" key={i}>{tag}</span>
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
              <button className="add-comment-btn" onClick={handleAddComment}>Add Comment</button>
            </div>
            {comments.map((comment, idx) => (
              <div className="comment" key={idx}>
                <div className="comment-author">{comment.author}</div>
                <div className="comment-date">{timeAgo(comment.date)}</div>
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
                <h5 className="attachment-heading">Attachments ({uploadedFiles.length})</h5>
                {uploadedFiles.map((entry, index) => (
                  <div className="file-item" key={index}>
                    <span className="file-name">{entry.file.name}</span>
                    <button
                      className="download-btn"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = entry.file.data;
                        link.download = entry.file.name;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
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
            {combinedActivities.length === 0 ? (
              <p>No activity yet.</p>
            ) : (
              <ul className="activity-list">
                {combinedActivities.map((item, idx) => (
                  <li key={idx} className="activity-item">
                    <div className="activity-icon">
                      {item.type === "comment" ? <BiCommentDetail /> : <BiPaperclip />}
                    </div>
                    <div className="activity-details">
                      <div className="avatar-name-row">
                        <div className="avatar-placeholder">
                          <BiUser />
                        </div>
                        <span className="author-name">{item.author}</span>
                      </div>
                      <div className="activity-time">{timeAgo(item.date)}</div>
                      <div className="activity-text">
                        {item.type === "comment"
                          ? "Commented: " + item.text
                          : `Attached file: ${item.file.name}`}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
