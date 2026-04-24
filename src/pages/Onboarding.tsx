import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../design-system/primitives/Button/Button';
import { Card } from '../design-system/primitives/Card/Card';
import { Input } from '../design-system/primitives/Input/Input';
import { Select } from '../design-system/primitives/Select/Select';
import { api, setAuthToken } from '../lib/api';

type Step = 'account' | 'plan' | 'student';

interface AccountData {
  gymName: string;
  name: string;
  email: string;
  password: string;
}

interface PlanData {
  name: string;
  value: string;
  periodicity: string;
  dueDayOfMonth: string;
  paymentMethod: string;
}

interface StudentData {
  name: string;
  whatsapp: string;
  email: string;
  startDate: string;
}

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState<Step>('account');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [planId, setPlanId] = React.useState('');

  const [account, setAccount] = React.useState<AccountData>({
    gymName: '', name: '', email: '', password: '',
  });
  const [plan, setPlan] = React.useState<PlanData>({
    name: '', value: '', periodicity: 'MONTHLY', dueDayOfMonth: '10', paymentMethod: 'PIX',
  });
  const [student, setStudent] = React.useState<StudentData>({
    name: '', whatsapp: '', email: '', startDate: new Date().toISOString().split('T')[0],
  });

  const steps: { key: Step; label: string; number: number }[] = [
    { key: 'account', label: 'Sua conta', number: 1 },
    { key: 'plan', label: 'Primeiro plano', number: 2 },
    { key: 'student', label: 'Primeiro aluno', number: 3 },
  ];

  async function handleAccount(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post<{ accessToken: string }>('auth/register', account);
      setAuthToken(res.accessToken);
      setStep('plan');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePlan(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post<{ id: string }>('plans', {
        ...plan,
        value: parseFloat(plan.value),
        dueDayOfMonth: parseInt(plan.dueDayOfMonth),
      });
      setPlanId(res.id);
      setStep('student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleStudent(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('students', { ...student, planId });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col items-center justify-center p-6">
      {/* Brand */}
      <div className="mb-8 text-center">
        <p className="font-display font-[700] text-[var(--text-xl)] text-[var(--color-text-primary)]">
          GymLedger
        </p>
        <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
          Controle financeiro. Performance real.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-3 mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            <div className="flex items-center gap-2">
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-xs)] font-[700]',
                  step === s.key
                    ? 'bg-[var(--color-accent)] text-white'
                    : steps.findIndex(x => x.key === step) > i
                    ? 'bg-[var(--color-accent)] text-white opacity-60'
                    : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]',
                ].join(' ')}
              >
                {s.number}
              </div>
              <span
                className={[
                  'text-[var(--text-sm)] font-[600] hidden sm:block',
                  step === s.key ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-muted)]',
                ].join(' ')}
              >
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="w-8 h-px bg-[var(--color-border)]" />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card className="w-full max-w-md">
        <Card.Body>
          {/* Step 1 — Conta */}
          {step === 'account' && (
            <form onSubmit={handleAccount} className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="font-display font-[700] text-[var(--text-lg)] text-[var(--color-text-primary)]">
                  Crie sua conta
                </h2>
                <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-1">
                  Comece em menos de 5 minutos, sem cartão de crédito.
                </p>
              </div>
              <Input
                label="Nome da academia"
                placeholder="Ex: Nova Era Fitness"
                value={account.gymName}
                onChange={e => setAccount(a => ({ ...a, gymName: e.target.value }))}
                required
              />
              <Input
                label="Seu nome"
                placeholder="Ex: Luis Ferreira"
                value={account.name}
                onChange={e => setAccount(a => ({ ...a, name: e.target.value }))}
                required
              />
              <Input
                label="E-mail"
                type="email"
                placeholder="seuemail@academia.com"
                value={account.email}
                onChange={e => setAccount(a => ({ ...a, email: e.target.value }))}
                required
              />
              <Input
                label="Senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={account.password}
                onChange={e => setAccount(a => ({ ...a, password: e.target.value }))}
                required
                error={error}
              />
              <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2">
                Criar conta e continuar →
              </Button>
            </form>
          )}

          {/* Step 2 — Plano */}
          {step === 'plan' && (
            <form onSubmit={handlePlan} className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="font-display font-[700] text-[var(--text-lg)] text-[var(--color-text-primary)]">
                  Crie seu primeiro plano
                </h2>
                <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-1">
                  Você pode criar quantos planos quiser depois.
                </p>
              </div>
              <Input
                label="Nome do plano"
                placeholder="Ex: Mensal Básico"
                value={plan.name}
                onChange={e => setPlan(p => ({ ...p, name: e.target.value }))}
                required
              />
              <Input
                label="Valor (R$)"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ex: 120,00"
                value={plan.value}
                onChange={e => setPlan(p => ({ ...p, value: e.target.value }))}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Periodicidade"
                  value={plan.periodicity}
                  onValueChange={v => setPlan(p => ({ ...p, periodicity: v }))}
                  options={[
                    { value: 'MONTHLY', label: 'Mensal' },
                    { value: 'QUARTERLY', label: 'Trimestral' },
                    { value: 'SEMIANNUAL', label: 'Semestral' },
                    { value: 'ANNUAL', label: 'Anual' },
                  ]}
                />
                <Input
                  label="Dia de vencimento"
                  type="number"
                  min="1"
                  max="28"
                  placeholder="10"
                  value={plan.dueDayOfMonth}
                  onChange={e => setPlan(p => ({ ...p, dueDayOfMonth: e.target.value }))}
                  required
                />
              </div>
              <Select
                label="Forma de cobrança principal"
                value={plan.paymentMethod}
                onValueChange={v => setPlan(p => ({ ...p, paymentMethod: v }))}
                options={[
                  { value: 'PIX', label: 'PIX' },
                  { value: 'CARD_MACHINE', label: 'Maquininha' },
                  { value: 'CASH', label: 'Dinheiro' },
                  { value: 'EXTERNAL_LINK', label: 'Link externo' },
                  { value: 'OTHER', label: 'Outro' },
                ]}
              />
              {error && <p className="text-[var(--color-danger)] text-[var(--text-sm)]">{error}</p>}
              <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2">
                Salvar plano e continuar →
              </Button>
            </form>
          )}

          {/* Step 3 — Aluno */}
          {step === 'student' && (
            <form onSubmit={handleStudent} className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="font-display font-[700] text-[var(--text-lg)] text-[var(--color-text-primary)]">
                  Cadastre seu primeiro aluno
                </h2>
                <p className="text-[var(--text-sm)] text-[var(--color-text-muted)] mt-1">
                  As mensalidades serão geradas automaticamente.
                </p>
              </div>
              <Input
                label="Nome do aluno"
                placeholder="Ex: Marina Costa"
                value={student.name}
                onChange={e => setStudent(s => ({ ...s, name: e.target.value }))}
                required
              />
              <Input
                label="WhatsApp"
                placeholder="Ex: 11999999999"
                value={student.whatsapp}
                onChange={e => setStudent(s => ({ ...s, whatsapp: e.target.value }))}
              />
              <Input
                label="E-mail (opcional)"
                type="email"
                placeholder="aluno@email.com"
                value={student.email}
                onChange={e => setStudent(s => ({ ...s, email: e.target.value }))}
              />
              <Input
                label="Data de início"
                type="date"
                value={student.startDate}
                onChange={e => setStudent(s => ({ ...s, startDate: e.target.value }))}
                required
              />
              {error && <p className="text-[var(--color-danger)] text-[var(--text-sm)]">{error}</p>}
              <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-2">
                Cadastrar e ir ao dashboard →
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-center"
              >
                Pular por agora
              </Button>
            </form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
