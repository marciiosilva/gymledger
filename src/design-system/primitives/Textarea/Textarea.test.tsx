import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renderiza textarea básico", () => {
    render(<Textarea placeholder="Descreva..." />);
    expect(screen.getByPlaceholderText("Descreva...")).toBeInTheDocument();
  });

  it("renderiza label quando informada", () => {
    render(<Textarea label="Observações" />);
    expect(screen.getByLabelText("Observações")).toBeInTheDocument();
  });

  it("renderiza mensagem de erro e aria-invalid", () => {
    render(<Textarea error="Campo obrigatório" />);
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("renderiza helperText quando não há erro", () => {
    render(<Textarea helperText="Máximo 500 caracteres" />);
    expect(screen.getByText("Máximo 500 caracteres")).toBeInTheDocument();
  });
});
