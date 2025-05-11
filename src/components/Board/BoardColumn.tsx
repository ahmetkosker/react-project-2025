import React from 'react';
import BoardCard from './BoardCard';
import type { Assignment, Staff } from '../../models/schedule';

interface TagInfo {
  color: string;
  bg: string;
  text: string;
}

interface BoardColumnProps {
  staff: Staff;
  assignments: Assignment[];
  staffColor: string;
  onDrop: (staffId: string) => void;
  onDragStart: (assignment: Assignment) => void;
  onCardClick: (assignment: Assignment) => void;
  onTagMenuOpen: (assignment: Assignment, e: React.MouseEvent) => void;
  tags: {[key: string]: TagInfo};
}

const BoardColumn: React.FC<BoardColumnProps> = ({
  staff,
  assignments,
  staffColor,
  onDrop,
  onDragStart,
  onCardClick,
  onTagMenuOpen,
  tags
}) => {
  return (
    <div
      key={staff.id}
      onDragOver={e => e.preventDefault()}
      onDrop={() => onDrop(staff.id)}
      style={{
        minWidth: 260,
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 2px 12px rgba(25,151,156,0.08)',
        padding: 18,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        border: `3px solid ${staffColor || '#19979c'}`
      }}
    >
      <div style={{
        fontWeight: 700, 
        fontSize: '1.1rem', 
        marginBottom: 10, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8
      }}>
        <span 
          style={{
            width: 16, 
            height: 16, 
            borderRadius: '50%', 
            background: staffColor || '#19979c', 
            display: 'inline-block'
          }}
        ></span>
        {staff.name}
      </div>
      
      <div style={{width: '100%', minHeight: 60}}>
        {assignments.map((assignment: Assignment) => (
          <BoardCard
            key={assignment.id}
            assignment={assignment}
            staffColor={staffColor}
            onDragStart={onDragStart}
            onCardClick={onCardClick}
            onTagMenuOpen={onTagMenuOpen}
            tags={tags}
          />
        ))}
      </div>
    </div>
  );
};

export default BoardColumn; 