import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";


// 1. Definir o esquema de validação
const formSchema = z.object({
    // Adicione mais campos do seu formulário de contato aqui
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    phone_number: z.string().max(12, {
        message: "No máximo 12 caracteres",
    }).optional().or(z.literal('')), // Tornando opcional e permitindo string vazia
});

// Definir o tipo dos dados do formulário a partir do esquema
type ContactFormValues = z.infer<typeof formSchema>;

// Breadcrumbs para o layout
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Contatos',
        href: '/contact/index', // Ajustado para ser mais genérico
    },
    {
        title: 'Cadastrar',
        href: '/contato/create',
    },
];


export default function CreateContact() {

    const form = useForm<ContactFormValues>({
        // Adicionar o resolver para validação com Zod
        resolver: zodResolver(formSchema),
        // Definir valores padrão para os campos do formulário
        defaultValues: {
            name: "",
            phone_number: "",
        },
    });

    function onSubmit(values: ContactFormValues) {
        console.log("Formulário enviado com sucesso!", values);

        router.post('/contact/store', values, {
            onSuccess: () => {
                console.log('Contato criado com sucesso!')
            },
            onError: (errors) => {
                console.error('Erro ao salvar:', errors)
            }
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Criar Contato" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                {/* O método handleSubmit do form hook irá tratar a validação antes de chamar onSubmit */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Campo para o Nome/Username */}
                        <FormField
                            control={form.control}
                            name="name" // Alterado de 'username' para 'name' (mais apropriado para Contato)
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Seu nome" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Nome completo do seu contato.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder='00-00000000' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Cadastrar Contato</Button>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
