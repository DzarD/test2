import { useState, useEffect, useRef } from "react";
import { insertSession, insertFlowSession, updateFlowSession, getLastFlowSessionId } from "../database/db";
import { SessionSettings } from "../constants/types";

export const useTimer = (initialSettings: SessionSettings, initialSession: number, initialFlowSessionId: number, initialTagId: number | null, taskId: number | null) => {
  const [settings, setSettings] = useState(initialSettings);
  const [timeLeft, setTimeLeft] = useState(settings.focus_time *  60 * 1000);
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState(initialSession);
  const [flowSessionId, setFlowSessionId] = useState(initialFlowSessionId);
  const [tagId, setTagId] = useState(initialTagId);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);

  // Calculate session label based on the current session
  const sessionLabel = 
    currentSession % 2 === 1
      ? "Focus"
      : (settings.sections * 2 === currentSession ? "Long Break" : "Break");

  // Start the timer and update timeLeft
  const startNewTimer = (newStartTime: number) => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(timerRef.current!);
          handleSessionTransition(newStartTime);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
  };

  // Start/Stop timer based on isActive state
  const startStopTimer = () => {
    if (isActive) {
      // When stopping the timer, save the session
      if (sessionStartTime !== null) {
        const sessionType = currentSession % 2 === 1 ? "Focus" : "Break";
        saveSession(sessionStartTime, sessionType);
      }
      clearInterval(timerRef.current!); // Stop the timer
      timerRef.current = null; ///ensures time is not used after stopping
      setIsActive(false);
      setSettings(initialSettings); //If settings have changed while the timer is active

      // Update flow session after stopping
      updateFlowSession(flowSessionId, totalFocusTime, totalBreakTime, new Date().toISOString()).then(() => {
        // After updating the flow session, increment flow_session_id
        setFlowSessionId((prevFlowSessionId) => prevFlowSessionId + 1);
      });

      // Reset to the first session (Focus) after stopping
      setCurrentSession(1);  // Reset to Focus session
      setTimeLeft(settings.focus_time *  60 * 1000);  // Reset the timer to focus duration
    } else {
      const newStartTime = Date.now();
      setSessionStartTime(newStartTime);  // Set the actual session start time for the first session
      startNewTimer(newStartTime);  // Start the timer for the current session
      setIsActive(true);

      // Insert flow session when the timer starts, passing the taskId
      insertFlowSession(new Date().toISOString(), tagId, taskId).then((newFlowSessionId) => {
        setFlowSessionId(newFlowSessionId); // Set new flow session ID
      });
    }
  };

  // Handle session transition (Focus <-> Break)
  const handleSessionTransition = (startTime: number , isSkippingBreak = false) => {
    let nextSession = currentSession;
    let nextDuration = settings.focus_time *  60 * 1000; // Default to focus session duration
    let sessionType = "Focus";

    if (currentSession % 2 === 1) {
      // Focus session -> Break session
      nextSession = currentSession + 1;
      // Set break duration
      nextDuration = (currentSession % 4 === 1) ? settings.short_break * 60 * 1000 : settings.long_break * 60 * 1000;
      sessionType = "Break";

      if (nextSession % (settings.sections * 2) === 0) {
        nextDuration = settings.long_break * 60 * 1000;
      }
    
    } else {
      // Break session -> Focus session
      nextSession = currentSession + 1;
      nextDuration = settings.focus_time *  60 * 1000;
      sessionType = "Focus";
    }

    setCurrentSession(nextSession);
    setTimeLeft(nextDuration);  // Set the next session's time duration
    setSessionStartTime(Date.now());  // Update session start time for the next session

    // Update the total time based on session type
    if (sessionType === "Focus") {
      setTotalFocusTime((prevTime) => prevTime + nextDuration);
    } else {
      setTotalBreakTime((prevTime) => prevTime + nextDuration);
    }

    saveSession(startTime, sessionType);  // Save the session when it ends
  };

  // Save session data to the database
  const saveSession = (startTime: number, type: string) => {
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime) / 1000);
    console.log(`Saving session: ${currentSession}, Duration: ${duration} seconds`);

    // Save session to the database
    insertSession(flowSessionId, new Date(startTime).toISOString(), new Date(endTime).toISOString(), currentSession)
      .then(() => {
        console.log("Session saved successfully.");
      })
      .catch((error) => {
        console.error("Error saving session:", error);
      });
  };

  // Fetch flow_session_id from the database when the component mounts
  useEffect(() => {
    const fetchFlowSessionId = async () => {
      // Fetch the most recent flow session ID from the database
      const result = await getLastFlowSessionId();
      setFlowSessionId(result);
    };
    fetchFlowSessionId();
  }, []);

  // Update settings only if timer is not active
  useEffect(() => {
    if (!isActive) {
      setSettings(initialSettings);
      setTimeLeft(initialSettings.focus_time *  60 * 1000);  // Reset time if settings change
    }
  }, [initialSettings, isActive]);

  // Update tag id
  useEffect(() => {
    setTagId(initialTagId);
  }, [initialTagId]);

  // Update session duration when session changes
  useEffect(() => {
    if (currentSession % 2 === 1) {
      setTimeLeft(settings.focus_time *  60 * 1000);
    } else if (currentSession % (settings.sections * 2) === 0) {
      setTimeLeft(settings.long_break * 60 * 1000);
    } else {
      setTimeLeft(settings.short_break * 60 * 1000);
    }

    if (isActive) {
      startNewTimer(Date.now());  // Restart the timer when the session changes
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);  // Clean up timer when component unmounts
      }
    };
  }, [currentSession, isActive]);

  const skipBreak = () => {
    // only if we're active and on a break 
    if (!isActive || currentSession % 2 === 1 || !sessionStartTime) {
      console.log("No break to skip or timer not active.");
      return;
    }

    // Skip the break and start a new
    handleSessionTransition(sessionStartTime, true);

    console.log("Skipped break. Now starting a new focus session.");
  };

  return { timeLeft, isActive, startStopTimer, currentSession, sessionLabel, skipBreak };
};
