import React, { useState } from 'react';
import './Calendar.css';
import { FcNext, FcPrevious } from 'react-icons/fc';

function CalendarView({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDate, setActiveDate] = useState(null);

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const daysInMonth = getDaysInMonth(
    selectedDate.getMonth() + 1,
    selectedDate.getFullYear()
  );

  const firstDayOfMonth = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );

  const startingDay = firstDayOfMonth.getDay();

  const days = [];

  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
  }

  
  const getISODate = (date) => date.toLocaleDateString('en-CA');


  const formatDisplayDate = (date) =>
    date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

  const handleDateClick = (date) => {
    setActiveDate(date);
  };

  const tasksForSelectedDay = activeDate
    ? tasks.filter(
        (task) => getISODate(new Date(task.dueDate)) === getISODate(activeDate)
      )
    : [];

  return (
    <div className="calendar-container" style={{ display: 'flex', gap: '2rem' }}>
      <div className="calendar-view">
        <div className="calendar-header">
          <button
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1)
              )
            }
          >
            <FcPrevious />
          </button>
          <h3>
            {selectedDate.toLocaleString('default', { month: 'long' })}{' '}
            {selectedDate.getFullYear()}
          </h3>
          <button
            onClick={() =>
              setSelectedDate(
                new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1)
              )
            }
          >
            <FcNext />
          </button>
        </div>

        <div
          className="calendar-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            marginTop: '10px',
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} style={{ fontWeight: 'bold', textAlign: 'center' }}>
              {day}
            </div>
          ))}

          {days.map((date, index) => {
            const isSelected =
              activeDate && date && date.toDateString() === activeDate.toDateString();
            const isToday =
              date && date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`calendar-day ${date ? '' : 'empty'}`}
                onClick={() => date && handleDateClick(date)}
                style={{
                  padding: '10px',
                  border: date ? '1px solid #ccc' : 'none',
                  cursor: date ? 'pointer' : 'default',
                  backgroundColor: isSelected ? '#00796b' : isToday ? '#e0f7fa' : 'white',
                  color: isSelected ? '#fff' : '#000',
                  textAlign: 'center',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  borderRadius: '6px',
                }}
              >
                {date ? date.getDate() : ''}
              </div>
            );
          })}
        </div>
      </div>

      <div className="task-sidebar">
        {activeDate ? (
          <>
            {tasksForSelectedDay.length > 0 ? (
              <ul>
                {tasksForSelectedDay.map((task) => (
                  <>
                  <li key={task.id} style={{ marginBottom: '1rem' }}>
                    <div><strong>{formatDisplayDate(new Date(task.dueDate))}</strong></div>
                  </li>
                  <div><strong>{task.title}</strong></div>
                  <p>{task.description}</p>
                  </>
                ))}
              </ul>
            ) : (
              <p>
                {formatDisplayDate(activeDate)}
                <br />
                No tasks due on this date.
              </p>
            )}
          </>
        ) : (
          <p>Select a date to view tasks.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarView;
