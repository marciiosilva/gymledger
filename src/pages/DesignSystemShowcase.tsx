import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "../design-system/primitives/Button/Button";
import { Badge } from "../design-system/primitives/Badge/Badge";
import { StatusBadge } from "../design-system/primitives/StatusBadge/StatusBadge";
import { Card } from "../design-system/primitives/Card/Card";
import { Input } from "../design-system/primitives/Input/Input";
import { Textarea } from "../design-system/primitives/Textarea/Textarea";
import { Checkbox } from "../design-system/primitives/Checkbox/Checkbox";
import { Switch } from "../design-system/primitives/Switch/Switch";
import { Select } from "../design-system/primitives/Select/Select";
import { Tooltip } from "../design-system/primitives/Tooltip/Tooltip";
import { Dialog } from "../design-system/primitives/Dialog/Dialog";
import { Dropdown } from "../design-system/primitives/Dropdown/Dropdown";
import { Toast } from "../design-system/primitives/Toast/Toast";
import { Table } from "../design-system/primitives/Table/Table";
import { MetricCard } from "../design-system/patterns/MetricCard/MetricCard";
import { PaymentRow } from "../design-system/patterns/PaymentRow/PaymentRow";
import { SidebarNav } from "../design-system/patterns/SidebarNav/SidebarNav";
import { paymentRows, topMetrics } from "../data/homepageMock";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-body font-[700] text-[--text-xl] text-[--color-text-primary] border-b border-[--color-border] pb-3 m-0">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-body text-[--text-xs] font-[800] uppercase text-[--color-text-muted] m-0">
        {label}
      </p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function DesignSystemShowcase() {
  const [toastOpen, setToastOpen] = React.useState(false);

  const navItems = [
    { label: "Dashboard", active: true },
    { label: "Alunos", badge: 38 },
    { label: "Financeiro" },
    { label: "Planos" },
    { label: "Treinos" },
    { label: "Professores" },
    { label: "IA" },
    { label: "Relatórios" },
  ];

  const selectOptions = [
    { value: "mensal", label: "Mensal" },
    { value: "trimestral", label: "Trimestral" },
    { value: "anual", label: "Anual" },
  ];

  return (
    <div className="min-h-screen bg-[--color-bg] p-8">
      <div className="max-w-[1100px] mx-auto flex flex-col gap-16">
        {/* header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="font-body text-[--text-xs] font-[800] uppercase text-[--color-accent] m-0 mb-2">
              Ledger DS — Design System
            </p>
            <h1 className="font-body font-[700] text-[--text-3xl] text-[--color-text-primary] m-0 leading-tight">
              Componentes & Tokens
            </h1>
          </div>
          <Link to="/">
            <Button variant="secondary" size="sm">← Voltar para Home</Button>
          </Link>
        </div>

        {/* ── Tokens ── */}
        <Section title="Tokens — Cores">
          <div className="grid grid-cols-6 gap-3">
            {[
              { name: "accent",  bg: "bg-[#1eb64a]" },
              { name: "accent-hover", bg: "bg-[#1fae7f]" },
              { name: "navy-900", bg: "bg-[#061735]" },
              { name: "amber-600", bg: "bg-[#b86c18]" },
              { name: "danger",  bg: "bg-[#d94848]" },
              { name: "border", bg: "bg-[rgba(7,27,58,0.1)] border border-[--color-border]" },
            ].map((c) => (
              <div key={c.name} className="flex flex-col gap-1">
                <div className={`h-10 rounded-[--radius-md] ${c.bg}`} />
                <span className="font-body text-[--text-xs] text-[--color-text-muted]">{c.name}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Button ── */}
        <Section title="Button">
          <Row label="Variantes">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </Row>
          <Row label="Tamanhos">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="Estados">
            <Button disabled>Desabilitado</Button>
            <Button loading>Carregando...</Button>
          </Row>
          <Row label="asChild (link)">
            <Button asChild variant="secondary" size="sm">
              <a href="#">Como link</a>
            </Button>
          </Row>
        </Section>

        {/* ── Badge / StatusBadge ── */}
        <Section title="Badge & StatusBadge">
          <Row label="Badge — variantes">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </Row>
          <Row label="StatusBadge — estados do domínio">
            <StatusBadge status="paid" />
            <StatusBadge status="late" />
            <StatusBadge status="canceled" />
            <StatusBadge status="pending" />
            <StatusBadge status="active" />
            <StatusBadge status="inactive" />
          </Row>
        </Section>

        {/* ── Card ── */}
        <Section title="Card">
          <div className="grid grid-cols-3 gap-4">
            {(["elevated", "flat", "emerald", "blue", "amber", "dark"] as const).map((v) => (
              <Card key={v} variant={v}>
                <Card.Body>
                  <p className={`font-body text-[--text-sm] font-[700] m-0 ${v === "dark" ? "text-white" : "text-[--color-text-primary]"}`}>
                    Variante: {v}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Section>

        {/* ── MetricCard ── */}
        <Section title="MetricCard — Pattern">
          <div className="grid grid-cols-4 gap-4">
            {topMetrics.map((m) => (
              <MetricCard
                key={m.title}
                title={m.title}
                value={m.value}
                delta={m.delta}
                variant={m.tone as "emerald" | "blue" | "amber" | "slate"}
                trend={m.tone === "amber" ? "down" : "up"}
              />
            ))}
          </div>
        </Section>

        {/* ── Formulários ── */}
        <Section title="Formulários">
          <div className="grid grid-cols-2 gap-6 max-w-2xl">
            <Input label="Nome completo" placeholder="Ex: João Silva" />
            <Input label="E-mail" placeholder="joao@academia.com" type="email" />
            <Input label="Com erro" error="E-mail já cadastrado" defaultValue="invalido" />
            <Input label="Desabilitado" disabled defaultValue="Não editável" />
            <Select label="Plano" options={selectOptions} placeholder="Selecione..." />
            <div className="flex flex-col gap-4">
              <Checkbox label="Bloqueio automático por inadimplência" />
              <Switch label="Notificações de pagamento" />
            </div>
            <div className="col-span-2">
              <Textarea label="Observações" placeholder="Informações adicionais sobre o aluno..." helperText="Máximo 500 caracteres." />
            </div>
          </div>
        </Section>

        {/* ── Tooltip ── */}
        <Section title="Tooltip">
          <Row label="Posições">
            <Tooltip content="Dica em cima" side="top">
              <Button variant="secondary" size="sm">Hover (top)</Button>
            </Tooltip>
            <Tooltip content="Dica embaixo" side="bottom">
              <Button variant="secondary" size="sm">Hover (bottom)</Button>
            </Tooltip>
          </Row>
        </Section>

        {/* ── Dialog ── */}
        <Section title="Dialog">
          <Row label="Abrir modal">
            <Dialog>
              <Dialog.Trigger asChild>
                <Button variant="secondary">Abrir Dialog</Button>
              </Dialog.Trigger>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Confirmar exclusão</Dialog.Title>
                  <Dialog.Description>
                    Esta ação removerá o aluno permanentemente. Não pode ser desfeita.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button variant="ghost" size="sm">Cancelar</Button>
                  </Dialog.Close>
                  <Button variant="danger" size="sm">Excluir</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog>
          </Row>
        </Section>

        {/* ── Dropdown ── */}
        <Section title="Dropdown">
          <Row label="Menu de ações">
            <Dropdown>
              <Dropdown.Trigger asChild>
                <Button variant="secondary" size="sm">Ações ▾</Button>
              </Dropdown.Trigger>
              <Dropdown.Content>
                <Dropdown.Label>Pagamento</Dropdown.Label>
                <Dropdown.Item>Registrar pagamento</Dropdown.Item>
                <Dropdown.Item>Ver histórico</Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item destructive>Cancelar assinatura</Dropdown.Item>
              </Dropdown.Content>
            </Dropdown>
          </Row>
        </Section>

        {/* ── Toast ── */}
        <Section title="Toast">
          <Row label="Disparar notificação">
            <Toast.Provider>
              <Button variant="secondary" size="sm" onClick={() => setToastOpen(true)}>
                Mostrar Toast
              </Button>
              <Toast
                open={toastOpen}
                onOpenChange={setToastOpen}
                variant="success"
                title="Pagamento registrado"
                description="R$ 289 de Marina Costa foi confirmado."
              />
              <Toast.Viewport />
            </Toast.Provider>
          </Row>
        </Section>

        {/* ── Table ── */}
        <Section title="Table">
          <Card>
            <Table>
              <Table.Head>
                <Table.Row>
                  <Table.HeaderCell>Aluno</Table.HeaderCell>
                  <Table.HeaderCell>Plano</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                  <Table.HeaderCell>Valor</Table.HeaderCell>
                  <Table.HeaderCell>Data</Table.HeaderCell>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {paymentRows.map((row) => (
                  <Table.Row key={row.student}>
                    <Table.Cell className="font-[700]">{row.student}</Table.Cell>
                    <Table.Cell>{row.plan}</Table.Cell>
                    <Table.Cell>
                      <StatusBadge status={row.status === "Pago" ? "paid" : "late"} size="sm" />
                    </Table.Cell>
                    <Table.Cell className="font-[700]">{row.amount}</Table.Cell>
                    <Table.Cell>{row.date}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card>
          <Card className="mt-2">
            <Table>
              <Table.Body>
                <Table.Empty message="Nenhum pagamento encontrado neste período." />
              </Table.Body>
            </Table>
          </Card>
        </Section>

        {/* ── PaymentRow ── */}
        <Section title="PaymentRow — Pattern">
          <Card>
            <Card.Body className="flex flex-col gap-2 p-4">
              {paymentRows.map((row) => (
                <PaymentRow key={row.student} {...row} />
              ))}
            </Card.Body>
          </Card>
        </Section>

        {/* ── SidebarNav ── */}
        <Section title="SidebarNav — Pattern">
          <div className="w-64 bg-[--color-surface] border border-[--color-border] rounded-[--radius-md] p-4">
            <SidebarNav items={navItems} />
          </div>
        </Section>
      </div>
    </div>
  );
}
