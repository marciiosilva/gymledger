import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("renderiza a home interna do dono da academia", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /caixa do studio sob controle/i
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: /mensalidades vencidas que pedem acao imediata/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/R\$ 18\.720/i)).toBeInTheDocument();
    expect(screen.getByText(/rafael lima/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /importar extrato/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /acoes rapidas/i }));

    expect(
      screen.getByRole("button", {
        name: /importar extrato/i
      })
    ).toBeInTheDocument();
  });
});
