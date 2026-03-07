# Code Blocks for Remotion Videos

**IMPORTANT:** Do NOT use regex-based syntax highlighting - it breaks easily. Use `prism-react-renderer` instead.

## Installation

```bash
npm install prism-react-renderer
```

## CodeBlock Component

```tsx
// src/components/CodeBlock.tsx
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { Highlight, themes } from 'prism-react-renderer';

type CodeBlockProps = {
  code: string;
  language?: string;
  delay?: number;
  animate?: boolean;
  highlightLines?: number[];
  fontSize?: number;
};

export function CodeBlock({
  code,
  language = 'typescript',
  delay = 0,
  animate = true,
  highlightLines = [],
  fontSize = 16,
}: CodeBlockProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in animation
  const opacity = interpolate(
    frame,
    [delay * fps, (delay + 0.3) * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Typewriter effect - reveal characters over time
  const charsToShow = animate
    ? Math.floor(
        interpolate(
          frame,
          [(delay + 0.2) * fps, (delay + 0.2) * fps + code.length * 0.5],
          [0, code.length],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      )
    : code.length;

  const displayCode = code.slice(0, charsToShow);

  return (
    <div
      className="bg-background-200 border border-gray-400 rounded-lg overflow-hidden"
      style={{ opacity }}
    >
      <Highlight theme={geistDarkTheme} code={displayCode} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{
              ...style,
              margin: 0,
              padding: 24,
              fontSize,
              lineHeight: 1.6,
              fontFamily: "'Geist Mono', monospace",
              backgroundColor: 'transparent',
            }}
          >
            {tokens.map((line, i) => {
              const isHighlighted = highlightLines.includes(i + 1);
              return (
                <div
                  key={i}
                  {...getLineProps({ line })}
                  style={{
                    display: 'flex',
                    backgroundColor: isHighlighted ? 'rgba(0, 112, 243, 0.15)' : 'transparent',
                    margin: isHighlighted ? '0 -24px' : 0,
                    padding: isHighlighted ? '0 24px' : 0,
                  }}
                >
                  <span
                    style={{
                      color: '#525252',
                      marginRight: 24,
                      minWidth: 24,
                      textAlign: 'right',
                      userSelect: 'none',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

// Geist-inspired dark theme for prism-react-renderer
const geistDarkTheme = {
  plain: {
    color: '#ededed',
    backgroundColor: '#171717',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: '#525252', fontStyle: 'italic' as const },
    },
    {
      types: ['punctuation'],
      style: { color: '#737373' },
    },
    {
      types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'],
      style: { color: '#0070F3' },
    },
    {
      types: ['selector', 'attr-name', 'string', 'char', 'builtin', 'inserted'],
      style: { color: '#46A758' },
    },
    {
      types: ['operator', 'entity', 'url', 'variable'],
      style: { color: '#ededed' },
    },
    {
      types: ['atrule', 'attr-value', 'keyword'],
      style: { color: '#FF6B8A' },  // Pink for keywords
    },
    {
      types: ['function', 'class-name'],
      style: { color: '#FFB224' },  // Amber for functions
    },
    {
      types: ['regex', 'important'],
      style: { color: '#FFB224' },
    },
  ],
};
```

## Usage

```tsx
import { CodeBlock } from '../components/CodeBlock';

// Basic usage
<CodeBlock code={myCode} />

// With options
<CodeBlock
  code={`export async function myWorkflow() {
  "use workflow";

  const result = await doSomething();
  return result;
}`}
  language="typescript"
  delay={0.3}
  animate={true}
  highlightLines={[2]}  // Highlight line 2
  fontSize={18}
/>
```

## Supported Languages

Common languages: `typescript`, `javascript`, `jsx`, `tsx`, `json`, `bash`, `css`, `html`, `python`, `go`, `rust`

## Theme Colors (Geist-aligned)

| Token Type | Color | Hex |
|------------|-------|-----|
| Plain text | Gray 100 | #ededed |
| Comments | Gray 500 | #525252 |
| Punctuation | Gray 400 | #737373 |
| Strings | Green 700 | #46A758 |
| Numbers/Constants | Blue 700 | #0070F3 |
| Keywords | Pink | #FF6B8A |
| Functions | Amber 700 | #FFB224 |

## Line Highlighting

Use `highlightLines` prop to draw attention to specific lines:

```tsx
// Highlight the directive on line 2
<CodeBlock
  code={workflowCode}
  highlightLines={[2]}
/>

// Highlight multiple lines
<CodeBlock
  code={errorHandlingCode}
  highlightLines={[5, 6, 7]}
/>
```

## Typewriter Animation

The `animate` prop enables a typewriter effect that reveals code character by character. Set to `false` for instant display:

```tsx
// With typewriter (default)
<CodeBlock code={myCode} animate={true} />

// Instant display
<CodeBlock code={myCode} animate={false} />
```

## Alternative: Static Code (No Library)

If you want to avoid the dependency, use a simpler approach without syntax highlighting:

```tsx
export function SimpleCodeBlock({ code, highlightLines = [] }: { code: string; highlightLines?: number[] }) {
  const lines = code.split('\n');

  return (
    <div className="bg-background-200 border border-gray-400 rounded-lg p-6">
      <pre className="font-mono text-sm" style={{ fontFamily: "'Geist Mono', monospace" }}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={highlightLines.includes(i + 1) ? 'bg-blue-700/15 -mx-6 px-6' : ''}
          >
            <span className="text-gray-500 mr-4 inline-block w-6 text-right">{i + 1}</span>
            <span className="text-gray-100">{line}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
```

This won't have syntax highlighting but avoids the regex issues.
