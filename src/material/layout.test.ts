import { describe, expect, it } from "vitest";
import { dashboardKpiGridSx, dashboardMainSplitSx, dashboardSubGridSx } from "./layout";

describe("responsive dashboard layout", () => {
  it("collapses major dashboard grids to one column on mobile", () => {
    expect(dashboardKpiGridSx.gridTemplateColumns).toMatchObject({ xs: "1fr" });
    expect(dashboardMainSplitSx.gridTemplateColumns).toMatchObject({ xs: "1fr" });
    expect(dashboardSubGridSx.gridTemplateColumns).toMatchObject({ xs: "1fr" });
  });

  it("keeps desktop split layouts constrained", () => {
    expect(dashboardMainSplitSx.gridTemplateColumns).toMatchObject({
      lg: "minmax(0, 2.25fr) minmax(300px, 1fr)",
      xl: "minmax(0, 2.4fr) minmax(320px, 1fr)",
    });
  });
});
