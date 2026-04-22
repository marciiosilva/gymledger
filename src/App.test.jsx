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
        name: /boa tarde, luis. sua academia esta operando com previsibilidade/i
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /cobrancas recentes/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/R\$ 48\.200/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Marina Costa/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("button", {
        name: /gerar treino com ia/i
      })
    ).toBeInTheDocument();
  });
});
