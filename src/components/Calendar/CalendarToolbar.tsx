import React from 'react';
import FullCalendar from '@fullcalendar/react';

interface CalendarToolbarProps {
  selectedView: string;
  setSelectedView: (view: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  calendarRef: React.RefObject<FullCalendar>;
  setMiniMonthVisible: (visible: boolean) => void;
  miniMonthVisible: boolean;
}

const CalendarToolbar: React.FC<CalendarToolbarProps> = ({
  selectedView,
  setSelectedView,
  searchTerm,
  setSearchTerm,
  calendarRef,
  setMiniMonthVisible,
  miniMonthVisible
}) => {
  const handleViewChange = (view: string) => {
    setSelectedView(view);
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  };

  const handlePrevClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
    }
  };

  const handleNextClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
    }
  };

  const handleTodayClick = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
    }
  };

  const getViewTitle = () => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      const viewTitle = calendarApi.view.title;
      return viewTitle;
    }
    return '';
  };

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-left">
        <button className="toolbar-btn" onClick={handleTodayClick}>Today</button>
        <div className="nav-buttons">
          <button className="nav-btn" onClick={handlePrevClick}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="current-date">{getViewTitle()}</span>
          <button className="nav-btn" onClick={handleNextClick}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      <div className="toolbar-center">
        <div className="view-buttons">
          <button 
            className={`view-btn ${selectedView === 'dayGridMonth' ? 'active' : ''}`}
            onClick={() => handleViewChange('dayGridMonth')}
          >
            Month
          </button>
          <button 
            className={`view-btn ${selectedView === 'timeGridWeek' ? 'active' : ''}`}
            onClick={() => handleViewChange('timeGridWeek')}
          >
            Week
          </button>
          <button 
            className={`view-btn ${selectedView === 'timeGridDay' ? 'active' : ''}`}
            onClick={() => handleViewChange('timeGridDay')}
          >
            Day
          </button>
          <button 
            className={`view-btn ${selectedView === 'listWeek' ? 'active' : ''}`}
            onClick={() => handleViewChange('listWeek')}
          >
            List
          </button>
        </div>
      </div>
      
      <div className="toolbar-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        <button 
          className={`mini-calendar-toggle ${miniMonthVisible ? 'active' : ''}`}
          onClick={() => setMiniMonthVisible(!miniMonthVisible)}
        >
          <i className="fas fa-calendar-alt"></i>
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar; 