import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FinancePage } from "./FinancePage";

describe("FinancePage", () => {
  it("renderiza a tela financeira baseada no design system", () => {
    render(
      <MemoryRouter>
        <FinancePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /caixa previsivel com conciliacao e cobranca no centro/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Receita conciliada")).toBeInTheDocument();
    expect(screen.getByText(/pix marina costa/i)).toBeInTheDocument();
    expect(screen.getByText(/extrato nubank pj/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /novo lancamento/i
      })
    ).toBeInTheDocument();
  });
});
