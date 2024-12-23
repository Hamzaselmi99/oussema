"use client";

import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

interface User {
    id: number;
    name: string;
    email: string;
    company: { name: string };
    website: string;
    address: { city: string };
    role?: string;
}

const ROLES = ["admin", "uploader", "viewer"];

export default function UsersPage() {
    const { user } = useUser(); // Contexte utilisateur
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState<User>({
        id: Date.now(),
        name: "",
        email: "",
        company: { name: "" },
        website: "",
        address: { city: "" },
        role: "viewer",
    });

    const USERS_PER_PAGE = 5;

    // Récupération des utilisateurs depuis l'API
    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((res) => res.json())
            .then((data) => {
                const usersWithRoles = data.map((user: User) => ({
                    ...user,
                    role: ROLES[Math.floor(Math.random() * ROLES.length)], // Assignation aléatoire des rôles
                }));
                setUsers(usersWithRoles);
                setFilteredUsers(usersWithRoles);
            })
            .catch(console.error);
    }, []);

    // Filtrer les utilisateurs en fonction des critères de recherche et des filtres
    useEffect(() => {
        let updatedUsers = users.filter(
            (user) =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (cityFilter) {
            updatedUsers = updatedUsers.filter(
                (user) => user.address.city === cityFilter
            );
        }
        setFilteredUsers(updatedUsers);
        setCurrentPage(1);
    }, [searchTerm, cityFilter, users]);

    // Pagination
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

    // Ajouter un nouvel utilisateur
    const handleAddUser = () => {
        setUsers((prev) => [...prev, newUser]);
        setShowModal(false);
        setNewUser({
            id: Date.now(),
            name: "",
            email: "",
            company: { name: "" },
            website: "",
            address: { city: "" },
            role: "viewer",
        });
    };

    // Supprimer un utilisateur
    const handleDeleteUser = (id: number) => {
        if (user?.role === "admin") {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    // Modifier un utilisateur
    const handleEditUser = (id: number, key: keyof User, value: string) => {
        if (user?.role === "admin") {
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === id ? { ...user, [key]: value } : user
                )
            );
        }
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Liste des Utilisateurs</h1>

            {/* Barre de Recherche et Filtre */}
            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Rechercher par nom ou email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border px-4 py-2 rounded"
                />
                <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="border px-4 py-2 rounded"
                >
                    <option value="">Toutes les villes</option>
                    {[...new Set(users.map((user) => user.address.city))].map(
                        (city) => (
                            <option key={city} value={city}>
                                {city}
                            </option>
                        )
                    )}
                </select>
                {user?.role === "admin" && (
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setShowModal(true)}
                    >
                        Ajouter un utilisateur
                    </button>
                )}
            </div>

            {/* Tableau des Utilisateurs */}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Nom</th>
                        <th className="border border-gray-300 px-4 py-2">Email</th>
                        <th className="border border-gray-300 px-4 py-2">
                            Société
                        </th>
                        <th className="border border-gray-300 px-4 py-2">
                            Site Web
                        </th>
                        <th className="border border-gray-300 px-4 py-2">Ville</th>
                        <th className="border border-gray-300 px-4 py-2">Rôle</th>
                        {user?.role === "admin" && (
                            <th className="border border-gray-300 px-4 py-2">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map((userItem) => (
                        <tr key={userItem.id}>
                            <td className="border border-gray-300 px-4 py-2">
                                {user?.role === "admin" ? (
                                    <input
                                        type="text"
                                        value={userItem.name}
                                        onChange={(e) =>
                                            handleEditUser(
                                                userItem.id,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        className="border px-2 py-1"
                                    />
                                ) : (
                                    userItem.name
                                )}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {userItem.email}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {userItem.company.name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {userItem.website}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {userItem.address.city}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                {userItem.role}
                            </td>
                            {user?.role === "admin" && (
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() => handleDeleteUser(userItem.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`px-4 py-2 rounded ${
                            currentPage === i + 1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Modal d'Ajout */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-lg font-bold mb-4">
                            Ajouter un utilisateur
                        </h2>
                        <input
                            type="text"
                            placeholder="Nom"
                            value={newUser.name}
                            onChange={(e) =>
                                setNewUser({ ...newUser, name: e.target.value })
                            }
                            className="w-full border px-4 py-2 mb-2"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={(e) =>
                                setNewUser({ ...newUser, email: e.target.value })
                            }
                            className="w-full border px-4 py-2 mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Ville"
                            value={newUser.address.city}
                            onChange={(e) =>
                                setNewUser({
                                    ...newUser,
                                    address: { city: e.target.value },
                                })
                            }
                            className="w-full border px-4 py-2 mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Société"
                            value={newUser.company.name}
                            onChange={(e) =>
                                setNewUser({
                                    ...newUser,
                                    company: { name: e.target.value },
                                })
                            }
                            className="w-full border px-4 py-2 mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={handleAddUser}
                            >
                                Ajouter
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
