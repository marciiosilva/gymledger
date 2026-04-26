import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { FinancePage } from "./FinancePage";

describe("FinancePage", () => {
  it("renderiza a tela financeira baseada no design system", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <FinancePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /caixa previsivel, decisao rapida/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Receita conciliada")).toBeInTheDocument();
    expect(screen.getByText(/pix marina costa/i)).toBeInTheDocument();
    expect(screen.getByText(/extrato nubank pj/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /novo lancamento/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /acoes rapidas/i }));

    expect(
      screen.getByRole("button", {
        name: /novo lancamento/i
      })
    ).toBeInTheDocument();
  });
});
