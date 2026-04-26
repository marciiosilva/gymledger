// @vitest-environment node
import { describe, expect, it } from "vitest";
import { appRoutes, mainNavItems } from "./routes";

describe("app routes", () => {
  it("declares every MVP route from the roadmap", () => {
    expect(appRoutes.map((route) => route.path)).toEqual(
      expect.arrayContaining([
        "/",
        "/alunos",
        "/alunos/:id",
        "/financeiro",
        "/planos",
        "/treinos",
        "/treinos/:id",
        "/exercicios",
        "/importacoes",
      ])
    );
  });

  it("shows primary modules in the sidebar navigation", () => {
    expect(mainNavItems.map((item) => item.path)).toEqual([
      "/",
      "/alunos",
      "/financeiro",
      "/planos",
      "/treinos",
      "/exercicios",
      "/importacoes",
    ]);

    expect(mainNavItems.map((item) => item.label)).toEqual([
      "Inicio",
      "Alunos",
      "Financeiro",
      "Planos",
      "Treinos",
      "Exercicios",
      "Importacoes",
    ]);
  });
});
