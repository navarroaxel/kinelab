import { describe, expect, it } from "vitest";

import { translations } from "@/lib/i18n";

import {
  SIMULATORS,
  coreSimulators,
  findByHref,
  mvExercises,
  pdExercises,
  pkExercises,
} from "./simulators";

describe("SIMULATORS registry", () => {
  it("has unique ids", () => {
    const ids = SIMULATORS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique hrefs for every enabled entry", () => {
    const hrefs = SIMULATORS.filter((s) => !s.disabled).map((s) => s.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("uses absolute, group-consistent routes", () => {
    for (const s of SIMULATORS) {
      expect(s.href.startsWith("/")).toBe(true);
      if (s.disabled) {
        // Stubs park on their section index until the page exists.
        expect(["/particle-dynamics", "/mechanical-vibrations"]).toContain(
          s.href,
        );
      } else if (s.group !== "core") {
        expect(s.href.startsWith(`/${s.group}/`)).toBe(true);
      }
    }
  });

  it("resolves every translation key it references", () => {
    for (const s of SIMULATORS) {
      expect(translations.en[s.navKey]).toBeTruthy();
      expect(translations.es[s.navKey]).toBeTruthy();
      expect(translations.en[s.titleKey]).toBeTruthy();
      expect(translations.es[s.titleKey]).toBeTruthy();
      if (s.summaryKey) {
        expect(translations.en[s.summaryKey]).toBeTruthy();
        expect(translations.es[s.summaryKey]).toBeTruthy();
      }
    }
  });

  it("numbers exercises within their own group only", () => {
    for (const s of SIMULATORS) {
      if (s.group === "particle-kinematics") {
        expect(typeof s.pk).toBe("number");
        expect(s.pd).toBeUndefined();
      } else if (s.group === "particle-dynamics") {
        expect(typeof s.pd).toBe("number");
        expect(s.pk).toBeUndefined();
        expect(s.mv).toBeUndefined();
      } else if (s.group === "mechanical-vibrations") {
        expect(typeof s.mv).toBe("number");
        expect(s.pk).toBeUndefined();
        expect(s.pd).toBeUndefined();
      } else {
        expect(s.pk).toBeUndefined();
        expect(s.pd).toBeUndefined();
        expect(s.mv).toBeUndefined();
      }
    }
  });

  it("only marks particle-dynamics and mechanical-vibrations entries as disabled", () => {
    for (const s of SIMULATORS.filter((s) => s.disabled)) {
      expect(["particle-dynamics", "mechanical-vibrations"]).toContain(
        s.group,
      );
    }
    expect(coreSimulators().some((s) => s.disabled)).toBe(false);
    expect(pkExercises().some((s) => s.disabled)).toBe(false);
  });
});

describe("group selectors", () => {
  it("partition the registry", () => {
    expect(
      coreSimulators().length +
        pkExercises().length +
        pdExercises().length +
        mvExercises().length,
    ).toBe(SIMULATORS.length);
  });

  it("return only their own group", () => {
    expect(coreSimulators().every((s) => s.group === "core")).toBe(true);
    expect(pkExercises().every((s) => s.group === "particle-kinematics")).toBe(
      true,
    );
    expect(pdExercises().every((s) => s.group === "particle-dynamics")).toBe(
      true,
    );
    expect(
      mvExercises().every((s) => s.group === "mechanical-vibrations"),
    ).toBe(true);
  });

  it("orders exercises by their contiguous 1..n numbering", () => {
    expect(pkExercises().map((s) => s.pk)).toEqual(
      Array.from({ length: pkExercises().length }, (_, i) => i + 1),
    );
    expect(pdExercises().map((s) => s.pd)).toEqual(
      Array.from({ length: pdExercises().length }, (_, i) => i + 1),
    );
    expect(mvExercises().map((s) => s.mv)).toEqual(
      Array.from({ length: mvExercises().length }, (_, i) => i + 1),
    );
  });

  it("does not mutate SIMULATORS' order when sorting", () => {
    const before = SIMULATORS.map((s) => s.id);
    pkExercises();
    pdExercises();
    mvExercises();
    expect(SIMULATORS.map((s) => s.id)).toEqual(before);
  });
});

describe("findByHref", () => {
  it("finds core and section routes", () => {
    expect(findByHref("/polar")?.id).toBe("polar");
    expect(findByHref("/particle-dynamics/ring")?.id).toBe("ring");
    expect(findByHref("/mechanical-vibrations/vehicle-suspension")?.id).toBe(
      "vehicle-suspension",
    );
  });

  it("returns undefined for unknown routes", () => {
    expect(findByHref("/nope")).toBeUndefined();
    expect(findByHref("")).toBeUndefined();
  });
});
