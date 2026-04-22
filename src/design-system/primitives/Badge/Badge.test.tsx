import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renderiza texto", () => {
    render(<Badge>Ativo</Badge>);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

  it("aplica variante neutral por padrão", () => {
    render(<Badge>Neutro</Badge>);
    expect(screen.getByText("Neutro")).toBeInTheDocument();
  });

  it("aceita todas as variantes sem erro", () => {
    const variants = ["neutral", "success", "warning", "danger", "info"] as const;
    for (const variant of variants) {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeInTheDocument();
    }
  });

  it("aceita tamanhos sm e md", () => {
    render(<Badge size="sm">sm</Badge>);
    render(<Badge size="md">md</Badge>);
    expect(screen.getByText("sm")).toBeInTheDocument();
    expect(screen.getByText("md")).toBeInTheDocument();
  });

  it("aceita className adicional", () => {
    render(<Badge className="extra">Teste</Badge>);
    expect(screen.getByText("Teste")).toHaveClass("extra");
  });
});
