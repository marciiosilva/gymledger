import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza a home interna do dono da academia", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /luis, seu studio esta operando com caixa previsivel e sem planilha/i
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /mensalidades vencidas que pedem acao imediata/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/R\$ 18\.720/i)).toBeInTheDocument();
    expect(screen.getByText(/rafael lima/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /importar extrato/i
      })
    ).toBeInTheDocument();
  });
});
