import { describe, expect, it } from "vitest";
import { withSubscripts } from "./Subscript";
import { isValidElement, type ReactElement, type ReactNode } from "react";

function asElement(node: ReactNode): ReactElement {
  if (!isValidElement(node)) throw new Error("expected a React element");
  return node;
}

function childrenOf(node: ReactNode): ReactNode[] {
  const el = asElement(node);
  const children = (el.props as { children?: ReactNode }).children;
  return Array.isArray(children) ? children : [children];
}

describe("withSubscripts", () => {
  it("returns plain text unchanged when there is no token", () => {
    expect(withSubscripts("no subscripts here")).toEqual([
      "no subscripts here",
    ]);
  });

  it("turns a single v_0-style token into a <span><sub> pair", () => {
    const nodes = withSubscripts("v_0") as ReactNode[];
    expect(nodes).toHaveLength(1);

    const span = asElement(nodes[0]);
    expect(span.type).toBe("span");

    const [base, sub] = childrenOf(nodes[0]);
    expect(base).toBe("v");
    const subEl = asElement(sub);
    expect(subEl.type).toBe("sub");
    expect((subEl.props as { children: ReactNode }).children).toBe("0");
  });

  it("preserves surrounding plain text around a token", () => {
    const nodes = withSubscripts("speed v_0 at launch") as ReactNode[];
    expect(nodes).toEqual([
      "speed ",
      expect.anything(), // the <span>v<sub>0</sub></span> element
      " at launch",
    ]);
    expect(isValidElement(nodes[1])).toBe(true);
  });

  it("renders every token when a string has several", () => {
    const nodes = withSubscripts("k_eq = n_s · c") as ReactNode[];
    // "k_eq", " = ", "n_s", " · c"
    expect(nodes).toHaveLength(4);

    const [first, , third] = nodes;
    expect(childrenOf(first)).toEqual(["k", expect.anything()]);
    expect(childrenOf(third)).toEqual(["n", expect.anything()]);
  });

  it("stops the subscript at trailing punctuation instead of swallowing it", () => {
    // Regression test: a token glued to punctuation with no separating
    // space — "δ_st)", "m_c·g", "X_0/Y_0" — must not pull that punctuation
    // (or the next word) into the <sub>. The subscript is letters/digits
    // only, so it stops at the first non-alphanumeric character.
    const nodes = withSubscripts("δ_st) = 0") as ReactNode[];
    expect(nodes).toHaveLength(2);

    const [span, rest] = nodes;
    const [, sub] = childrenOf(span);
    expect((asElement(sub).props as { children: ReactNode }).children).toBe(
      "st",
    );
    expect(rest).toBe(") = 0");
  });

  it("does not pull an adjacent word into the subscript", () => {
    // "Y_0·sin(ωt)" must render as Y₀ followed by plain "·sin(ωt)", not as
    // Y with "0·sin(ωt)" as its subscript.
    const nodes = withSubscripts("Y_0·sin(ωt)") as ReactNode[];
    expect(nodes).toHaveLength(2);

    const [span, rest] = nodes;
    const [, sub] = childrenOf(span);
    expect((asElement(sub).props as { children: ReactNode }).children).toBe(
      "0",
    );
    expect(rest).toBe("·sin(ωt)");
  });
});
