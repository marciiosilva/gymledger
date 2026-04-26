import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/renderWithProviders";
import { isMainNavItemActive } from "./MaterialShell";
import { MaterialShell } from "./MaterialShell";

describe("MaterialShell navigation", () => {
  it("keeps root navigation exact", () => {
    expect(isMainNavItemActive("/", "/")).toBe(true);
    expect(isMainNavItemActive("/alunos", "/")).toBe(false);
  });

  it("keeps parent modules active on detail routes", () => {
    expect(isMainNavItemActive("/alunos/student_rafael_lima", "/alunos")).toBe(true);
    expect(isMainNavItemActive("/treinos/workout_full_body", "/treinos")).toBe(true);
    expect(isMainNavItemActive("/importacoes", "/importacoes")).toBe(true);
    expect(isMainNavItemActive("/financeiro", "/alunos")).toBe(false);
  });

  it("renders MVP navigation and mobile topbar controls", () => {
    renderWithProviders(
      <MaterialShell
        eyebrow="Teste"
        title="Pagina responsiva"
        description="Descricao curta."
        asideDescription="Resumo lateral."
      >
        <div>Conteudo</div>
      </MaterialShell>,
      { route: "/alunos/student_rafael_lima" }
    );

    expect(screen.getByRole("button", { name: "Abrir menu lateral" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Alunos/i })).toHaveAttribute("href", "/alunos");
    expect(screen.getByRole("link", { name: /Financeiro/i })).toHaveAttribute("href", "/financeiro");
    expect(screen.getByRole("link", { name: /Planos/i })).toHaveAttribute("href", "/planos");
    expect(screen.getByRole("link", { name: /Treinos/i })).toHaveAttribute("href", "/treinos");
    expect(screen.getByRole("link", { name: /Exercicios/i })).toHaveAttribute("href", "/exercicios");
    expect(screen.getByRole("link", { name: /Importacoes/i })).toHaveAttribute("href", "/importacoes");
  });
});
