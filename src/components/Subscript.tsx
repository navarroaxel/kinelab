import type { ReactNode } from "react";

// Turns "t_r" / "t_f" style tokens inside a plain string into real <sub>
// markup. Needed because Unicode's subscript-letter block is incomplete
// (no subscript f, b, c, d, g, …) — a template literal like "vₘₐₓ" only
// works when every letter involved happens to have a Unicode subscript form.
const SUBSCRIPT_TOKEN = /([^\s_]+)_([^\s_]+)/g;

export function withSubscripts(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  const re = new RegExp(SUBSCRIPT_TOKEN);
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <span key={key++}>
        {match[1]}
        <sub>{match[2]}</sub>
      </span>,
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}
