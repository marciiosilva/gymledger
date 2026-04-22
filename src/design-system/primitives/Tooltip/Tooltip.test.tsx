import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
  it("renderiza o trigger", { timeout: 15000 }, () => {
    render(
      <Tooltip content="Texto de ajuda">
        <button>Hover aqui</button>
      </Tooltip>
    );
    expect(screen.getByRole("button", { name: "Hover aqui" })).toBeInTheDocument();
  });
});
