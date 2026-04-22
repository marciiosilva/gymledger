import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SidebarNav } from "./SidebarNav";

const items = [
  { label: "Dashboard", active: true },
  { label: "Alunos" },
  { label: "Financeiro", badge: 5 },
];

describe("SidebarNav", () => {
  it("renderiza todos os itens", () => {
    render(<SidebarNav items={items} />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Alunos")).toBeInTheDocument();
    expect(screen.getByText("Financeiro")).toBeInTheDocument();
  });

  it("marca o item ativo com aria-current=page", () => {
    render(<SidebarNav items={items} />);
    const dashboard = screen.getByRole("button", { name: /Dashboard/ });
    expect(dashboard).toHaveAttribute("aria-current", "page");
  });

  it("itens inativos não têm aria-current", () => {
    render(<SidebarNav items={items} />);
    const alunos = screen.getByRole("button", { name: /Alunos/ });
    expect(alunos).not.toHaveAttribute("aria-current");
  });

  it("renderiza badge numérico", () => {
    render(<SidebarNav items={items} />);
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("chama onClick ao clicar em um item", async () => {
    const onClick = vi.fn();
    render(<SidebarNav items={[{ label: "Alunos", onClick }]} />);
    await userEvent.click(screen.getByRole("button", { name: /Alunos/ }));
    expect(onClick).toHaveBeenCalled();
  });
});
