import * as SQLite from "expo-sqlite";
import { SessionSettings, Task, SessionData } from "../constants/types";

const db = SQLite.openDatabaseSync("focus-flow.db");

// Initialize database
export const initDatabase = () => {
  try {
    // Session settings table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS session_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        focus_time INTEGER,
        short_break INTEGER,
        long_break INTEGER,
        sections INTEGER
      );`
    );
    // Flow sessions table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS flow_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag_id INTEGER,
        task_id INTEGER,
        start_date TEXT,
        end_date TEXT,
        total_focus_time INTEGER DEFAULT 0, -- Store in seconds
        total_break_time INTEGER DEFAULT 0,  -- Store in seconds
        FOREIGN KEY(tag_id) REFERENCES tags(id),
        FOREIGN KEY(task_id) REFERENCES tasks(id)
      );`
    );
    // Sessions table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        flow_session_id INTEGER,
        start_time TEXT,
        end_time TEXT,
        duration INTEGER,  -- Duration stored in seconds
        type TEXT,
        FOREIGN KEY(flow_session_id) REFERENCES flow_sessions(id)
      );`
    );
    // Tags table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
      );`
    );
    // Tasks table
    db.execSync(
      `CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tag_id INTEGER,
        name TEXT,
        description TEXT,
        isTaskCompleted INTEGER,
        FOREIGN KEY(tag_id) REFERENCES tags(id)
      );`
    );

    // Preferences table for storing
    db.execSync(
      `CREATE TABLE IF NOT EXISTS preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        pref_key TEXT UNIQUE,
        pref_value TEXT
      );`
    );
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

// Get session settings from the database
export const getSessionSettings = (): SessionSettings | null => {
  try {
    // Fetch all records from the session settings table
    const result = db.getAllSync("SELECT * FROM session_settings WHERE id = 1");

    if (result.length > 0) {
      const settings = result[0] as SessionSettings;
      return {
        focus_time: settings.focus_time,
        short_break: settings.short_break,
        long_break: settings.long_break,
        sections: settings.sections,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting session settings:", error);
    return null;
  }
};

// Update session settings in the database (or insert if not already present)
export const updateSessionSettings = (settings: SessionSettings): void => {
  try {
    db.runSync(
      "INSERT OR REPLACE INTO session_settings (id, focus_time, short_break, long_break, sections) VALUES (1, ?, ?, ?, ?)",
      [
        settings.focus_time,
        settings.short_break,
        settings.long_break,
        settings.sections,
      ]
    );
  } catch (error) {
    console.error("Error updating session settings:", error);
  }
};

// Open database connection
export const openDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("focus-flow.db");
    return db;
  } catch (error) {
    console.error("Error opening database:", error);
    throw error;
  }
};

// Insert a flow session into the flow_sessions table when the timer starts
export const insertFlowSession = async (
  startDate: string,
  tagId: number | null,
  taskId: number | null
): Promise<number> => {
  const db = await openDatabase();
  try {
    const result = await db.runAsync(
      "INSERT INTO flow_sessions (start_date, tag_id, task_id) VALUES (?, ?, ?);",
      [startDate, tagId, taskId]
    );
    console.log("Check task id: ", taskId);
    console.log("Check tag id: ", tagId);
    console.log("Flow session inserted successfully");
    return result.lastInsertRowId as number;
  } catch (error) {
    console.error("Error inserting flow session:", error);
    throw error;
  }
};

// Update the flow session with the total focus time and total break time
export const updateFlowSession = async (
  flowSessionId: number,
  totalFocusTimeInMillis: number,
  totalBreakTimeInMillis: number,
  endDate: string
): Promise<void> => {
  const db = await openDatabase();
  const totalFocusTime = Math.floor(totalFocusTimeInMillis / 1000);
  const totalBreakTime = Math.floor(totalBreakTimeInMillis / 1000);

  try {
    console.log("Updating flow_session:", {
      flowSessionId,
      totalFocusTime,
      totalBreakTime,
      endDate,
    });
    await db.runAsync(
      "UPDATE flow_sessions SET total_focus_time = ?, total_break_time = ?, end_date = ? WHERE id = ?;",
      [totalFocusTime, totalBreakTime, endDate, flowSessionId]
    );
    console.log("Flow session updated successfully");
  } catch (error) {
    console.error("Error updating flow session:", error);
  }
};

// Insert a session (focus or break) into the sessions table
export const insertSession = async (
  flow_session_id: number,
  start_time: string,
  end_time: string,
  currentSession: number
): Promise<void> => {
  const db = await openDatabase();
  const type = currentSession % 2 === 1 ? "Focus" : "Break";
  const start = new Date(start_time);
  const end = new Date(end_time);
  const durationInMillis = end.getTime() - start.getTime();

  if (durationInMillis <= 0) {
    console.error(
      "Invalid duration! The end time must be later than the start time."
    );
    return;
  }

  const durationInSeconds = Math.floor(durationInMillis / 1000);
  console.log("Inserting session:", {
    flow_session_id,
    start_time,
    end_time,
    durationInSeconds,
    type,
  });

  // Insert session into the database
  try {
    await db.runAsync(
      "INSERT INTO sessions (flow_session_id, start_time, end_time, duration, type) VALUES (?, ?, ?, ?, ?);",
      [flow_session_id, start_time, end_time, durationInSeconds, type]
    );
    console.log("Session inserted successfully");

    // Update the flow session totals after session insertion
    await updateFlowSessionTotals(flow_session_id);
  } catch (error) {
    console.error("Error inserting session:", error);
  }
};

// Update the flow session totals after each session insertion
const updateFlowSessionTotals = async (
  flowSessionId: number
): Promise<void> => {
  const db = await openDatabase();

  try {
    const sessions = await db.getAllAsync(
      "SELECT * FROM sessions WHERE flow_session_id = ?;",
      [flowSessionId]
    );

    let totalFocusTime = 0;
    let totalBreakTime = 0;

    sessions.forEach((session: any) => {
      if (session.type === "Focus") {
        totalFocusTime += session.duration;
      } else if (session.type === "Break") {
        totalBreakTime += session.duration;
      }
    });

    // Update the flow session with the new totals
    await updateFlowSession(
      flowSessionId,
      totalFocusTime * 1000,
      totalBreakTime * 1000,
      new Date().toISOString()
    );

    console.log("Flow session totals updated successfully.");
  } catch (error) {
    console.error("Error updating flow session totals:", error);
  }
};

// Function to get the last flow_session_id from the database
export const getLastFlowSessionId = (): number => {
  try {
    const result = db.getAllSync(
      "SELECT id FROM flow_sessions ORDER BY id DESC LIMIT 1"
    );

    // Check if any results were returned
    if (result.length > 0) {
      const flowSession = result[0] as { id: number };
      return flowSession.id + 1; // Return the next flow session ID
    } else {
      // If no flow sessions exist, return 1 as the starting ID
      return 1;
    }
  } catch (error) {
    console.error("Error fetching flow session ID:", error);
    return 1;
  }
};

// Function to get session data for a specific date range
export const getSessionsData = (
  startDate: string,
  endDate: string
): SessionData[] => {
  try {
    const result = db.getAllSync(
      //"SELECT * FROM sessions WHERE start_time >= ? AND start_time <= ?;",
      `SELECT 
          s.id,
          s.start_time,
          s.end_time,
          s.duration,
          s.type,
          COALESCE(t.name, 'No Tag') AS tag
        FROM sessions s
        JOIN flow_sessions fs ON s.flow_session_id = fs.id
        LEFT JOIN tags t ON fs.tag_id = t.id
        WHERE s.start_time BETWEEN ? AND ?
        ORDER BY s.start_time ASC;`,
      [startDate, endDate]
    );
    return result as SessionData[];
  } catch (error) {
    console.error("Error getting sessions: ", error);
    return [];
  }
};

// Function to get statistics for a specific task
export const getTaskStatistics = (taskId: number) => {
  try {
    const result = db.getAllSync(
      `SELECT
        t.name AS task_name,
        fs.id AS flow_session_id,
        fs.start_date,
        fs.end_date,
        fs.total_focus_time,
        fs.total_break_time
      FROM flow_sessions fs
      JOIN tasks t on t.id = fs.task_id
      WHERE fs.task_id = ?`,
      [taskId]
    ) as Array<{
      task_name: string;
      flow_session_id: number;
      start_date: string;
      end_date: string;
      total_focus_time: number;
      total_break_time: number;
    }>;

    let totalFocusTime = 0;
    let totalBreakTime = 0;
    const flowSessions = result.map((session: any) => {
      totalFocusTime += session.total_focus_time;
      totalBreakTime += session.total_break_time;

      return {
        flowSessionId: session.flow_session_id,
        date: session.start_date,
        duration: session.total_focus_time + session.total_break_time,
      };
    });

    const taskName = result.length > 0 ? result[0].task_name : "UnknownTask";
    return {
      taskName,
      totalFocusTime,
      totalBreakTime,
      flowSessions,
    };
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    return null;
  }
};

// Function to insert a tag into tag table
export const insertTag = async (tagName: string): Promise<void> => {
  const db = await openDatabase();
  try {
    await db.runAsync("INSERT OR IGNORE INTO tags (name) VALUES (?);", [
      tagName,
    ]);
    console.log("Tag inserted or already exists");
  } catch (error) {
    console.error("Error inserting tag: ", error);
  }
};

// Function to get all tags
export const getTags = async (): Promise<{ id: number; name: string }[]> => {
  const db = await openDatabase();
  try {
    const result = await db.getAllAsync("SELECT * FROM tags;");
    return result as { id: number; name: string }[];
  } catch (error) {
    console.error("Error gettings tags: ", error);
    return [];
  }
};

// Function to insert a task into the tasks table
export const insertTask = (
  tagId: number | null,
  name: string,
  description: string
): number | null => {
  try {
    const result = db.runSync(
      "INSERT INTO tasks (tag_id, name, description) VALUES (?, ?, ?);",
      [tagId, name, description]
    );
    console.log("Task inserted successfully");
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error inserting task:", error);
    return null;
  }
};

// Function to get all tasks
export const getTasks = (): Task[] => {
  try {
    const result = db.getAllSync("SELECT * FROM tasks;");
    return result as Task[];
  } catch (error) {
    console.error("Error getting tasks: ", error);
    return [];
  }
};
// Function to update a task
export const updateTask = (
  id: number,
  tagId: number | null,
  name: string,
  description: string,
  isTaskCompleted: number
): void => {
  try {
    db.runSync(
      "UPDATE tasks SET tag_id = ?, name = ?, description = ?, isTaskCompleted = ? WHERE id = ?;",
      [tagId, name, description, isTaskCompleted, id]
    );
    console.log("Task updated successfully");
  } catch (error) {
    console.error("Error updating task:", error);
  }
};
// Function to update tags in flow sessions
export const updateTags = (id: number, tagId: number | null): void => {
  try {
    db.runSync("UPDATE flow_sessions SET tag_id = ? WHERE task_id = ?;", [
      tagId,
      id,
    ]);
    console.log("Tags updated successfully");
  } catch (error) {
    console.error("Error updating tags:", error);
  }
};

//Function to delete a task
export const deleteTask = (id: number): void => {
  try {
    db.runSync("DELETE FROM tasks WHERE id = ?;", [id]);
    console.log("Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

//Function to delete completed tasks
export const deleteCompletedTasks = (): void => {
  try {
    db.runSync("DELETE FROM tasks WHERE isTaskCompleted = true;");
    console.log("Completed tasks deleted successfully");
  } catch (error) {
    console.error("Error deleting completed tasks:", error);
  }
};

export const getUserPreference = (key: string): string | null => {
  try {
    const result = db.getAllSync(
      "SELECT pref_value FROM preferences WHERE pref_key = ?;",
      [key]
    ) as Array<{ pref_value: string }>;

    if (result.length > 0) {
      return result[0].pref_value;
    }
    return null;
  } catch (error) {
    console.error("Error getting user preference:", error);
    return null;
  }
};

// Set or update a user preference
export const setUserPreference = (key: string, value: string): void => {
  try {
    const existing = db.getAllSync(
      "SELECT id FROM preferences WHERE pref_key = ?;",
      [key]
    ) as Array<{ id: number }>;

    if (existing.length > 0) {
      db.runSync("UPDATE preferences SET pref_value = ? WHERE pref_key = ?;", [
        value,
        key,
      ]);
      console.log(`Preference '${key}' updated to '${value}'`);
    } else {
      db.runSync(
        "INSERT INTO preferences (pref_key, pref_value) VALUES (?, ?);",
        [key, value]
      );
      console.log(`Preference '${key}' inserted with value '${value}'`);
    }
  } catch (error) {
    console.error("Error setting user preference:", error);
  }
};

// Function to delete all user data
export const deleteAllUserData = async () => {
  try {
    // Delete all record from the flow_sessions, sessions, tasks, and tags tables
    await db.runAsync("DELETE FROM flow_sessions;");
    await db.runAsync("DELETE FROM sessions;");
    await db.runAsync("DELETE FROM tasks;");
    await db.runAsync("DELETE FROM tags;");

    console.log("All user data deleted successfully.");
    
  } catch (error) {
    console.error("Error deleing all user data:", error);
  }
};

// Function to check if a task exists in the db
export const checkTaskExists = (taskId: number): boolean => {
  try {
    const result = db.getAllSync(
      "SELECT 1 FROM tasks WHERE id = ? LIMIT 1;", 
      [taskId]
    );
    
    // If the result has any rows, the task exists
    return result.length > 0;
  } catch (error) {
    console.error("Error checking task existence:", error);
    return false;
  }
};

