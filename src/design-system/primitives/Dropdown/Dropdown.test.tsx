import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dropdown } from "./Dropdown";

describe("Dropdown", () => {
  it("abre o menu ao clicar no trigger", async () => {
    render(
      <Dropdown>
        <Dropdown.Trigger asChild>
          <button>Opções</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item>Editar</Dropdown.Item>
          <Dropdown.Item>Excluir</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );

    expect(screen.queryByText("Editar")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Opções" }));
    expect(screen.getByText("Editar")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });

  it("chama onSelect ao clicar em um item", async () => {
    const onSelect = vi.fn();
    render(
      <Dropdown>
        <Dropdown.Trigger asChild>
          <button>Menu</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Confirmar</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    await userEvent.click(screen.getByText("Confirmar"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("renderiza label e separador", async () => {
    render(
      <Dropdown>
        <Dropdown.Trigger asChild>
          <button>Menu</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Label>Ações</Dropdown.Label>
          <Dropdown.Item>Editar</Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item destructive>Excluir</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByText("Ações")).toBeInTheDocument();
    expect(screen.getByText("Excluir")).toBeInTheDocument();
  });

  it("renderiza CheckboxItem", async () => {
    render(
      <Dropdown>
        <Dropdown.Trigger asChild>
          <button>Menu</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.CheckboxItem checked>Ativo</Dropdown.CheckboxItem>
        </Dropdown.Content>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

  it("renderiza RadioGroup e RadioItem", async () => {
    render(
      <Dropdown>
        <Dropdown.Trigger asChild>
          <button>Menu</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.RadioGroup value="a">
            <Dropdown.RadioItem value="a">Opção A</Dropdown.RadioItem>
            <Dropdown.RadioItem value="b">Opção B</Dropdown.RadioItem>
          </Dropdown.RadioGroup>
        </Dropdown.Content>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByText("Opção A")).toBeInTheDocument();
    expect(screen.getByText("Opção B")).toBeInTheDocument();
  });

  it("renderiza Sub com SubTrigger e SubContent", async () => {
    render(
      <Dropdown>
        <Dropdown.Trigger asChild>
          <button>Menu</button>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Mais opções</Dropdown.SubTrigger>
            <Dropdown.SubContent>
              <Dropdown.Item>Sub item</Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Content>
      </Dropdown>
    );

    await userEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByText("Mais opções")).toBeInTheDocument();
  });
});
