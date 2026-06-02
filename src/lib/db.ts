export interface Confirmacao {
  id: number;
  nome: string;
  telefone: string;
  confirmadoEm: string;
}

const _db: Confirmacao[] = [
  { id: 1, nome: "Ana Rodrigues",   telefone: "923 456 789", confirmadoEm: "2026-06-01T09:15:00.000Z" },
  { id: 2, nome: "Carlos Mendes",   telefone: "912 345 678", confirmadoEm: "2026-06-01T10:30:00.000Z" },
  { id: 3, nome: "Filomena Costa",  telefone: "934 567 890", confirmadoEm: "2026-06-01T11:00:00.000Z" },
  { id: 4, nome: "João Baptista",   telefone: "945 678 901", confirmadoEm: "2026-06-01T13:20:00.000Z" },
  { id: 5, nome: "Mariana Santos",  telefone: "956 789 012", confirmadoEm: "2026-06-01T14:45:00.000Z" },
  { id: 6, nome: "Paulo Ferreira",  telefone: "967 890 123", confirmadoEm: "2026-06-01T15:30:00.000Z" },
  { id: 7, nome: "Rosa Neto",       telefone: "978 901 234", confirmadoEm: "2026-06-02T08:10:00.000Z" },
  { id: 8, nome: "António Silva",   telefone: "989 012 345", confirmadoEm: "2026-06-02T09:05:00.000Z" },
];

let _nextId = _db.length + 1;

export function getConfirmacoes(): Confirmacao[] {
  return [..._db];
}

export function addConfirmacao(nome: string, telefone: string): Confirmacao {
  const nova: Confirmacao = {
    id: _nextId++,
    nome: nome.trim(),
    telefone: telefone.trim(),
    confirmadoEm: new Date().toISOString(),
  };
  _db.push(nova);
  return nova;
}

export function findByTelefone(telefone: string): Confirmacao | undefined {
  const n = telefone.replace(/[\s\-+]/g, "");
  return _db.find((c) => c.telefone.replace(/[\s\-+]/g, "") === n);
}
