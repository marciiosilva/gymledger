import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renderiza conteúdo", () => {
    render(<Card>Conteúdo</Card>);
    expect(screen.getByText("Conteúdo")).toBeInTheDocument();
  });

  it("renderiza sub-componentes Header, Body e Footer", () => {
    render(
      <Card>
        <Card.Header>Cabeçalho</Card.Header>
        <Card.Body>Corpo</Card.Body>
        <Card.Footer>Rodapé</Card.Footer>
      </Card>
    );
    expect(screen.getByText("Cabeçalho")).toBeInTheDocument();
    expect(screen.getByText("Corpo")).toBeInTheDocument();
    expect(screen.getByText("Rodapé")).toBeInTheDocument();
  });

  it("aceita todas as variantes sem erro", () => {
    const variants = ["elevated", "flat", "tinted", "emerald", "blue", "amber", "slate", "dark"] as const;
    for (const variant of variants) {
      render(<Card variant={variant}>{variant}</Card>);
      expect(screen.getByText(variant)).toBeInTheDocument();
    }
  });

  it("aceita className adicional", () => {
    const { container } = render(<Card className="custom">OK</Card>);
    expect(container.firstElementChild).toHaveClass("custom");
  });
});
