import React from "react";

const Alert = ({ message, show }) => {
  if (!show) return null; // Do not render if `show` is false

  return (
    <div>
      <aside
        className="fixed inset-0 z-40 m-3 flex items-start justify-center"
        style={{ pointerEvents: "none" }}
      >
        <div className="flex items-center justify-center gap-4 rounded-lg bg-black px-3 py-2 text-white italic">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-sm hover:opacity-75"
          >
            {message}
          </a>
        </div>
      </aside>
    </div>
  );
};

export default Alert;
