import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import React, { useState, useEffect } from 'react';
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
            setAlertMessage(success.message);

            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 5000);


            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {alertMessage && (
                <Alert variant="default" className="my-4">
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        {alertMessage}
                    </AlertDescription>
                </Alert>
            )}
            <Head title="Criar Contato" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                Contatos aqui!!
            </div>
        </AppLayout>
    );
}
