import { createContext, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const AlertContext = createContext(null);

let nextId = 0;

// Shows alerts at the bottom center. Same useAlert() API as react-alert, which does not run on React 19.
export function AlertProvider({ template: Template, timeout, offset, children }) {
  const [alerts, setAlerts] = useState([]);

  const alert = useMemo(() => {
    const remove = (id) =>
      setAlerts((list) => list.filter((item) => item.id !== id));

    const show = (message, type) => {
      const id = nextId++;
      setAlerts((list) => [...list, { id, message, options: { type } }]);
      setTimeout(() => remove(id), timeout);
    };

    return {
      remove,
      info: (message) => show(message, "info"),
      success: (message) => show(message, "success"),
      error: (message) => show(message, "error"),
    };
  }, [timeout]);

  return (
    <AlertContext.Provider value={alert}>
      {children}
      {createPortal(
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          {alerts.map((item) => (
            <Template
              key={item.id}
              style={{ margin: offset, pointerEvents: "all" }}
              message={item.message}
              options={item.options}
              close={() => alert.remove(item.id)}
            />
          ))}
        </div>,
        document.body
      )}
    </AlertContext.Provider>
  );
}

export const useAlert = () => useContext(AlertContext);
