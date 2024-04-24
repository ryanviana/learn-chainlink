import React from "react";
import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// Import specific styles
import { okaidia, solarizedlight } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const CodeText: React.FC<{ children: string; language?: string }> = ({ children, language = "javascript" }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Choose the theme based on the resolvedTheme
  const themeStyle = isDarkMode ? okaidia : solarizedlight;

  return (
    <SyntaxHighlighter
      language={language}
      style={themeStyle}
      customStyle={{
        padding: "16px",
        borderRadius: "8px",
        marginTop: "16px",
        fontFamily: "monospace",
        background: isDarkMode ? "#2D2D2D" : "#F5F5F5",
      }}
    >
      {children}
    </SyntaxHighlighter>
  );
};
