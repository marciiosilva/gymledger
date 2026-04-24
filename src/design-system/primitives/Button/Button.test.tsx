import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
  });

  it("aplica variante primary por padrão", () => {
    render(<Button>OK</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("fica desabilitado quando disabled=true", () => {
    render(<Button disabled>OK</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("fica desabilitado quando loading=true", () => {
    render(<Button loading>Salvando</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("chama onClick ao clicar", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("não chama onClick quando desabilitado", async () => {
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>Clique</Button>);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renderiza como filho com asChild", () => {
    render(
      <Button asChild>
        <a href="/teste">Link</a>
      </Button>
    );
    expect(screen.getByRole("link", { name: "Link" })).toBeInTheDocument();
  });

  it("aceita className adicional", () => {
    render(<Button className="custom-class">OK</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});
