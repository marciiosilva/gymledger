import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/renderWithProviders";
import { FinancePage } from "./FinancePage";

describe("FinancePage", () => {
  it("renderiza a tela financeira baseada no design system", async () => {
    const user = userEvent.setup();

    renderWithProviders(<FinancePage />);

    expect(
      screen.getByRole("heading", {
        name: /caixa previsível para decidir rápido/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Receita conciliada")).toBeInTheDocument();
    expect(screen.getByText(/pix marina costa/i)).toBeInTheDocument();
    expect(screen.getByText(/extrato nubank pj/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /novo lançamento/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ações rápidas/i }));

    expect(
      screen.getByRole("button", {
        name: /novo lançamento/i
      })
    ).toBeInTheDocument();
  });
});
