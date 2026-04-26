import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../test/renderWithProviders";
import { PageFilterPanel, PageSectionHeader, PageState } from "./PagePattern";

describe("PagePattern", () => {
  it("renders a standard section header", () => {
    renderWithProviders(
      <PageSectionHeader
        eyebrow="Cadastro"
        title="Titulo padrao da pagina"
        action={<button type="button">Acao</button>}
      />
    );

    expect(screen.getByText("Cadastro")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Titulo padrao da pagina" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Acao" })).toBeInTheDocument();
  });

  it("renders the shared filter panel controls", async () => {
    const user = userEvent.setup();

    function Example() {
      const [open, setOpen] = React.useState(false);
      return (
        <PageFilterPanel open={open} onToggle={() => setOpen((value) => !value)}>
          <label htmlFor="search">Busca</label>
          <input id="search" />
        </PageFilterPanel>
      );
    }

    renderWithProviders(<Example />);

    expect(screen.queryByLabelText("Busca")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /expandir filtros/i }));

    expect(screen.getByLabelText("Busca")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /minimizar filtros/i })).toBeInTheDocument();
  });

  it("renders the standardized page states", () => {
    const { rerender } = renderWithProviders(<PageState variant="loading" />);

    expect(screen.getByRole("status")).toHaveTextContent("Carregando dados");

    rerender(<PageState variant="empty" />);
    expect(screen.getByRole("status")).toHaveTextContent("Nenhum registro ainda");

    rerender(<PageState variant="no-results" />);
    expect(screen.getByRole("status")).toHaveTextContent("Nenhum resultado encontrado");

    rerender(<PageState variant="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("Nao foi possivel carregar");
  });

  it("accepts custom state copy and action", () => {
    renderWithProviders(
      <PageState
        variant="empty"
        title="Sem planos cadastrados"
        description="Crie um plano para liberar o cadastro de alunos."
        action={<button type="button">Criar plano</button>}
      />
    );

    expect(screen.getByRole("status")).toHaveTextContent("Sem planos cadastrados");
    expect(screen.getByText("Crie um plano para liberar o cadastro de alunos.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Criar plano" })).toBeInTheDocument();
  });
});
