import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renderiza checkbox", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renderiza label quando informada", () => {
    render(<Checkbox label="Aceito os termos" />);
    expect(screen.getByText("Aceito os termos")).toBeInTheDocument();
  });

  it("chama onCheckedChange ao clicar", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Opção" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("fica desabilitado", () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });
});
