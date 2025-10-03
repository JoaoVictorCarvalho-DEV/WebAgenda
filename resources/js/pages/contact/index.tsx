import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { toast } from "sonner"
import { CheckCircle, Contact, Icon } from 'lucide-react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contato',
        href: '/',
    }
];

export default function IndexContacts() {
    const { success } = usePage().props;
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {

        if (success && success.message) {

            toast(success.message,{icon: <CheckCircle className="w-5 h-5 --primary" />})
        }
    }, [success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criar Contato" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                Contatos aqui!!
            </div>
        </AppLayout>
    );
}
