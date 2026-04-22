import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renderiza input básico", () => {
    render(<Input placeholder="Digite algo" />);
    expect(screen.getByPlaceholderText("Digite algo")).toBeInTheDocument();
  });

  it("renderiza label quando informada", () => {
    render(<Input label="E-mail" />);
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("renderiza helperText", () => {
    render(<Input helperText="Insira seu e-mail corporativo" />);
    expect(screen.getByText("Insira seu e-mail corporativo")).toBeInTheDocument();
  });

  it("renderiza mensagem de erro e aria-invalid", () => {
    render(<Input error="Campo obrigatório" />);
    const input = screen.getByRole("textbox");
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("prioriza error sobre helperText", () => {
    render(<Input error="Erro" helperText="Ajuda" />);
    expect(screen.getByText("Erro")).toBeInTheDocument();
    expect(screen.queryByText("Ajuda")).not.toBeInTheDocument();
  });

  it("fica desabilitado", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renderiza ícone leading", () => {
    render(<Input leadingIcon={<span data-testid="icon-lead">$</span>} />);
    expect(screen.getByTestId("icon-lead")).toBeInTheDocument();
  });

  it("renderiza ícone trailing", () => {
    render(<Input trailingIcon={<span data-testid="icon-trail">@</span>} />);
    expect(screen.getByTestId("icon-trail")).toBeInTheDocument();
  });
});
