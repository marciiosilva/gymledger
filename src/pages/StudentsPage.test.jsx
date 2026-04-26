import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { StudentsPage } from "./StudentsPage";

describe("StudentsPage", () => {
  it("renderiza a pagina de alunos baseada no design system", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <StudentsPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /alunos, caixa e retencao juntos/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Alunos ativos")).toBeInTheDocument();
    expect(screen.getByText(/marina costa/i)).toBeInTheDocument();
    expect(screen.getByText(/rafael lima/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /novo aluno/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /acoes rapidas/i }));

    expect(
      screen.getByRole("button", {
        name: /novo aluno/i
      })
    ).toBeInTheDocument();
  });
});
