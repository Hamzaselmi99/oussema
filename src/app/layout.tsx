"use client";

import "./globals.css";
import { UserProvider, useUser } from "./context/UserContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <UserProvider>
                    <ProtectedLayout>
                        <Navbar />
                        <main className="p-4">{children}</main>
                    </ProtectedLayout>
                </UserProvider>
            </body>
        </html>
    );
}

function Navbar() {
    const { user, logout } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace("/login"); // Redirection vers la page de connexion avec reset d'historique
    };

    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="flex justify-between">
                <div className="space-x-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="hover:underline">
                                Dashboard
                            </Link>
                            <Link href="/users" className="hover:underline">
                                Users
                            </Link>
                            <Link href="/uploads" className="hover:underline">
                                Uploads
                            </Link>
                        </>
                    ) : null}
                </div>
                <div className="space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm">
                                Connecté en tant que : {user.email} ({user.role})
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Connexion
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Si l'utilisateur n'est pas connecté et n'est pas sur la page de connexion
        if (!user && pathname !== "/login") {
            router.replace("/login"); // Redirection avec réinitialisation de l'historique
        }
    }, [user, pathname, router]);

    // Affiche les enfants uniquement si l'utilisateur est connecté ou sur /login
    if (!user && pathname !== "/login") {
        return null;
    }

    return <>{children}</>;
}
