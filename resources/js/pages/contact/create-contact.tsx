import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contato',
        href: '/',
    },
    {
        title: 'Cadastrar',
        href: '/contato/create',
    },
];

export default function CreateContact() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criar Contato" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                FORMULÁRIO AQUI!!
            </div>
        </AppLayout>
    );
}
