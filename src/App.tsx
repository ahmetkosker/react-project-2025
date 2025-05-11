import { useState } from "react";
import { Provider, useSelector } from "react-redux";
import store from "./store";
import ProfileCalendar from "./components/ProfileCalendar";
import BoardView from "./components/Board/BoardView";
import './App.css'
import type { RootStateInstance } from "./store/reducer";

type ViewType = 'calendar' | 'board';

const VIEW_TYPE = {
  CALENDAR: 'calendar' as ViewType,
  BOARD: 'board' as ViewType,
};

const AppContent = () => {
  const [activeView, setActiveView] = useState<ViewType>(VIEW_TYPE.CALENDAR);
  const schedule = useSelector((state: RootStateInstance) => state.schedule.schedule);

  return (
    <div className="app-container">
      <div className="app-tabs">
        <button 
          className={activeView === VIEW_TYPE.CALENDAR ? 'active' : ''} 
          onClick={() => setActiveView(VIEW_TYPE.CALENDAR)}
        >
          Calendar
        </button>
        <button 
          className={activeView === VIEW_TYPE.BOARD ? 'active' : ''} 
          onClick={() => setActiveView(VIEW_TYPE.BOARD)}
        >
          Kanban Board
        </button>
      </div>
      
      <div className="app-content">
        {activeView === VIEW_TYPE.CALENDAR && <ProfileCalendar />}
        {activeView === VIEW_TYPE.BOARD && <BoardView schedule={schedule} />}
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store()}>
      <AppContent />
    </Provider>
  );
}

export default App;
