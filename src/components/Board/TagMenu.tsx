import React from 'react';
import type { Assignment } from '../../models/schedule';

interface TagInfo {
  color: string;
  bg: string;
  text: string;
}

interface TagMenuProps {
  tagMenuOpen: { id: string; position: { x: number; y: number } } | null;
  assignments: Assignment[];
  tags: { [key: string]: TagInfo };
  toggleTag: (assignment: Assignment, tag: string) => void;
}

const TagMenu: React.FC<TagMenuProps> = ({
  tagMenuOpen,
  assignments,
  tags,
  toggleTag
}) => {
  if (!tagMenuOpen) return null;
  
  const assignment = assignments.find(a => a.id === tagMenuOpen.id);
  if (!assignment) return null;
  
  return (
    <div 
      style={{
        position: 'fixed', 
        left: tagMenuOpen.position.x, 
        top: tagMenuOpen.position.y,
        background: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        borderRadius: 8,
        padding: 12,
        zIndex: 10000,
        minWidth: 160
      }}
    >
      <div style={{fontWeight: 600, marginBottom: 8}}>Etiketler</div>
      {Object.entries(tags).map(([tag, {color, text}]) => (
        <div 
          key={tag}
          onClick={() => toggleTag(assignment, tag)}
          style={{
            padding: '5px 8px',
            margin: '4px 0',
            cursor: 'pointer',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: assignment.tags?.includes(tag) ? `${color}20` : 'transparent'
          }}
        >
          <span 
            style={{
              display: 'inline-block', 
              width: 12, 
              height: 12, 
              borderRadius: '50%', 
              background: color
            }}
          ></span>
          {text}
          {assignment.tags?.includes(tag) && (
            <span style={{marginLeft: 'auto', color: '#666'}}>✓</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TagMenu; 