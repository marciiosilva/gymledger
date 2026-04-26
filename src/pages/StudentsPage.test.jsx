import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/renderWithProviders";
import { StudentsPage } from "./StudentsPage";

describe("StudentsPage", () => {
  it("renderiza a pagina de alunos baseada no design system", async () => {
    const user = userEvent.setup();

    renderWithProviders(<StudentsPage />);

    expect(
      screen.getByRole("heading", {
        name: /alunos, caixa e retenção no mesmo fluxo/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Alunos ativos")).toBeInTheDocument();
    expect(screen.getByText(/marina costa/i)).toBeInTheDocument();
    expect(screen.getByText(/rafael lima/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /novo aluno/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /ações rápidas/i }));

    expect(
      screen.getByRole("button", {
        name: /novo aluno/i
      })
    ).toBeInTheDocument();
  });
});
