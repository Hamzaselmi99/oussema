"use client";

import { useState } from "react";
import { useUser } from "../context/UserContext";

interface UploadedFile {
    id: number;
    name: string;
    size: number;
    type: string;
    uploadDate: string;
    uploader: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif", "application/pdf"];

export default function UploadsPage() {
    const { user } = useUser(); // Contexte utilisateur
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [error, setError] = useState("");

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || (user.role !== "admin" && user.role !== "uploader")) {
            setError("Vous n'avez pas la permission de téléverser des fichiers.");
            return;
        }

        const selectedFiles = event.target.files;
        if (!selectedFiles) return;

        const newFiles: UploadedFile[] = [];

        for (const file of selectedFiles) {
            // Validation : Type de fichier
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                setError(`Le type de fichier "${file.name}" n'est pas autorisé.`);
                continue;
            }

            // Validation : Taille du fichier
            if (file.size > MAX_FILE_SIZE) {
                setError(`Le fichier "${file.name}" dépasse la taille maximale de 5 Mo.`);
                continue;
            }

            // Ajouter le fichier validé à la liste
            newFiles.push({
                id: Date.now() + Math.random(), // Générer un ID unique
                name: file.name,
                size: file.size,
                type: file.type,
                uploadDate: new Date().toLocaleString(),
                uploader: user.email, // Enregistrer l'email de l'utilisateur téléverseur
            });
        }

        setFiles((prev) => [...prev, ...newFiles]);
        setError(""); // Réinitialiser les erreurs après un téléversement réussi
    };

    const handleFileDelete = (id: number) => {
        if (!user || (user.role !== "admin" && user.role !== "uploader")) {
            setError("Vous n'avez pas la permission de supprimer ce fichier.");
            return;
        }

        setFiles(files.filter((file) => file.id !== id));
    };

    return (
        <div>
            <h1 className="text-xl font-bold mb-4">Téléversement de fichiers</h1>

            {/* Formulaire de téléversement */}
            {user?.role === "admin" || user?.role === "uploader" ? (
                <>
                    <input
                        type="file"
                        accept=".jpeg,.png,.gif,.pdf"
                        multiple
                        onChange={handleFileUpload}
                        className="mb-4 border px-4 py-2 rounded"
                    />
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                </>
            ) : (
                <p className="text-red-500 mb-4">
                    Vous n'avez pas la permission de téléverser des fichiers.
                </p>
            )}

            {/* Liste des fichiers téléversés */}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Nom du fichier</th>
                        <th className="border border-gray-300 px-4 py-2">Taille</th>
                        <th className="border border-gray-300 px-4 py-2">Type</th>
                        <th className="border border-gray-300 px-4 py-2">Date de téléversement</th>
                        <th className="border border-gray-300 px-4 py-2">Téléverseur</th>
                        {user?.role === "admin" || user?.role === "uploader" ? (
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        ) : null}
                    </tr>
                </thead>
                <tbody>
                    {files.map((file) => (
                        <tr key={file.id}>
                            <td className="border border-gray-300 px-4 py-2">{file.name}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {(file.size / 1024 / 1024).toFixed(2)} Mo
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{file.type}</td>
                            <td className="border border-gray-300 px-4 py-2">{file.uploadDate}</td>
                            <td className="border border-gray-300 px-4 py-2">{file.uploader}</td>
                            {user?.role === "admin" || user?.role === "uploader" ? (
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() => handleFileDelete(file.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            ) : null}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
