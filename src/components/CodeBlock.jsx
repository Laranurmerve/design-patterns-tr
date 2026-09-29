import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";

const CodeBlock = ({ code, language = "csharp" }) => {
const [copied, setCopied] = useState(false);

const handleCopy = async () => {
try {
await navigator.clipboard.writeText(code);
setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
} catch (error) {
  console.error("Kod kopyalanamadı:", error);
}

};

return (
<div
style={{
position: "relative",
margin: "20px 0",
borderRadius: "10px",
overflow: "hidden",
backgroundColor: "#1e1e1e",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
padding: "8px 12px",
backgroundColor: "#252526",
color: "#cccccc",
fontSize: "13px",
}}
> <span>{language.toUpperCase()}</span>

    <button
      type="button"
      onClick={handleCopy}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 10px",
        border: "none",
        borderRadius: "6px",
        backgroundColor: "#333333",
        color: "#ffffff",
        cursor: "pointer",
      }}
    >
      {copied ? (
        <>
          <Check size={16} />
          Kopyalandı
        </>
      ) : (
        <>
          <Copy size={16} />
          Kopyala
        </>
      )}
    </button>
  </div>

  <SyntaxHighlighter
    language={language}
    style={vscDarkPlus}
    customStyle={{
      margin: 0,
      padding: "20px",
      fontSize: "14px",
      lineHeight: "1.6",
    }}
  >
    {code}
  </SyntaxHighlighter>
</div>

);
};

export default CodeBlock;
