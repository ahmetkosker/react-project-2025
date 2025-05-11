/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import type { ScheduleInstance } from "../../models/schedule";
import type { UserInstance } from "../../models/user";
import type { UnknownAction } from "redux";

import FullCalendar from "@fullcalendar/react";

import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

import type { EventInput } from "@fullcalendar/core/index.js";

import "../profileCalendar.scss";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { updateAssignment } from "../../store/schedule/actions";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

type CalendarContainerProps = {
  schedule: ScheduleInstance;
  auth: UserInstance;
};

const classes = [
  "bg-one",
  "bg-two",
  "bg-three",
  "bg-four",
  "bg-five",
  "bg-six",
  "bg-seven",
  "bg-eight",
  "bg-nine",
  "bg-ten",
  "bg-eleven",
  "bg-twelve",
  "bg-thirteen",
  "bg-fourteen",
  "bg-fifteen",
  "bg-sixteen",
  "bg-seventeen",
  "bg-eighteen",
  "bg-nineteen",
  "bg-twenty",
  "bg-twenty-one",
  "bg-twenty-two",
  "bg-twenty-three",
  "bg-twenty-four",
  "bg-twenty-five",
  "bg-twenty-six",
  "bg-twenty-seven",
  "bg-twenty-eight",
  "bg-twenty-nine",
  "bg-thirty",
  "bg-thirty-one",
  "bg-thirty-two",
  "bg-thirty-three",
  "bg-thirty-four",
  "bg-thirty-five",
  "bg-thirty-six",
  "bg-thirty-seven",
  "bg-thirty-eight",
  "bg-thirty-nine",
  "bg-forty",
];

type EventDetailsType = {
  id: string;
  staffName: string;
  shiftName: string;
  date: string;
  startTime: string;
  endTime: string;
};

type PairHighlight = {
  date: string;
  color: string;
};

const CalendarContainer = ({ schedule, auth }: CalendarContainerProps) => {
  const dispatch = useDispatch();
  const calendarRef = useRef<FullCalendar>(null);

  const [events, setEvents] = useState<EventInput[]>([]);
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);
  const [pairHighlightedDates, setPairHighlightedDates] = useState<PairHighlight[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [initialDate, setInitialDate] = useState<Date>(new Date());
  
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetailsType | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [search, setSearch] = useState("");
  const [tooltip, setTooltip] = useState<{visible: boolean, x: number, y: number, content: string}>({visible: false, x: 0, y: 0, content: ""});

  const getPlugins = () => {
    const plugins = [dayGridPlugin];

    plugins.push(interactionPlugin);
    return plugins;
  };

  const getShiftById = (id: string) => {
    return schedule?.shifts?.find((shift: { id: string }) => id === shift.id);
  };

  const getAssigmentById = (id: string) => {
    return schedule?.assignments?.find((assign) => id === assign.id);
  };

  const getStaffById = (id: string) => {
    return schedule?.staffs?.find((staff) => id === staff.id);
  };

  const validDates = () => {
    const dates = [];
    let currentDate = dayjs(schedule.scheduleStartDate);
    while (
      currentDate.isBefore(schedule.scheduleEndDate) ||
      currentDate.isSame(schedule.scheduleEndDate)
    ) {
      dates.push(currentDate.format("YYYY-MM-DD"));
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  };

  const getDatesBetween = (startDate: string, endDate: string) => {
    const dates = [];
    const start = dayjs(startDate, "DD.MM.YYYY").toDate();
    const end = dayjs(endDate, "DD.MM.YYYY").toDate();
    const current = new Date(start);

    while (current <= end) {
      dates.push(dayjs(current).format("DD-MM-YYYY"));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const getEarliestEventDate = (staffId: string | null = null) => {
    if (!schedule?.assignments || schedule.assignments.length === 0) {
      console.log('No assignments found, returning current date');
      return dayjs().toDate();
    }

    try {
      if (staffId && schedule?.staffs) {
        const selectedStaff = schedule.staffs.find(staff => staff.id === staffId);
        console.log('Selected staff:', selectedStaff?.name);
        
        if (selectedStaff && selectedStaff.pairList && selectedStaff.pairList.length > 0) {
          console.log('Pair list found:', selectedStaff.pairList);
          
          const sortedPairs = [...selectedStaff.pairList].sort((a, b) => {
            const dateA = dayjs.utc(a.startDate);
            const dateB = dayjs.utc(b.startDate);
            console.log('Comparing dates:', {
              a: dateA.format('YYYY-MM-DD'),
              b: dateB.format('YYYY-MM-DD')
            });
            return dateA.isBefore(dateB) ? -1 : 1;
          });
          
          if (sortedPairs[0] && sortedPairs[0].startDate) {
            const firstPairDate = dayjs.utc(sortedPairs[0].startDate);
            console.log('First pair date:', firstPairDate.format('YYYY-MM-DD'));
            if (firstPairDate.isValid()) {
              const result = firstPairDate.startOf('month').toDate();
              console.log('Returning first pair month:', dayjs(result).format('YYYY-MM-DD'));
              return result;
            }
          }
        }
      }
      
      let filteredAssignments = schedule.assignments.filter(
        assignment => !staffId || assignment.staffId === staffId
      );
      
      console.log('Filtered assignments:', filteredAssignments);
      
      if (filteredAssignments.length === 0) {
        console.log('No assignments found for staff, returning current date');
        return dayjs().toDate();
      }

      const sortedAssignments = filteredAssignments.sort((a, b) => {
        const dateA = dayjs.utc(a.shiftStart);
        const dateB = dayjs.utc(b.shiftStart);
        if (dateA.isValid() && dateB.isValid()) {
          return dateA.isBefore(dateB) ? -1 : 1;
        }
        return 0;
      });

      for (const assignment of sortedAssignments) {
        const date = dayjs.utc(assignment.shiftStart);
        console.log('Checking assignment date:', date.format('YYYY-MM-DD'));
        if (date.isValid()) {
          const firstOfMonth = date.startOf('month').toDate();
          console.log('Returning first shift month:', dayjs(firstOfMonth).format('YYYY-MM-DD'));
          return firstOfMonth;
        }
      }
    } catch (error) {
      console.error('Error finding earliest date:', error);
    }

    console.log('Falling back to current date');
    return dayjs().toDate();
  };

  const generatePairHighlights = () => {
    if (!selectedStaffId || !schedule?.staffs) return [];
    
    const selectedStaff = schedule.staffs.find(staff => staff.id === selectedStaffId);
    if (!selectedStaff || !selectedStaff.pairList) return [];
    
    const staffMap: {[key: string]: string} = {};
    schedule.staffs.forEach((staff, index) => {
      staffMap[staff.id] = classes[index % classes.length];
    });
    
    const highlights: PairHighlight[] = [];
    
    selectedStaff.pairList.forEach(pair => {
      if (!pair.partnerId || !pair.startDate || !pair.endDate) return;
      
      const dates = getDatesBetween(pair.startDate, pair.endDate);
      const color = staffMap[pair.partnerId] || 'bg-one';
      
      dates.forEach(date => {
        const formattedDate = dayjs(date, "DD-MM-YYYY").format("YYYY-MM-DD");
        highlights.push({
          date: formattedDate,
          color
        });
      });
    });
    
    return highlights;
  };

  const generateStaffBasedCalendar = () => {
    const works: EventInput[] = [];

    const filteredAssignments = schedule?.assignments?.filter(
      assignment => !selectedStaffId || assignment.staffId === selectedStaffId
    ) || [];

    for (let i = 0; i < filteredAssignments.length; i++) {
      const className = schedule?.shifts?.findIndex(
        (shift) => shift.id === filteredAssignments[i]?.shiftId
      );

      const assignmentDate = dayjs
        .utc(filteredAssignments[i]?.shiftStart)
        .format("YYYY-MM-DD");
      const isValidDate = validDates().includes(assignmentDate);

      const work = {
        id: filteredAssignments[i]?.id,
        title: getShiftById(filteredAssignments[i]?.shiftId)?.name,
        duration: "01:00",
        date: assignmentDate,
        staffId: filteredAssignments[i]?.staffId,
        shiftId: filteredAssignments[i]?.shiftId,
        className: `event ${classes[className]} ${
          getAssigmentById(filteredAssignments[i]?.id)?.isUpdated
            ? "highlight"
            : ""
        } ${!isValidDate ? "invalid-date" : ""}`,
        start: filteredAssignments[i]?.shiftStart,
        end: filteredAssignments[i]?.shiftEnd,
      };
      works.push(work);
    }

    const offDays = schedule?.staffs?.find(
      (staff) => staff.id === selectedStaffId
    )?.offDays;
    const dates = getDatesBetween(
      dayjs(schedule.scheduleStartDate).format("DD.MM.YYYY"),
      dayjs(schedule.scheduleEndDate).format("DD.MM.YYYY")
    );
    let highlightedDates: string[] = [];

    dates.forEach((date) => {
      const transformedDate = dayjs(date, "DD-MM-YYYY").format("DD.MM.YYYY");
      if (offDays?.includes(transformedDate)) highlightedDates.push(date);
    });

    const pairHighlights = generatePairHighlights();
    setPairHighlightedDates(pairHighlights);

    setHighlightedDates(highlightedDates);
    setEvents(works);
  };

  useEffect(() => {
    if (schedule) {
      const earliestDate = getEarliestEventDate(selectedStaffId);
      setInitialDate(earliestDate);
      
      requestAnimationFrame(() => {
        if (calendarRef.current && calendarRef.current.getApi()) {
          calendarRef.current.getApi().gotoDate(earliestDate);
        }
      });
      
      generateStaffBasedCalendar();
    }
  }, [schedule, selectedStaffId]);

  useEffect(() => {
    if (selectedStaffId && schedule) {
      const earliestDate = getEarliestEventDate(selectedStaffId);
      
      requestAnimationFrame(() => {
        if (calendarRef.current && calendarRef.current.getApi()) {
          calendarRef.current.getApi().gotoDate(earliestDate);
        }
      });
    }
  }, [selectedStaffId]);

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const assignment = getAssigmentById(eventId);
    
    if (assignment) {
      const staff = getStaffById(assignment.staffId);
      const shift = getShiftById(assignment.shiftId);
      
      const startTime = dayjs.utc(assignment.shiftStart).format('HH:mm');
      const endTime = dayjs.utc(assignment.shiftEnd).format('HH:mm');
      const date = dayjs.utc(assignment.shiftStart).format('DD.MM.YYYY');
      
      setEventDetails({
        id: eventId,
        staffName: staff?.name || 'Unknown Staff',
        shiftName: shift?.name || 'Unknown Shift',
        date,
        startTime,
        endTime
      });
      
      setShowEventDetails(true);
    }
  };

  const closeEventDetails = () => {
    setIsClosing(true);
    
    setTimeout(() => {
      setShowEventDetails(false);
      setEventDetails(null);
      setIsClosing(false);
    }, 300); 
  };

  const handleEventDrop = (info: any) => {
    const assignmentId = info.event.id;
    const newStart = info.event.start;
    const newEnd = info.event.end || newStart;
    dispatch(updateAssignment({
      id: assignmentId,
      shiftStart: newStart.toISOString(),
      shiftEnd: newEnd.toISOString(),
      isUpdated: true
    }) as unknown as UnknownAction);
  };

  const RenderEventContent = ({ eventInfo }: any) => {
    return (
      <div className="event-content">
        <p>{eventInfo.event.title}</p>
      </div>
    );
  };

  useEffect(() => {
    if (!showEventDetails) return;
    const handleClick = (e: MouseEvent) => {
      const popup = document.querySelector('.event-details-content');
      if (popup && !popup.contains(e.target as Node)) closeEventDetails();
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEventDetails]);

  const filteredStaffs = schedule?.staffs?.filter((staff: any) => staff.name.toLowerCase().includes(search.toLowerCase()));

  const handleDayMouseEnter = (date: Date, e: React.MouseEvent) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    let content = '';
    
    const pairHighlight = pairHighlightedDates.find(ph => ph.date === formattedDate);
    if (pairHighlight) {
      const selectedStaff = schedule?.staffs?.find(staff => staff.id === selectedStaffId);
      if (selectedStaff && selectedStaff.pairList) {
        const dateFormatted = dayjs(formattedDate).format("DD.MM.YYYY");
        
        const pair = selectedStaff.pairList.find(p => {
          if (!p.startDate || !p.endDate) return false;
          const startDate = dayjs(p.startDate, "DD.MM.YYYY");
          const endDate = dayjs(p.endDate, "DD.MM.YYYY");
          const currentDate = dayjs(dateFormatted, "DD.MM.YYYY");
          return (currentDate.isAfter(startDate) || currentDate.isSame(startDate)) && 
                 (currentDate.isBefore(endDate) || currentDate.isSame(endDate));
        });
        
        if (pair && pair.partnerId) {
          const partner = schedule?.staffs?.find(staff => staff.id === pair.partnerId);
          if (partner) {
            content += `Pair day: ${partner.name}\n`;
          } else {
            content += 'Pair day!\n';
          }
        } else {
          content += 'Pair day!\n';
        }
      } else {
        content += 'Pair day!\n';
      }
    }
    
    const assignment = events.find(ev => {
      const evDate = ev.date !== undefined ? String(ev.date) : '';
      return dayjs(evDate).format('YYYY-MM-DD') === formattedDate;
    });
    
    if (assignment) {
      content += `Shift: ${assignment.title}\nTime: `;
      const startTime = assignment.start !== undefined ? dayjs(String(assignment.start)).format('HH:mm') : 'N/A';
      const endTime = assignment.end !== undefined ? dayjs(String(assignment.end)).format('HH:mm') : 'N/A';
      content += `${startTime} - ${endTime}`;
    }
    
    if (!content) content = 'No events';
    setTooltip({visible: true, x: e.clientX + 12, y: e.clientY - 12, content});
  };
  const handleDayMouseLeave = () => setTooltip({visible: false, x: 0, y: 0, content: ''});

  const selectedStaff = schedule?.staffs?.find((staff: any) => staff.id === selectedStaffId);
  const staffColorMap: { [key: string]: string } = {
    "staff-1": "#FFD700",
    "staff-2": "#FF4444",
    "staff-3": "#4CAF50",
    "staff-4": "#2196F3"
  };

  return (
    <div className="calendar-section">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
        <span style={{fontSize:'1.3rem',fontWeight:700}}>
          {selectedStaff ? `${selectedStaff.name}'s Calendar` : 'Calendar'}
        </span>
        {selectedStaff && (
          <span style={{width:18,height:18,borderRadius:'50%',background:staffColorMap[selectedStaff.id]||'#19979c',display:'inline-block',border:'2px solid #fff'}}></span>
        )}
      </div>
      <input
        type="text"
        placeholder="Search staff..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{marginBottom:14,padding:'7px 14px',borderRadius:8,border:'1px solid #e0e0e0',fontSize:'1rem',width:220,maxWidth:'100%'}}
      />
      <div className="calendar-wrapper">
        <div className="staff-list">
          {filteredStaffs?.map((staff: any, index: number) => {
            const colorClass = classes[index % classes.length];
            const colorVar = `var(--${colorClass.replace('bg-', '')}-color)`;
            
            return (
              <div
                key={staff.id}
                onClick={() => setSelectedStaffId(staff.id)}
                className={`staff staff-color-${(index % 20) + 1} ${staff.id === selectedStaffId ? "active" : ""}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                >
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17-62.5t47-43.5q60-30 124.5-46T480-440q67 0 131.5 16T736-378q30 15 47 43.5t17 62.5v112H160Zm320-400q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm160 228v92h80v-32q0-11-5-20t-15-14q-14-8-29.5-14.5T640-332Zm-240-21v53h160v-53q-20-4-40-5.5t-40-1.5q-20 0-40 1.5t-40 5.5ZM240-240h80v-92q-15 5-30.5 11.5T260-306q-10 5-15 14t-5 20v32Zm400 0H320h320ZM480-640Z" />
                </svg>
                <span>{staff.name}</span>
                <span 
                  className="staff-color-indicator" 
                  style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: colorVar,
                    marginLeft: 'auto'
                  }}
                ></span>
              </div>
            );
          })}
        </div>
        {!selectedStaffId && (
          <div style={{margin:'40px auto',textAlign:'center',color:'#888',fontSize:'1.2rem',fontWeight:500}}>
            Please select a staff member.
          </div>
        )}
        {selectedStaffId && (
        <FullCalendar
          ref={calendarRef}
          locale={auth.language}
          plugins={getPlugins()}
          contentHeight={400}
          handleWindowResize={true}
          selectable={true}
          editable={true}
          eventDrop={handleEventDrop}
          eventOverlap={true}
          eventDurationEditable={true}
          initialView="dayGridMonth"
          initialDate={initialDate}
          events={events}
          firstDay={1}
          dayMaxEventRows={4}
          fixedWeekCount={true}
          showNonCurrentDates={true}
          eventContent={(eventInfo: any) => (
            <RenderEventContent eventInfo={eventInfo} />
          )}
          eventClick={handleEventClick}
          dayCellContent={({ date }) => {
            const formattedDate = dayjs(date).format('YYYY-MM-DD');
            const found = validDates().includes(
              dayjs(date).format("YYYY-MM-DD")
            );
            const isHighlighted = highlightedDates.includes(
              dayjs(date).format("DD-MM-YYYY")
            );
            const pairHighlight = pairHighlightedDates.find(
              ph => ph.date === formattedDate
            );
            
            const dateClasses = [
              found ? "" : "date-range-disabled",
              isHighlighted ? "highlighted-date-orange" : "",
              pairHighlight ? "highlightedPair" : "",
              pairHighlight ? pairHighlight.color : ""
            ].filter(Boolean).join(" ");
            
            return (
              <div
                className={dateClasses}
                onMouseEnter={e => handleDayMouseEnter(date, e)}
                onMouseLeave={handleDayMouseLeave}
                style={{
                  position: 'relative',
                  padding: '8px 4px 12px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                {dayjs(date).date()}
              </div>
            );
          }}
          datesSet={(info: any) => {
            const prevButton = document.querySelector(
              ".fc-prev-button"
            ) as HTMLButtonElement;
            const nextButton = document.querySelector(
              ".fc-next-button"
            ) as HTMLButtonElement;

            if (
              schedule?.assignments?.length > 0 &&
              info.view.type === "dayGridMonth" &&
              !info.view.calendar.currentDataManager?.data?.dateProfile?.currentRange.start
            ) {
              info.view.calendar.gotoDate(initialDate);
            }

            if (
              calendarRef?.current?.getApi().getDate() &&
              !dayjs(schedule?.scheduleStartDate).isSame(
                calendarRef?.current?.getApi().getDate()
              )
            )
              setInitialDate(calendarRef?.current?.getApi().getDate());

            const startDiff = dayjs(info.start)
              .utc()
              .diff(
                dayjs(schedule.scheduleStartDate).subtract(1, "day").utc(),
                "days"
              );
            const endDiff = dayjs(dayjs(schedule.scheduleEndDate)).diff(
              info.end,
              "days"
            );
            if (startDiff < 0 && startDiff > -35) prevButton.disabled = true;
            else prevButton.disabled = false;

            if (endDiff < 0 && endDiff > -32) nextButton.disabled = true;
            else nextButton.disabled = false;
          }}
        />
        )}
        <div
          className={`calendar-tooltip${tooltip.visible ? ' visible' : ''}`}
          style={{left: tooltip.x, top: tooltip.y, pointerEvents:'none', position:'fixed'}}
        >
          {tooltip.content}
        </div>
        {showEventDetails && eventDetails && (
          <div className={`event-details-popup ${isClosing ? 'closing' : ''}`}>
            <div className={`event-details-content ${isClosing ? 'closing' : ''}`} style={{minWidth:320,maxWidth:420,padding:0,overflow:'hidden',boxShadow:'0 10px 32px rgba(0,0,0,0.18)'}}>
              <div className="event-details-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'20px 24px',background:'#19979c',color:'#fff'}}>
                <h3 style={{margin:0,fontSize:20,fontWeight:700,letterSpacing:0.5}}>Event Details</h3>
                <button onClick={closeEventDetails} className="close-button" style={{background:'none',border:'none',color:'#fff',fontSize:28,cursor:'pointer',padding:0,marginLeft:12}}>&times;</button>
              </div>
              <div className="event-details-body" style={{padding:'24px 24px 18px'}}>
                <p><strong>Staff:</strong> {eventDetails.staffName}</p>
                <p><strong>Shift:</strong> {eventDetails.shiftName}</p>
                <p><strong>Date:</strong> {eventDetails.date}</p>
                <p><strong>Start:</strong> {eventDetails.startTime}</p>
                <p><strong>End:</strong> {eventDetails.endTime}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarContainer;
