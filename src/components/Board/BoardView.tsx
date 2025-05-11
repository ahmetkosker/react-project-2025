import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAssignment } from "../../store/schedule/actions";
import type { AnyAction } from "redux";
import type { ScheduleInstance, Assignment } from "../../models/schedule";
import "./boardView.scss";

import BoardColumn from "./BoardColumn";
import TagMenu from "./TagMenu";
import CardDetailsModal from "./CardDetailsModal";

interface BoardViewProps {
  schedule: ScheduleInstance;
}

const TAGS = {
  morning: { color: '#ffd700', bg: '#fff8bf', text: 'Sabah' },
  afternoon: { color: '#ff8847', bg: '#fff2ea', text: 'Öğle' },
  evening: { color: '#4c6ef5', bg: '#eef0ff', text: 'Akşam' },
  important: { color: '#ff4444', bg: '#ffefef', text: 'Önemli' },
  meeting: { color: '#20c997', bg: '#e6f9f3', text: 'Toplantı' },
  training: { color: '#a980f0', bg: '#f2e9fd', text: 'Eğitim' },
};

const staffColorMap: { [key: string]: string } = {
  "staff-1": "#FFD700",
  "staff-2": "#FF4444",
  "staff-3": "#4CAF50",
  "staff-4": "#2196F3"
};

const BoardView: React.FC<BoardViewProps> = ({ schedule }) => {
  const dispatch = useDispatch();
  const [dragged, setDragged] = useState<Assignment | null>(null);
  const [modalAssignment, setModalAssignment] = useState<Assignment | null>(null);
  const [tagMenuOpen, setTagMenuOpen] = useState<{id: string, position: {x: number, y: number}} | null>(null);

  const onDragStart = (assignment: Assignment) => setDragged(assignment);
  
  const onDrop = (staffId: string) => {
    if (dragged && dragged.staffId !== staffId) {
      dispatch(updateAssignment({ ...dragged, staffId, isUpdated: true }) as AnyAction);
    }
    setDragged(null);
  };

  const openTagMenu = (assignment: Assignment, e: React.MouseEvent) => {
    e.stopPropagation();
    setTagMenuOpen({id: assignment.id, position: {x: e.clientX, y: e.clientY}});
  };

  const toggleTag = (assignment: Assignment, tag: string) => {
    const newTags = assignment.tags ? [...assignment.tags] : [];
    const tagIndex = newTags.indexOf(tag);
    
    if (tagIndex >= 0) {
      newTags.splice(tagIndex, 1);
    } else {
      newTags.push(tag);
    }
    
    dispatch(updateAssignment({ ...assignment, tags: newTags }) as AnyAction);
    setTagMenuOpen(null);
  };

  const closeModal = () => setModalAssignment(null);

  return (
    <>
      <div style={{display: 'flex', gap: 24, overflowX: 'auto', padding: '24px 0'}}>
        {schedule.staffs.map((staff) => (
          <BoardColumn
            key={staff.id}
            staff={staff}
            assignments={schedule.assignments.filter(a => a.staffId === staff.id)}
            staffColor={staffColorMap[staff.id] || '#19979c'}
            onDrop={onDrop}
            onDragStart={onDragStart}
            onCardClick={setModalAssignment}
            onTagMenuOpen={openTagMenu}
            tags={TAGS}
          />
        ))}
      </div>
      
      <TagMenu
        tagMenuOpen={tagMenuOpen}
        assignments={schedule.assignments}
        tags={TAGS}
        toggleTag={toggleTag}
      />
      
      <CardDetailsModal
        modalAssignment={modalAssignment}
        staff={modalAssignment ? schedule.staffs.find(s => s.id === modalAssignment.staffId) : undefined}
        tags={TAGS}
        onClose={closeModal}
        toggleTag={toggleTag}
      />
    </>
  );
};

export default BoardView; 