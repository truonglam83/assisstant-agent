"use client";

import { useMemo, useState, type ReactNode } from "react";
import { marked, type Tokens } from "marked";
import { useToast } from "@/components/ui/toast-provider";

/* ─── Code Block with Copy Button ─── */

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  function handleCopy() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast({ type: "success", message: "Đã sao chép đoạn code" });
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="my-3 overflow-hidden rounded-xl border border-[#2d333b] bg-[#1c2128] text-[#adbac7] shadow-sm">
      <div className="flex items-center justify-between border-b border-[#2d333b] bg-[#161b22] px-3.5 py-1.5 text-xs text-[#768390]">
        <span className="font-mono lowercase">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-[#adbac7] transition-colors hover:bg-[#2d333b] hover:text-white"
        >
          {copied ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-success-text">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-success-text">Đã chép</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 font-mono text-[13px] leading-relaxed text-[#f0f6fc]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─── Inline Tokens Renderer ─── */

function renderInlineTokens(tokens?: Tokens.Generic[]): ReactNode {
  if (!tokens || tokens.length === 0) return null;

  return tokens.map((t, idx) => {
    switch (t.type) {
      case "strong":
        return (
          <strong key={idx} className="font-semibold text-text">
            {renderInlineTokens(t.tokens)}
          </strong>
        );
      case "em":
        return <em key={idx} className="italic">{renderInlineTokens(t.tokens)}</em>;
      case "codespan":
        return (
          <code
            key={idx}
            className="rounded border border-border/60 bg-sidebar/80 px-1.5 py-0.5 font-mono text-[13px] font-medium text-text"
          >
            {t.text}
          </code>
        );
      case "link":
        return (
          <a
            key={idx}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-accent underline underline-offset-2 hover:text-accent-hover"
          >
            {renderInlineTokens(t.tokens) || t.text}
          </a>
        );
      case "del":
        return <del key={idx} className="line-through">{renderInlineTokens(t.tokens)}</del>;
      case "br":
        return <br key={idx} />;
      case "escape":
      case "text":
      default:
        if ("tokens" in t && Array.isArray((t as Tokens.Generic).tokens)) {
          return <span key={idx}>{renderInlineTokens((t as Tokens.Generic).tokens)}</span>;
        }
        return <span key={idx}>{"text" in t ? String((t as Tokens.Generic).text) : ""}</span>;
    }
  });
}

/* ─── Markdown Content Component ─── */

export function MarkdownContent({
  content,
  className = "",
}: {
  content: string;
  className?: string;
}) {
  const tokens = useMemo(() => {
    try {
      return marked.lexer(content);
    } catch {
      return [];
    }
  }, [content]);

  if (tokens.length === 0) {
    return <span className={`whitespace-pre-line ${className}`}>{content}</span>;
  }

  return (
    <div className={`space-y-2 text-[15px] leading-relaxed text-text ${className}`}>
      {tokens.map((token, idx) => {
        switch (token.type) {
          case "code":
            return (
              <CodeBlock
                key={idx}
                code={token.text}
                lang={token.lang}
              />
            );

          case "paragraph":
            return (
              <p key={idx} className="leading-relaxed">
                {token.tokens ? renderInlineTokens(token.tokens) : token.text}
              </p>
            );

          case "list":
            if (token.ordered) {
              return (
                <ol key={idx} className="my-1.5 list-decimal space-y-1 pl-5">
                  {(token.items as Tokens.ListItem[]).map((item: Tokens.ListItem, itemIdx: number) => (
                    <li key={itemIdx} className="leading-relaxed">
                      {item.tokens ? renderInlineTokens(item.tokens as Tokens.Generic[]) : item.text}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <ul key={idx} className="my-1.5 list-disc space-y-1 pl-5">
                {(token.items as Tokens.ListItem[]).map((item: Tokens.ListItem, itemIdx: number) => (
                  <li key={itemIdx} className="leading-relaxed">
                    {item.tokens ? renderInlineTokens(item.tokens as Tokens.Generic[]) : item.text}
                  </li>
                ))}
              </ul>
            );

          case "heading": {
            const headingContent = token.tokens ? renderInlineTokens(token.tokens as Tokens.Generic[]) : token.text;
            if (token.depth === 1) {
              return <h2 key={idx} className="mt-3 mb-1 font-serif text-lg font-semibold text-text">{headingContent}</h2>;
            }
            if (token.depth === 2) {
              return <h3 key={idx} className="mt-2.5 mb-1 font-serif text-base font-semibold text-text">{headingContent}</h3>;
            }
            return <h4 key={idx} className="mt-2 mb-0.5 text-[15px] font-semibold text-text">{headingContent}</h4>;
          }

          case "blockquote":
            return (
              <blockquote
                key={idx}
                className="my-2 border-l-2 border-accent/40 pl-3 italic text-text-muted"
              >
                {token.tokens ? (
                  <MarkdownContent content={token.raw.replace(/^>\s?/gm, "")} />
                ) : (
                  token.text
                )}
              </blockquote>
            );

          case "hr":
            return <hr key={idx} className="my-3 border-border" />;

          case "table":
            return (
              <div key={idx} className="my-2.5 overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-sidebar/50">
                    <tr>
                      {(token.header as Tokens.TableCell[]).map((cell: Tokens.TableCell, cIdx: number) => (
                        <th key={cIdx} className="px-3 py-2 font-semibold text-text">
                          {cell.tokens ? renderInlineTokens(cell.tokens as Tokens.Generic[]) : cell.text}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(token.rows as Tokens.TableCell[][]).map((row: Tokens.TableCell[], rIdx: number) => (
                      <tr key={rIdx}>
                        {row.map((cell: Tokens.TableCell, cellIdx: number) => (
                          <td key={cellIdx} className="px-3 py-2 text-text">
                            {cell.tokens ? renderInlineTokens(cell.tokens as Tokens.Generic[]) : cell.text}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "space":
            return null;

          default:
            return (
              <div key={idx} className="leading-relaxed">
                {"tokens" in token && Array.isArray((token as Tokens.Generic).tokens)
                  ? renderInlineTokens((token as Tokens.Generic).tokens)
                  : "text" in token
                    ? String((token as Tokens.Generic).text)
                    : token.raw}
              </div>
            );
        }
      })}
    </div>
  );
}
