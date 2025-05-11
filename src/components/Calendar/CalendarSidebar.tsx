import React from 'react';
import type { Staff } from '../../models/schedule';

interface CalendarSidebarProps {
  staffs: Staff[];
  selectedStaffIds: string[];
  toggleStaffSelection: (staffId: string) => void;
  miniMonthVisible: boolean;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  staffs,
  selectedStaffIds,
  toggleStaffSelection,
  miniMonthVisible
}) => {
  const COLOR_MAP: { [key: string]: { primary: string; secondary: string } } = {
    'staff-1': { primary: '#4285F4', secondary: '#D2E3FC' },
    'staff-2': { primary: '#EA4335', secondary: '#FADAD7' },
    'staff-3': { primary: '#34A853', secondary: '#D4EBD5' },
    'staff-4': { primary: '#FBBC05', secondary: '#FEF0CD' },
    default: { primary: '#039BE5', secondary: '#D1F0FB' }
  };

  return (
    <div className={`calendar-sidebar ${miniMonthVisible ? 'with-mini-month' : ''}`}>
      <div className="mini-month-container">
        {miniMonthVisible && (
          <div className="mini-month">
          </div>
        )}
      </div>

      <div className="staff-filter">
        <h3>Staff Filter</h3>
        <div className="staff-list">
          {staffs.map(staff => (
            <div
              key={staff.id}
              className={`staff-item ${selectedStaffIds.includes(staff.id) ? 'selected' : ''}`}
              onClick={() => toggleStaffSelection(staff.id)}
            >
              <div 
                className="staff-color" 
                style={{ backgroundColor: COLOR_MAP[staff.id]?.primary || COLOR_MAP.default.primary }}
              ></div>
              <span className="staff-name">{staff.name}</span>
              <div className="staff-checkbox">
                {selectedStaffIds.includes(staff.id) && (
                  <i className="fas fa-check"></i>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="calendar-actions">
        <button className="action-btn create-event">
          <i className="fas fa-plus"></i> Create Event
        </button>
        <button className="action-btn import-events">
          <i className="fas fa-file-import"></i> Import
        </button>
        <button className="action-btn export-events">
          <i className="fas fa-file-export"></i> Export
        </button>
      </div>
    </div>
  );
};

export default CalendarSidebar; 