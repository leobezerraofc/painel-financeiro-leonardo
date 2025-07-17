import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function FinanceDashboard() {
  const [faturas, setFaturas] = useState([]);
  const [gasto, setGasto] = useState({ categoria: '', valor: 0, descricao: '' });
  const [gastos, setGastos] = useState([]);
  const [metaReserva, setMetaReserva] = useState(5000);

  function handleAddGasto() {
    if (gasto.valor && !isNaN(gasto.valor)) {
      setGastos([...gastos, gasto]);
      setGasto({ categoria: '', valor: 0, descricao: '' });
    } else {
      alert('Por favor, insira um valor válido.');
    }
  }

  function handleFaturaUpload(event) {
    const file = event.target.files[0];
    if (file) setFaturas([...faturas, file.name]);
  }

  const categorias = ['Alimentação', 'Transporte', 'Moradia', 'Lazer', 'Educação', 'Saúde', 'Outros'];
  const cores = ['#8884d8', '#82ca9d', '#ffc658', '#d88484', '#84d8c8', '#a384d8', '#d8b284'];

  const dadosPorCategoria = categorias.map((cat) => {
    const total = gastos
      .filter(g => g.categoria === cat)
      .reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0);
    return { name: cat, value: total };
  }).filter(d => d.value > 0);

  const totalGasto = gastos.reduce((acc, curr) => acc + parseFloat(curr.valor || 0), 0);
  const progressoReserva = Math.min(100, (totalGasto / metaReserva) * 100);

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">Painel Financeiro do Leonardo</h1>

      <Tabs defaultValue="gastos">
        <TabsList>
          <TabsTrigger value="gastos">Lançar Gastos</TabsTrigger>
          <TabsTrigger value="faturas">Minhas Faturas</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="reserva">Meta de Reserva</TabsTrigger>
        </TabsList>

        <TabsContent value="gastos">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <select
                  value={gasto.categoria}
                  onChange={e => setGasto({ ...gasto, categoria: e.target.value })}
                  className="border rounded p-2"
                >
                  <option value="">Selecione</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label>Valor</Label>
                <Input
                  type="number"
                  value={gasto.valor}
                  onChange={e => setGasto({ ...gasto, valor: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Input
                  value={gasto.descricao}
                  onChange={e => setGasto({ ...gasto, descricao: e.target.value })}
                />
              </div>
              <Button onClick={handleAddGasto}>Adicionar Gasto</Button>
            </CardContent>
          </Card>

          <div className="grid gap-2 mt-6">
            <h2 className="text-lg font-semibold">Gastos Lançados</h2>
            {gastos.map((g, i) => (
              <div key={i} className="border rounded p-2 text-sm">
                <strong>{g.categoria}</strong> - R$ {parseFloat(g.valor).toFixed(2)} <br />
                <span className="text-muted-foreground">{g.descricao}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faturas">
          <Card>
            <CardContent className="p-4 space-y-4">
              <Label htmlFor="faturaUpload">Enviar nova fatura</Label>
              <Input id="faturaUpload" type="file" onChange={handleFaturaUpload} className="cursor-pointer" />
              <Button variant="outline" className="flex gap-2 items-center mt-2">
                <Upload size={16} /> Enviar
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-2 mt-6">
            <h2 className="text-lg font-semibold">Faturas Enviadas</h2>
            {faturas.map((file, i) => (
              <div key={i} className="border rounded p-2 text-sm">
                {file}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="graficos">
          <h2 className="text-lg font-semibold mb-2">Distribuição de Gastos por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dadosPorCategoria} dataKey="value" nameKey="name" outerRadius={100}>
                {dadosPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="reserva">
          <Card>
            <CardContent className="p-4 space-y-4">
              <Label>Meta de Reserva (R$)</Label>
              <Input
                type="number"
                value={metaReserva}
                onChange={e => setMetaReserva(Number(e.target.value))}
              />
              <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-green-500 h-4"
                  style={{ width: `${progressoReserva}%` }}
                ></div>
              </div>
              <p className="text-sm text-muted-foreground">
                Progresso: R$ {totalGasto.toFixed(2)} de R$ {metaReserva.toFixed(2)} ({progressoReserva.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
