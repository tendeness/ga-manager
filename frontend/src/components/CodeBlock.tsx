import { memo } from 'react';

// ── Diff block (lightweight, no syntax highlighting needed) ──
function DiffBlock({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <div className="code-diff-block">
      {lines.map((line, i) => {
        let cls = 'diff-line';
        if (line.startsWith('+') && !line.startsWith('+++')) cls += ' diff-add';
        else if (line.startsWith('-') && !line.startsWith('---')) cls += ' diff-del';
        else if (line.startsWith('@@')) cls += ' diff-hunk';
        return <div key={i} className={cls}>{line}</div>;
      })}
    </div>
  );
}

// ── Simple code block (replaces heavy react-syntax-highlighter) ──
// react-syntax-highlighter bundles the full PrismJS (~400KB+),
// causing synchronous parser blocking on every render.
// This lightweight version renders code instantly while preserving
// formatting and monospace font.
function SimpleCodeBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <pre
      className={`code-block language-${lang}`}
      style={{
        background: 'transparent',
        margin: 0,
        padding: '14px 16px',
        overflow: 'auto',
        fontSize: '12px',
        lineHeight: '1.6',
      }}
    >
      <code
        className={`language-${lang}`}
        style={{
          fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
          fontSize: '12px',
          color: 'var(--text-1, #e0d0e0)',
        }}
      >
        {code}
      </code>
    </pre>
  );
}

// ── Props ──
interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

// ── Component (memoized to avoid re-renders on parent updates) ──
function CodeBlock({ className, children }: CodeBlockProps) {
  const code = String(children).replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : '';

  if (lang === 'diff') {
    return <DiffBlock code={code} />;
  }

  if (!lang) {
    return <code className="inline-code">{code}</code>;
  }

  return <SimpleCodeBlock code={code} lang={lang} />;
}

export default memo(CodeBlock);
