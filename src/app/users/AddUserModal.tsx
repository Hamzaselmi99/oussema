import { useState } from "react";

export default function AddUserModal({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [city, setCity] = useState("");

    const handleSubmit = () => {
        console.log({ name, email, city });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-bold mb-4">Ajouter un utilisateur</h2>
                <input
                    className="w-full border px-4 py-2 mb-2"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    className="w-full border px-4 py-2 mb-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="w-full border px-4 py-2 mb-2"
                    placeholder="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-gray-300 px-4 py-2 rounded"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
}
