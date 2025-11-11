import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type Group as GroupType } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import { Card, CardContent } from '@/components/ui/card'
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Grupo',
        href: '/',
    },
]

interface PagePropsGroups {
    success?: { message: string }
    groups: GroupType[]
    [key: string]: unknown
}


export default function IndexGroups() {
    const { groups } = usePage<PagePropsGroups>().props

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
                                <h2 className="text-lg font-semibold">Grupos</h2>
                                <p className="text-sm text-muted-foreground">
                                    Filtros
                                </p>
                                <div className='flex gap-4'>
                                    
                                </div>
                            </div>

                            <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {groups.map((group) => (
                                    <Card
                                        key={group.id}
                                        className="hover:bg-secondary/90"
                                        tabIndex={0}
                                        data-name={group.name} // <- aqui
                                    >
                                        <CardContent className="p-4">
                                            <p><strong>Nome:</strong> {group.name}</p>
                                            <p><strong>Descrição:</strong> {group.description || "-"}</p>
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
                        
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </AppLayout>
    )
}
