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

export default function IndexGroups() {
    const { groups } = usePage<PagePropsGroups>().props
    const [displayGroups, setDisplayGroups] = useState<GroupType[]>(groups || [])
    const [highlightedIds, setHighlightedIds] = useState<(number | string)[]>([])
    const refsMap = useRef<Map<number | string, HTMLDivElement>>(new Map())

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

    // =================== FLIP Animation ===================
    async function performFLIP(newOrder: GroupType[], highlightIds: (number | string)[] = []) {
        setHighlightedIds(highlightIds)

        const firstRects = new Map<number | string, DOMRect>()
        for (const g of displayGroups) {
            const el = refsMap.current.get(g.id)
            if (el) firstRects.set(g.id, el.getBoundingClientRect())
        }

        setDisplayGroups(newOrder)
        await new Promise(requestAnimationFrame)

        const lastRects = new Map<number | string, DOMRect>()
        for (const g of newOrder) {
            const el = refsMap.current.get(g.id)
            if (el) lastRects.set(g.id, el.getBoundingClientRect())
        }

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

            el.style.transition = 'none'
            el.style.transform = `translate(${dx}px, ${dy}px)`
            el.offsetHeight // força reflow
            el.style.transition = `transform ${ANIMATION_MS}ms ease`
            el.style.transform = ''

            const p = new Promise<void>((resolve) => {
                const handle = () => {
                    el.removeEventListener('transitionend', handle)
                    el.style.transition = ''
                    el.style.transform = ''
                    resolve()
                }
                el.addEventListener('transitionend', handle)
                setTimeout(resolve, ANIMATION_MS + 50)
            })
            animPromises.push(p)
        }

        await Promise.all(animPromises)
        setHighlightedIds([]) // limpa destaque após o passo
    }

    // =================== QUICK SORT (gera passos) ===================
    function generateQuickSortSteps(
        arr: GroupType[],
        compareFn: (a: GroupType, b: GroupType) => number
    ): StepSnapshot[] {
        const steps: StepSnapshot[] = []
        const a = arr.slice()

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
                if (compareFn(a[j], pivot) <= 0) {
                    i++
                    if (i !== j) {
                        ;[a[i], a[j]] = [a[j], a[i]]
                        steps.push({
                            state: a.slice(),
                            highlight: [a[i].id, a[j].id],
                        })
                    }
                }
            }
            if (i + 1 !== high) {
                ;[a[i + 1], a[high]] = [a[high], a[i + 1]]
                steps.push({
                    state: a.slice(),
                    highlight: [a[i + 1].id, a[high].id],
                })
            }
            return i + 1
        }

        quickSort(0, a.length - 1)
        return steps
    }

    // =================== Controladores ===================
    async function handleSort(order: 'asc' | 'desc', stepByStep = false) {
        const compareFn = order === 'asc' ? compareNameAsc : compareNameDesc
        const current = displayGroups.slice()

        if (!stepByStep) {
            const sorted = current.sort(compareFn)
            await performFLIP(sorted)
            setDisplayGroups(sorted)
            return
        }

        const steps = generateQuickSortSteps(current, compareFn)
        for (const step of steps) {
            await performFLIP(step.state, step.highlight)
            await new Promise((r) => setTimeout(r, WAIT_BETWEEN_STEPS_MS))
        }
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
                                <p className="text-sm text-muted-foreground">
                                    Filtros e Ordenação
                                </p>

                                <div className="flex gap-4 mt-2 flex-wrap">
                                    <button
                                        onClick={() => handleSort('asc', false)}
                                        className="px-3 py-1 rounded bg-primary text-primary-foreground"
                                    >
                                        A → Z (rápido)
                                    </button>

                                    <button
                                        onClick={() => handleSort('asc', true)}
                                        className="px-3 py-1 rounded border"
                                    >
                                        A → Z (QuickSort passo a passo)
                                    </button>

                                    <button
                                        onClick={() => handleSort('desc', false)}
                                        className="px-3 py-1 rounded bg-primary text-primary-foreground"
                                    >
                                        Z → A (rápido)
                                    </button>

                                    <button
                                        onClick={() => handleSort('desc', true)}
                                        className="px-3 py-1 rounded border"
                                    >
                                        Z → A (QuickSort passo a passo)
                                    </button>
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
                                                        <strong>Descrição:</strong>{' '}
                                                        {group.description || '-'}
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
                    <ResizablePanel defaultSize={45}></ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </AppLayout>
    )
}
