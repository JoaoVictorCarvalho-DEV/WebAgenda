import React, { useEffect, useRef, useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type Group as GroupType } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import { Card, CardContent } from '@/components/ui/card'
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable'

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts'

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Grupo', href: '/' }]

interface PagePropsGroups {
    success?: { message: string }
    groups: GroupType[]
    [key: string]: unknown
}

// =================== CONFIGURAÇÕES ===================
const ANIMATION_MS = 400 // duração da animação (ms)
const WAIT_BETWEEN_STEPS_MS = 150 // tempo entre passos (ms)

interface StepSnapshot {
    state: GroupType[]
    highlight: (number | string)[]
}

interface SortMetrics {
    time: number
    comparisons: number
    swaps: number
    steps: number
}

// =================== Componente de gráfico (embutido) ===================
function SortMetricsChart({ metrics }: { metrics: SortMetrics }) {
    const data = [
        { name: 'Tempo (ms)', value: Number(metrics.time.toFixed(2)) },
        { name: 'Comparações', value: metrics.comparisons },
        { name: 'Trocas', value: metrics.swaps },
        { name: 'Passos', value: metrics.steps },
    ]

    return (
        <div className="w-full h-[300px] p-4">
            <h3 className="text-lg font-semibold mb-2">Métricas do QuickSort</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// =================== Componente principal ===================
export default function IndexGroups() {
    const { groups } = usePage<PagePropsGroups>().props
    const [displayGroups, setDisplayGroups] = useState<GroupType[]>(groups || [])
    const [highlightedIds, setHighlightedIds] = useState<(number | string)[]>([])
    const refsMap = useRef<Map<number | string, HTMLDivElement>>(new Map())

    // métricas para o gráfico
    const [sortMetrics, setSortMetrics] = useState<SortMetrics>({
        time: 0,
        comparisons: 0,
        swaps: 0,
        steps: 0,
    })

    useEffect(() => {
        setDisplayGroups(groups || [])
        refsMap.current.clear()
    }, [groups])

    const compareNameAsc = (a: GroupType, b: GroupType) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'accent' })

    const compareNameDesc = (a: GroupType, b: GroupType) =>
        b.name.localeCompare(a.name, undefined, { sensitivity: 'accent' })

    const setCardRef = (id: number | string) => (el: HTMLDivElement | null) => {
        if (el) refsMap.current.set(id, el)
        else refsMap.current.delete(id)
    }

    // =================== FLIP Animation (revisada para estabilidade) ===================
    async function performFLIP(newOrder: GroupType[], highlightIds: (number | string)[] = []) {
        // manter os highlights
        setHighlightedIds(highlightIds)

        // Captura posições iniciais (baseadas no displayGroups atual)
        const firstRects = new Map<number | string, DOMRect>()
        for (const g of displayGroups) {
            const el = refsMap.current.get(g.id)
            if (el) firstRects.set(g.id, el.getBoundingClientRect())
        }

        // Atualiza DOM para a nova ordem
        setDisplayGroups(newOrder)

        // Espera o browser aplicar o novo layout
        await new Promise((resolve) => requestAnimationFrame(resolve))

        // Captura posições finais
        const lastRects = new Map<number | string, DOMRect>()
        for (const g of newOrder) {
            const el = refsMap.current.get(g.id)
            if (el) lastRects.set(g.id, el.getBoundingClientRect())
        }

        // Preparar animações FLIP
        const animPromises: Promise<void>[] = []
        for (const g of newOrder) {
            const el = refsMap.current.get(g.id)
            if (!el) continue
            const first = firstRects.get(g.id)
            const last = lastRects.get(g.id)
            if (!first || !last) continue

            const dx = first.left - last.left
            const dy = first.top - last.top
            if (dx === 0 && dy === 0) continue

            // Configurar FLIP
            el.style.transition = 'none'
            el.style.transform = `translate(${dx}px, ${dy}px)`
            // Forçar reflow
            void el.offsetWidth
            // Ativar transição
            el.style.transition = `transform ${ANIMATION_MS}ms ease`
            // Voltar para posição final (inicia animação)
            el.style.transform = ''

            const p = new Promise<void>((resolve) => {
                const onEnd = (ev: TransitionEvent) => {
                    if (ev.target !== el) return
                    el.removeEventListener('transitionend', onEnd)
                    el.style.transition = ''
                    el.style.transform = ''
                    resolve()
                }
                el.addEventListener('transitionend', onEnd)

                // Fallback: garante conclusão se transitionend não disparar
                setTimeout(() => {
                    el.removeEventListener('transitionend', onEnd)
                    el.style.transition = ''
                    el.style.transform = ''
                    resolve()
                }, ANIMATION_MS + 150)
            })
            animPromises.push(p)
        }

        // Aguarda todas as animações
        await Promise.all(animPromises)

        // Limpa destaque após término
        setHighlightedIds([])
    }

    // =================== QUICK SORT (gera passos + métricas) ===================
    function generateQuickSortSteps(
        arr: GroupType[],
        compareFn: (a: GroupType, b: GroupType) => number
    ): { steps: StepSnapshot[]; comparisons: number; swaps: number } {
        const steps: StepSnapshot[] = []
        const a = arr.slice()
        let comparisons = 0
        let swaps = 0

        function quickSort(low: number, high: number) {
            if (low < high) {
                const p = partition(low, high)
                quickSort(low, p - 1)
                quickSort(p + 1, high)
            }
        }

        function partition(low: number, high: number) {
            const pivot = a[high]
            let i = low - 1
            for (let j = low; j < high; j++) {
                comparisons++
                if (compareFn(a[j], pivot) <= 0) {
                    i++
                    if (i !== j) {
                        swaps++
                            ;[a[i], a[j]] = [a[j], a[i]]
                        steps.push({
                            state: a.slice(),
                            highlight: [a[i].id, a[j].id],
                        })
                    }
                }
            }
            if (i + 1 !== high) {
                swaps++
                    ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
                steps.push({
                    state: a.slice(),
                    highlight: [a[i + 1].id, a[high].id],
                })
            }
            return i + 1
        }

        quickSort(0, a.length - 1)
        return { steps, comparisons, swaps }
    }

    // =================== Controladores ===================
    async function handleSort(order: 'asc' | 'desc', stepByStep = false) {
        const compareFn = order === 'asc' ? compareNameAsc : compareNameDesc
        const current = displayGroups.slice()

        if (!stepByStep) {
            // Versão rápida (sem passos)
            const start = performance.now()

            // Não mutar o array original usado nas medições
            const sorted = current.slice().sort(compareFn)

            const end = performance.now()

            // Métricas aproximadas para a versão rápida (JS nativo)
            setSortMetrics({
                time: end - start,
                comparisons: sorted.length, // aproximação (não temos comparações do sort nativo)
                swaps: 0,
                steps: 1,
            })

            await performFLIP(sorted)
            setDisplayGroups(sorted)
            return
        }

        // Versão passo a passo — gerar passos e métricas
        const start = performance.now()
        const { steps, comparisons, swaps } = generateQuickSortSteps(current, compareFn)

        for (const step of steps) {
            await performFLIP(step.state, step.highlight)
            // espera entre passos para visualização
            await new Promise((r) => setTimeout(r, WAIT_BETWEEN_STEPS_MS))
        }

        const end = performance.now()

        // Registrar métricas detalhadas
        setSortMetrics({
            time: end - start,
            comparisons,
            swaps,
            steps: steps.length,
        })

        if (steps.length > 0) setDisplayGroups(steps[steps.length - 1].state)
    }

    // =================== Renderização ===================
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Grupos" />
            <div className="flex h-[calc(100vh-6rem)] flex-1 rounded-xl p-4">
                <ResizablePanelGroup
                    direction="horizontal"
                    className="w-full rounded-lg border bg-background"
                >
                    <ResizablePanel defaultSize={90} minSize={50}>
                        <div className="flex h-full flex-col gap-4 p-4">
                            <div className="mb-2 border-b pb-2">
                                <h2 className="text-lg font-semibold">Grupos</h2>
                                <p className="text-sm text-muted-foreground">Filtros e Ordenação</p>

                                <div className="flex gap-4 mt-2 flex-wrap">
                                    <div>
                                        <button
                                            onClick={() => handleSort('asc', false)}
                                            className="px-3 py-1 rounded bg-primary text-primary-foreground"
                                        >
                                            A → Z (rápido)
                                        </button>
                                        <button onClick={() => handleSort('asc', true)} className="px-3 py-1 rounded border">
                                            A → Z (QuickSort passo a passo)
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => handleSort('desc', false)}
                                            className="px-3 py-1 rounded bg-primary text-primary-foreground"
                                        >
                                            Z → A (rápido)
                                        </button>

                                        <button onClick={() => handleSort('desc', true)} className="px-3 py-1 rounded border">
                                            Z → A (QuickSort passo a passo)
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {displayGroups.map((group) => {
                                    const isHighlighted = highlightedIds.includes(group.id)
                                    return (
                                        <div
                                            key={group.id}
                                            ref={setCardRef(group.id)}
                                            data-name={group.name}
                                            // will-change ajuda desempenho da animação
                                            style={{ willChange: 'transform' }}
                                            className={
                                                isHighlighted
                                                    ? 'ring-4 ring-green-400 rounded-xl transition-all duration-300'
                                                    : ''
                                            }
                                        >
                                            <Card className="hover:bg-secondary/90" tabIndex={0}>
                                                <CardContent className="p-4">
                                                    <p>
                                                        <strong>Nome:</strong> {group.name}
                                                    </p>
                                                    <p>
                                                        <strong>Descrição:</strong> {group.description || '-'}
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={45}>
                        <div className="h-full overflow-y-auto p-4">
                            <SortMetricsChart metrics={sortMetrics} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </AppLayout>
    )
}
