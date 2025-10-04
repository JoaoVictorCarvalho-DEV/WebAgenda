import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type Contact as ContactType } from '@/types'
import { Head, usePage } from '@inertiajs/react'
import React, { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern'
import {
    ResizablePanelGroup,
    ResizablePanel,
    ResizableHandle,
} from '@/components/ui/resizable'
import { Button } from "@/components/ui/button";
import { delay } from '@/lib/utils';
import { useScrollToItem } from '@/hooks/use-scroll-to-item';
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

export default function IndexContacts() {
    const { success, contacts } = usePage<PagePropsContacts>().props

    const contactRefs = useRef<(HTMLDivElement | null)[]>([])

    const { scrollToItem } = useScrollToItem();

    async function scrollItems() {
        await scrollToItem(5);
        await delay(1200);
        await scrollToItem(7);
        await delay(1200);
        await scrollToItem(9);
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
                                <Button className="self-start" onClick={scrollItems}>5º item</Button>
                            </div>

                            <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {contacts.map((contact, index) => (
                                    <Card
                                        ref={(el) => (contactRefs.current[index] = el)}
                                        key={contact.id}
                                        className="hover:bg-secondary/90 focus-visible:ring focus-visible:ring-primary outline-none contact-card"
                                        tabIndex={0}
                                    >
                                        <CardContent className="p-4">
                                            <p>
                                                <strong>Nome:</strong> {contact.name}
                                            </p>
                                            <p>
                                                <strong>Telefone:</strong>{' '}
                                                {contact.phone_number || '-'}
                                            </p>
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
                        <div className="flex h-full flex-col gap-4 p-4">
                            <h2 className="text-lg font-semibold">Métricas</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                </div>
                                <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                </div>
                            </div>
                            <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </AppLayout>
    )
}
