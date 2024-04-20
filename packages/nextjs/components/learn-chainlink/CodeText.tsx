import React from "react";
import { useTheme } from "next-themes";

export const CodeText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  return (
    <div
      className={isDarkMode ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-800"}
      style={{ padding: "16px", borderRadius: "8px", marginTop: "16px", fontFamily: "monospace" }}
    >
      {children}
    </div>
  );
};
