import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
    icon?: LucideIcon | null;
}

export type NavElement = NavItem | NavGroup;

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    phone_number?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Contact {
    id: number;
    name: string;
    phone_number: string;
    created_at: string;
    updated_at: string;
}
