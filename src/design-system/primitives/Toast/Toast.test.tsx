import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toast } from "./Toast";

function TestToast(props: React.ComponentProps<typeof Toast>) {
  return (
    <Toast.Provider>
      <Toast open {...props} />
      <Toast.Viewport />
    </Toast.Provider>
  );
}

describe("Toast", () => {
  it("renderiza título e descrição", { timeout: 15000 }, () => {
    render(<TestToast title="Salvo!" description="Aluno cadastrado com sucesso." />);
    expect(screen.getByText("Salvo!")).toBeInTheDocument();
    expect(screen.getByText("Aluno cadastrado com sucesso.")).toBeInTheDocument();
  });

  it("renderiza toast de sucesso", () => {
    render(<TestToast variant="success" title="Pagamento registrado" />);
    expect(screen.getByText("Pagamento registrado")).toBeInTheDocument();
  });

  it("renderiza toast de erro", () => {
    render(<TestToast variant="danger" title="Falha na operação" description="Tente novamente." />);
    expect(screen.getByText("Falha na operação")).toBeInTheDocument();
    expect(screen.getByText("Tente novamente.")).toBeInTheDocument();
  });

  it("renderiza toast de aviso", () => {
    render(<TestToast variant="warning" title="Aluno inadimplente" />);
    expect(screen.getByText("Aluno inadimplente")).toBeInTheDocument();
  });
});
