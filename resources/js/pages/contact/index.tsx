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
    time: number; // Tempo em ms
    steps: number; // Quantidade de passos/saltos
}

// Dados Mockados para Comparação
const mockComparisonData: ComparisonData[] = [
    { name: 'Busca Linear', time: 15.5, steps: 50 },
    { name: 'Busca Binária', time: 0.8, steps: 6 },
    // Você pode adicionar um terceiro cenário (Busca com Trie) futuramente
];

export function MetricsChart() {
    return (
        <div className="h-[250px] w-full p-4">
            <h4 className="text-sm font-semibold mb-2">Tempo de Execução (ms)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={mockComparisonData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                        formatter={(value, name) => [`${value} ms`, name]}
                    />
                    <Bar dataKey="time" fill="#3b82f6" name="Tempo" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function IndexContacts() {
    const { success, contacts } = usePage<PagePropsContacts>().props

    const contactRefs = useRef<(HTMLDivElement | null)[]>([])

    //Métricas
    const [jumpQtd, setJumpQtd] = useState(0);
    const [executionTime, setExecutionTime] = useState(0);
    const [searchType, setSearchType] = useState('Nenhuma');
    const[complexity, setComplexity] = useState('Nenhuma');

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

            if (name === targetName) {
                console.log(`✅ Encontrado: ${name} no índice ${i}`);
                element.classList.add("ring-2", "ring-primary");
                await delay(2000)
                element.classList.remove("ring-2", "ring-primary");
                element.focus()
                break;
            }
            jumps++;
        }

        const endTime = performance.now(); // Fim da medição
        const timeElapsed = endTime - startTime; // Tempo em milissegundos
        setJumpQtd(jumps);
        setExecutionTime(timeElapsed);
        setSearchType('Busca Linear');
        setComplexity('O(N)');
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
        const timeElapsed = endTime - startTime; // Tempo em milissegundos
        setJumpQtd(jumps);
        setExecutionTime(timeElapsed);
        setSearchType('Busca Binária');
        setComplexity('O(log N)');
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
                                <p className="text-sm text-muted-foreground">
                                    Filtros
                                </p>
                                <div className='flex gap-4'>
                                    <Button className='self-start' onClick={() => { linearSearch('Kelly Halvorson') }}>Busca Linear</Button>
                                    <Button className='self-start' onClick={() => { binarySearch('Prof. Krystal Nitzsche MD') }}>Busca Binária</Button>
                                </div>
                            </div>

                            <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {contacts.map((contact) => (
                                    <Card
                                        key={contact.id}
                                        className="hover:bg-secondary/90 contact-card"
                                        tabIndex={0}
                                        data-name={contact.name} // <- aqui
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
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Na sua máquina, com o tempo de animação.
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card className="mt-4">
                                    <MetricsChart />
                                </Card>


                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </AppLayout>
    )
}
