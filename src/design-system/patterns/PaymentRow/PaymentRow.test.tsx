import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaymentRow } from "./PaymentRow";

const base = {
  student: "Marina Costa",
  plan: "Performance 12x",
  status: "Pago",
  amount: "R$ 289",
  date: "Hoje, 09:14",
};

describe("PaymentRow", () => {
  it("renderiza os dados do pagamento", () => {
    render(<PaymentRow {...base} />);
    expect(screen.getByText("Marina Costa")).toBeInTheDocument();
    expect(screen.getByText("Performance 12x")).toBeInTheDocument();
    expect(screen.getByText("R$ 289")).toBeInTheDocument();
    expect(screen.getByText("Hoje, 09:14")).toBeInTheDocument();
  });

  it("exibe StatusBadge 'Pago' para status Pago", () => {
    render(<PaymentRow {...base} status="Pago" />);
    expect(screen.getByText("Pago")).toBeInTheDocument();
  });

  it("exibe StatusBadge 'Atrasado' para status Atrasado", () => {
    render(<PaymentRow {...base} status="Atrasado" />);
    expect(screen.getByText("Atrasado")).toBeInTheDocument();
  });

  it("chama onClick ao clicar na linha", async () => {
    const onClick = vi.fn();
    render(<PaymentRow {...base} onClick={onClick} />);
    await userEvent.click(screen.getByRole("row"));
    expect(onClick).toHaveBeenCalled();
  });
});
