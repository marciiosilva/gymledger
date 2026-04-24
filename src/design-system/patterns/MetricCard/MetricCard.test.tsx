import { describe, it, expect } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { MetricCard } from "./MetricCard";

describe("MetricCard", () => {
  it("renderiza título e valor", () => {
    render(<MetricCard title="MRR" value="R$ 48.200" />);
    expect(screen.getByText("MRR")).toBeInTheDocument();
    expect(screen.getByText("R$ 48.200")).toBeInTheDocument();
  });

  it("renderiza delta quando informado", () => {
    render(<MetricCard title="MRR" value="R$ 48.200" delta="+8.4% vs mês anterior" />);
    expect(screen.getByText("+8.4% vs mês anterior")).toBeInTheDocument();
  });

  it("renderiza ícone de tendência de alta", () => {
    render(<MetricCard title="MRR" value="R$ 48.200" delta="+8%" trend="up" />);
    expect(screen.getByText("+8%")).toBeInTheDocument();
  });

  it("renderiza ícone de tendência de baixa", () => {
    render(<MetricCard title="Inadimplência" value="12.8%" delta="-2.1 pts" trend="down" />);
    expect(screen.getByText("-2.1 pts")).toBeInTheDocument();
  });

  it("aceita todas as variantes sem erro", () => {
    const variants = ["emerald", "blue", "amber", "slate"] as const;
    for (const variant of variants) {
      const { container } = render(<MetricCard title={variant} value="100" variant={variant} />);
      expect(container.querySelector("strong")).toHaveTextContent("100");
      cleanup();
    }
  });
});
