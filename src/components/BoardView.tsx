import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateAssignment } from "../store/schedule/actions";
import dayjs from "dayjs";
import "../components/profileCalendar.scss";
import type { AnyAction } from "redux";

interface Staff {
  id: string;
  name: string;
}
interface Assignment {
  id: string;
  staffId: string;
  title?: string;
  shiftStart: string;
  shiftEnd: string;
  isUpdated?: boolean;
  tags?: string[];
}
interface BoardViewProps {
  schedule: {
    staffs: Staff[];
    assignments: Assignment[];
  };
}

const TAGS: {
  [key: string]: { color: string; bg: string; text: string }
} = {
  morning: { color: '#ffd700', bg: '#fff8bf', text: 'Morning' },
  afternoon: { color: '#ff8847', bg: '#fff2ea', text: 'Afternoon' },
  evening: { color: '#4c6ef5', bg: '#eef0ff', text: 'Evening' },
  important: { color: '#ff4444', bg: '#ffefef', text: 'Important' },
  meeting: { color: '#20c997', bg: '#e6f9f3', text: 'Meeting' },
  training: { color: '#a980f0', bg: '#f2e9fd', text: 'Training' },
}

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

  const renderTagMenu = () => {
    if (!tagMenuOpen) return null;
    
    const assignment = schedule.assignments.find(a => a.id === tagMenuOpen.id);
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
        <div style={{fontWeight: 600, marginBottom: 8}}>Tags</div>
        {Object.entries(TAGS).map(([tag, {color, text}]) => (
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
            <span style={{display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: color}}></span>
            {text}
            {assignment.tags?.includes(tag) && (
              <span style={{marginLeft: 'auto', color: '#666'}}>✓</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderModal = () => {
    if (!modalAssignment) return null;
    const staff = schedule.staffs.find(s => s.id === modalAssignment.staffId);
    return (
      <div className="event-details-popup" style={{zIndex:9999}}>
        <div className="event-details-content" style={{minWidth:340,maxWidth:480,padding:0,overflow:'hidden',boxShadow:'0 10px 32px rgba(0,0,0,0.18)'}}>
          <div className="event-details-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 24px',background:'#19979c',color:'#fff'}}>
            <h3 style={{margin:0,fontSize:20,fontWeight:700,letterSpacing:0.5}}>Card Details</h3>
            <button onClick={closeModal} className="close-button" style={{background:'none',border:'none',color:'#fff',fontSize:28,cursor:'pointer',padding:0,marginLeft:12}}>&times;</button>
          </div>
          <div className="event-details-body" style={{padding:'24px 24px 18px'}}>
            <p><strong>Staff:</strong> {staff?.name}</p>
            <p><strong>Shift:</strong> {modalAssignment.title || 'Shift'}</p>
            <p><strong>Date:</strong> {dayjs(modalAssignment.shiftStart).format('DD.MM.YYYY')}</p>
            <p><strong>Time:</strong> {dayjs(modalAssignment.shiftStart).format('HH:mm')} - {dayjs(modalAssignment.shiftEnd).format('HH:mm')}</p>
            <p><strong>Description:</strong> Example description text.</p>
            <div style={{margin:'12px 0'}}>
              <strong>Tags:</strong>
              <div style={{display:'flex', flexWrap:'wrap', gap:6, marginTop:6}}>
                {Object.entries(TAGS).map(([tag, {color, bg, text}]) => (
                  <span 
                    key={tag}
                    onClick={() => toggleTag(modalAssignment, tag)}
                    style={{
                      background: modalAssignment.tags?.includes(tag) ? bg : '#f5f7fa',
                      color: modalAssignment.tags?.includes(tag) ? color : '#888',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: 13,
                      cursor: 'pointer',
                      border: `1px solid ${modalAssignment.tags?.includes(tag) ? color : '#e0e0e0'}`
                    }}
                  >
                    {text}
                  </span>
                ))}
              </div>
            </div>
            <div style={{margin:'12px 0'}}>
              <strong>Comments:</strong>
              <div style={{background:'#f5f7fa',borderRadius:6,padding:'6px 10px',marginTop:4,fontSize:13}}>
                <b>Manager:</b> Please arrive on time.<br/>
                <b>Staff:</b> Understood, thank you.
              </div>
            </div>
            <div style={{margin:'12px 0'}}>
              <strong>File:</strong> <input type="file" style={{marginLeft:8}} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{display:'flex',gap:24,overflowX:'auto',padding:'24px 0'}}>
        {schedule.staffs.map((staff) => (
          <div
            key={staff.id}
            onDragOver={e => e.preventDefault()}
            onDrop={() => onDrop(staff.id)}
            style={{
              minWidth:260,
              background:'#fff',
              borderRadius:14,
              boxShadow:'0 2px 12px rgba(25,151,156,0.08)',
              padding:18,
              display:'flex',flexDirection:'column',alignItems:'center',
              border:`3px solid ${staffColorMap[staff.id]||'#19979c'}`
            }}
          >
            <div style={{fontWeight:700,fontSize:'1.1rem',marginBottom:10,display:'flex',alignItems:'center',gap:8}}>
              <span style={{width:16,height:16,borderRadius:'50%',background:staffColorMap[staff.id]||'#19979c',display:'inline-block'}}></span>
              {staff.name}
            </div>
            <div style={{width:'100%',minHeight:60}}>
              {schedule.assignments.filter((a: Assignment) => a.staffId === staff.id).map((assignment: Assignment) => (
                <div
                  key={assignment.id}
                  draggable
                  onDragStart={() => onDragStart(assignment)}
                  onClick={() => setModalAssignment(assignment)}
                  style={{
                    background:'#f5f7fa',
                    borderRadius:10,
                    boxShadow:'0 1px 4px rgba(25,151,156,0.07)',
                    marginBottom:12,
                    padding:'12px 10px',
                    borderLeft:`5px solid ${assignment.isUpdated ? '#ff8847' : staffColorMap[staff.id]||'#19979c'}`,
                    cursor:'grab',
                    transition:'box-shadow .2s',
                    fontWeight:500
                  }}
                >
                  <div style={{fontSize:'1rem',marginBottom:4}}>{assignment.title || 'Shift'}</div>
                  <div style={{fontSize:'0.95rem',color:'#666'}}>
                    {dayjs(assignment.shiftStart).format('DD.MM.YYYY HH:mm')} - {dayjs(assignment.shiftEnd).format('HH:mm')}
                  </div>
                  <div style={{display:'flex', flexWrap:'wrap', gap:4, marginTop:6}}>
                    {assignment.tags?.map(tag => (
                      <span key={tag} style={{
                        background: TAGS[tag]?.bg || '#f5f7fa', 
                        color: TAGS[tag]?.color || '#666',
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}>
                        {TAGS[tag]?.text || tag}
                      </span>
                    ))}
                    <button 
                      onClick={(e) => openTagMenu(assignment, e)}
                      style={{
                        background: 'transparent',
                        border: '1px dashed #ccc',
                        borderRadius: 4,
                        padding: '1px 6px',
                        fontSize: 10,
                        cursor: 'pointer',
                        color: '#888'
                      }}
                    >
                      + Tag
                    </button>
                  </div>
                  {assignment.isUpdated && <span style={{fontSize:11,color:'#ff8847',fontWeight:700}}>Moved</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {renderTagMenu()}
      {renderModal()}
    </>
  );
};

export default BoardView; 