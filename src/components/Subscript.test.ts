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

  it("is greedy: a token glued to trailing punctuation swallows it into the subscript", () => {
    // Documents a real gotcha: withSubscripts() grabs everything up to the
    // next whitespace, so "δ_st)" without a separating space renders the
    // closing paren *inside* the <sub>, not after it. Callers must isolate
    // each token with its own withSubscripts() call when punctuation touches
    // it directly (see VehicleSuspensionEquations.tsx).
    const nodes = withSubscripts("δ_st) = 0") as ReactNode[];
    const [span] = nodes;
    const [, sub] = childrenOf(span);
    expect((asElement(sub).props as { children: ReactNode }).children).toBe(
      "st)",
    );
  });
});
