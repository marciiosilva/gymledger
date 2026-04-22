import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table } from "./Table";

describe("Table", () => {
  it("renderiza tabela com cabeçalho e dados", () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeaderCell>Aluno</Table.HeaderCell>
            <Table.HeaderCell>Plano</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>João Silva</Table.Cell>
            <Table.Cell>Mensal</Table.Cell>
            <Table.Cell>Ativo</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByText("Aluno")).toBeInTheDocument();
    expect(screen.getByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

  it("renderiza estado vazio com mensagem padrão", () => {
    render(
      <Table>
        <Table.Body>
          <Table.Empty />
        </Table.Body>
      </Table>
    );
    expect(screen.getByText("Nenhum registro encontrado.")).toBeInTheDocument();
  });

  it("renderiza estado vazio com mensagem customizada", () => {
    render(
      <Table>
        <Table.Body>
          <Table.Empty message="Nenhum pagamento neste período." />
        </Table.Body>
      </Table>
    );
    expect(screen.getByText("Nenhum pagamento neste período.")).toBeInTheDocument();
  });

  it("aceita densidade compact", () => {
    render(
      <Table density="compact">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Dado</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );
    expect(screen.getByText("Dado")).toBeInTheDocument();
  });

  it("renderiza múltiplas linhas", () => {
    const alunos = ["Ana", "Bruno", "Carlos"];
    render(
      <Table>
        <Table.Body>
          {alunos.map((nome) => (
            <Table.Row key={nome}>
              <Table.Cell>{nome}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
    alunos.forEach((nome) => expect(screen.getByText(nome)).toBeInTheDocument());
  });
});
