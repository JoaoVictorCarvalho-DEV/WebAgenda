import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type Contact as ContactType } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable'
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { delay } from '@/lib/utils';
import { useScrollToItem } from '@/hooks/use-scroll-to-item';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contato',
        href: '/',
    },
]

interface PagePropsContacts {
    success?: { message: string }
    contacts: ContactType[]
    [key: string]: unknown
}


interface ComparisonData {
    name: string;
    time: number;
    steps: number;
}


const mockComparisonData: ComparisonData[] = [
    { name: 'Busca Linear', time: 15.5, steps: 50 },
    { name: 'Busca Binária', time: 0.8, steps: 6 },
];

export function MetricsChart({ data }: { data: ComparisonData[] }) {
    return (
        <div className="h-[250px] w-full p-4">
            <h4 className="text-sm font-semibold mb-2">Tempo de Execução (ms)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [`${value}`, name]} />
                    <Bar dataKey="time" fill="#3b82f6" name="Tempo (ms)" />
                    <Bar dataKey="steps" fill="#10b981" name="Saltos" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}


export default function IndexContacts() {
    const { success, contacts } = usePage<PagePropsContacts>().props

    const contactRefs = useRef<(HTMLDivElement | null)[]>([])

    const [selectedName, setSelectedName] = useState("");

    const [chartData, setChartData] = useState([
        { name: "Busca Linear", time: 0, steps: 0 },
        { name: "Busca Binária", time: 0, steps: 0 },
    ]);

    //Métricas
    const [jumpQtd, setJumpQtd] = useState(0);
    const [executionTime, setExecutionTime] = useState(0);
    const [searchType, setSearchType] = useState('Nenhuma');
    const [complexity, setComplexity] = useState('Nenhuma');

    const { scrollToItem } = useScrollToItem();


    async function linearSearch(targetName: string) {
        let jumps = 0;
        const startTime = performance.now(); // Início da medição

        const elements = document.querySelectorAll(".contact-card");
        targetName = targetName.toLowerCase();

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i] as HTMLElement;
            const name = element.dataset.name?.trim().toLowerCase() ?? "";
            console.log(name)
            scrollToItem(i);
            await delay(1100); // tempo de animação

            jumps++;
            if (name === targetName) {
                console.log(`✅ Encontrado: ${name} no índice ${i}`);
                element.classList.add("ring-2", "ring-primary");
                await delay(1100)
                element.classList.remove("ring-2", "ring-primary");
                element.focus()
                break;
            }
        }

        const endTime = performance.now(); // Fim da medição
        let timeElapsed = endTime - startTime;
        timeElapsed = timeElapsed - ( (jumps + 1) * 1100 );
        setJumpQtd(jumps);
        setExecutionTime(timeElapsed);
        setSearchType('Busca Linear');
        setComplexity('O(N)');

        setChartData(prev =>
            prev.map(item =>
                item.name === "Busca Linear"
                    ? { ...item, time: timeElapsed, steps: jumps }
                    : item
            )
        );

    }

    async function binarySearch(targetName: string) {
        let jumps = 0;
        const startTime = performance.now(); // Início da medição

        const elements = document.querySelectorAll('.contact-card');
        targetName = targetName.toLowerCase();

        let start = 0;
        let end = elements.length - 1;
        let mid;


        while (start <= end) {
            mid = start + Math.floor((end - start) / 2);
            const element = elements[mid] as HTMLElement;
            scrollToItem(mid)

            const name = element.dataset.name?.trim().toLowerCase() ?? "";
            if (name == targetName) {
                console.log(`✅ Encontrado: ${name} no índice ${mid}`)
                element.classList.add("ring-2", "ring-primary");
                await delay(2000)
                element.classList.remove("ring-2", "ring-primary");
                element.focus()
                break;
            }

            if (name > targetName) {
                end = mid - 1
            } else {
                start = mid + 1
            }
            await delay(2000)
            jumps++;
        }
        const endTime = performance.now(); // Fim da medição
        let timeElapsed = endTime - startTime; // Tempo em milissegundos
        timeElapsed = timeElapsed - ( (jumps + 1) * 2000 );
        setJumpQtd(jumps);
        setExecutionTime(timeElapsed);
        setSearchType('Busca Binária');
        setComplexity('O(log N)');

        setChartData(prev =>
            prev.map(item =>
                item.name === "Busca Binária"
                    ? { ...item, time: timeElapsed, steps: jumps }
                    : item
            )
        );
    }

    useEffect(() => {
        if (success && success.message) {
            toast(success.message, {
                icon: <CheckCircle className="w-5 h-5 text-primary" />,
            })
        }
    }, [success])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Contatos" />
            <div className="flex h-[calc(100vh-6rem)] flex-1 rounded-xl p-4">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="w-full rounded-lg border bg-background"
                >
                    <ResizablePanel defaultSize={90} minSize={50}>
                        <div className="flex h-full flex-col gap-4 p-4">

                            <div className="mb-2 border-b pb-2">
                                <h2 className="text-lg font-semibold">Contatos</h2>
                                <p className="text-sm text-muted-foreground">Filtros</p>

                                <div className="flex gap-4 items-center">

                                    {/* DROPDOWN COM OS NOMES */}
                                    <select
                                        className="border rounded-md p-2 bg-background"
                                        value={selectedName}
                                        onChange={(e) => setSelectedName(e.target.value)}
                                    >
                                        <option value="">Selecione um contato...</option>
                                        {contacts.map((c) => (
                                            <option key={c.id} value={c.name}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>

                                    {/* BOTÕES DE BUSCA */}
                                    <Button
                                        disabled={!selectedName}
                                        onClick={() => linearSearch(selectedName)}
                                    >
                                        Busca Linear
                                    </Button>

                                    <Button
                                        disabled={!selectedName}
                                        onClick={() => binarySearch(selectedName)}
                                    >
                                        Busca Binária
                                    </Button>

                                </div>
                            </div>

                            <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {contacts.map((contact) => (
                                    <Card
                                        key={contact.id}
                                        className="hover:bg-secondary/90 contact-card"
                                        tabIndex={0}
                                        data-name={contact.name}
                                    >
                                        <CardContent className="p-4">
                                            <p><strong>Nome:</strong> {contact.name}</p>
                                            <p><strong>Telefone:</strong> {contact.phone_number || "-"}</p>
                                        </CardContent>
                                    </Card>
                                ))}

                            </div>
                        </div>
                    </ResizablePanel>

                    {/* Handle arrastável */}
                    <ResizableHandle withHandle />

                    {/* Painel direito: métricas / gráficos */}
                    <ResizablePanel defaultSize={45}>
                        <div className="h-full overflow-y-auto p-4">
                            <div className="flex flex-col gap-4">

                                <h2 className="text-lg font-semibold">Desempenho Algorítmico</h2>

                                <Card className="shadow-md">
                                    <CardContent className="p-4 flex flex-col gap-2">
                                        <p className="text-sm text-muted-foreground">Último Algoritmo Executado</p>
                                        <h3 className="text-2xl font-bold">
                                            <Badge variant="secondary">{searchType}</Badge>
                                        </h3>
                                    </CardContent>
                                </Card>

                                <div className="grid grid-cols-2 gap-4">

                                    <Card>
                                        <CardContent className="p-4">
                                            <p className="text-sm text-muted-foreground">Saltos (Busca Binária)</p>
                                            <p className="text-3xl font-bold text-blue-600">{jumpQtd}</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Complexidade ideal: {complexity}
                                            </p>
                                        </CardContent>
                                    </Card>


                                    <Card>
                                        <CardContent className="p-4">
                                            <p className="text-sm text-muted-foreground">Tempo (ms)</p>
                                            <p className="text-3xl font-bold text-green-600">
                                                {executionTime.toFixed(2)} ms
                                            </p>

                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="mt-4">
                                    <MetricsChart data={chartData} />
                                </Card>

                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </AppLayout>
    )
}
