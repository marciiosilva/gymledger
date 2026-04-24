import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "./Dialog";

describe("Dialog", () => {
  it("abre o dialog ao clicar no trigger", async () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <button>Abrir</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Título do dialog</Dialog.Title>
          </Dialog.Header>
          <p>Conteúdo interno</p>
        </Dialog.Content>
      </Dialog>
    );

    expect(screen.queryByText("Título do dialog")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));
    expect(screen.getByText("Título do dialog")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo interno")).toBeInTheDocument();
  });

  it("fecha ao clicar no botão de fechar", async () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <button>Abrir</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Dialog aberto</Dialog.Title>
        </Dialog.Content>
      </Dialog>
    );

    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));
    expect(screen.getByText("Dialog aberto")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(screen.queryByText("Dialog aberto")).not.toBeInTheDocument();
  });

  it("renderiza footer com botões de ação", async () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <button>Abrir</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Confirmar</Dialog.Title>
          <Dialog.Footer>
            <button>Cancelar</button>
            <button>Confirmar</button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    );

    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
  });

  it("renderiza description quando informada", async () => {
    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <button>Abrir</button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Confirmar ação</Dialog.Title>
            <Dialog.Description>Esta ação não pode ser desfeita.</Dialog.Description>
          </Dialog.Header>
        </Dialog.Content>
      </Dialog>
    );

    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));
    expect(screen.getByText("Esta ação não pode ser desfeita.")).toBeInTheDocument();
  });
});
