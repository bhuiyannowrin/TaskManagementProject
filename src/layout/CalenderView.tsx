import React, { useState } from 'react';

function CalendarView({ tasks }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };
  
  const daysInMonth = getDaysInMonth(selectedDate.getMonth() + 1, selectedDate.getFullYear());
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const startingDay = firstDayOfMonth.getDay();

  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
  }

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    const tasksForDate = tasks.filter(task => task.dueDate === formattedDate);
    alert(`Tasks for ${formattedDate}: \n${tasksForDate.map(task => task.title).join('\n')}`);
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}>Previous</button>
        <h3>{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</h3>
        <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}>Next</button>
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => (
          <div
            key={index}
            className={`calendar-day ${date ? '' : 'empty'}`}
            onClick={() => date && handleDateClick(date)}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarView;
