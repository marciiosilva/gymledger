import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { StudentsPage } from "./StudentsPage";

describe("StudentsPage", () => {
  it("renderiza a pagina de alunos baseada no design system", () => {
    render(
      <MemoryRouter>
        <StudentsPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: /base de alunos com financeiro e retencao no mesmo lugar/i
      })
    ).toBeInTheDocument();

    expect(screen.getByText("Alunos ativos")).toBeInTheDocument();
    expect(screen.getByText(/marina costa/i)).toBeInTheDocument();
    expect(screen.getByText(/rafael lima/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /novo aluno/i
      })
    ).toBeInTheDocument();
  });
});
