import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("exibe label padrão para cada status", () => {
    const cases = [
      { status: "paid" as const,     label: "Pago" },
      { status: "late" as const,     label: "Atrasado" },
      { status: "canceled" as const, label: "Cancelado" },
      { status: "pending" as const,  label: "Pendente" },
      { status: "active" as const,   label: "Ativo" },
      { status: "inactive" as const, label: "Inativo" },
    ];
    for (const { status, label } of cases) {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("aceita children customizado sobrescrevendo o label padrão", () => {
    render(<StatusBadge status="paid">Quitado</StatusBadge>);
    expect(screen.getByText("Quitado")).toBeInTheDocument();
  });

  it("aceita tamanho sm", () => {
    const { getByText } = render(<StatusBadge status="active" size="sm" />);
    expect(getByText("Ativo")).toBeInTheDocument();
  });
});
