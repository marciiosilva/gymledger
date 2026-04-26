import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "./test/renderWithProviders";
import App from "./App";

describe("App", () => {
  it("renderiza a home interna do dono da academia", async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    expect(
      screen.getByRole("heading", {
        name: /vis.o financeira/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/R\$ 18\.720/i)).toBeInTheDocument();
    expect(screen.getByText(/rafael lima/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /importar extrato/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /a..es r.pidas/i }));

    expect(
      screen.getByRole("button", {
        name: /importar extrato/i,
      })
    ).toBeInTheDocument();
  });
});
