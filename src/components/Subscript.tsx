import type { ReactNode } from "react";

// Turns "t_r" / "t_f" style tokens inside a plain string into real <sub>
// markup. Needed because Unicode's subscript-letter block is incomplete
// (no subscript f, b, c, d, g, …) — a template literal like "vₘₐₓ" only
// works when every letter involved happens to have a Unicode subscript form.
//
// The subscript itself (after the "_") is restricted to letters/digits, so
// it stops at the first piece of punctuation instead of swallowing it —
// "m_c·g" is "m" + sub("c") + "·g", not "m" + sub("c·g"); "δ_st)" is
// "δ" + sub("st") + ")", not "δ" + sub("st)").
const SUBSCRIPT_TOKEN = /([^\s_]+)_([A-Za-z0-9]+)/g;

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
