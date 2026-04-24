import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Select } from "./Select";

const options = [
  { value: "mensal", label: "Mensal" },
  { value: "trimestral", label: "Trimestral" },
  { value: "anual", label: "Anual" },
];

describe("Select", () => {
  it("renderiza o trigger com placeholder padrão", () => {
    render(<Select options={options} />);
    expect(screen.getByText("Selecione...")).toBeInTheDocument();
  });

  it("renderiza placeholder customizado", () => {
    render(<Select options={options} placeholder="Escolha o plano" />);
    expect(screen.getByText("Escolha o plano")).toBeInTheDocument();
  });

  it("renderiza label quando informada", () => {
    render(<Select options={options} label="Tipo de plano" />);
    expect(screen.getByText("Tipo de plano")).toBeInTheDocument();
  });

  it("renderiza mensagem de erro", () => {
    render(<Select options={options} error="Campo obrigatório" />);
    expect(screen.getByText("Campo obrigatório")).toBeInTheDocument();
  });

  it("renderiza helperText quando não há erro", () => {
    render(<Select options={options} helperText="Selecione a frequência de cobrança" />);
    expect(screen.getByText("Selecione a frequência de cobrança")).toBeInTheDocument();
  });
});
