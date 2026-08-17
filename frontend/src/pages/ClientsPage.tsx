import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ClientForm from '../components/clients/ClientForm';

interface Client {
    id: string;
    name: string;
    clientType: string;
    email?: string;
    phone?: string;
    isActive: boolean;
}

interface ClientFormData {
    name: string;
    clientType: string;
    email?: string;
    phone?: string;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [editingClient, setEditingClient] =
        useState<Client | null>(null);

    const [statusFilter, setStatusFilter] =
        useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    useEffect(() => {
        loadClients();
    }, []);

    async function loadClients() {
        try {
            setLoading(true);
            setError('');

            const response = await api.get<Client[]>('/clients');

            setClients(response.data);
        } catch (error) {
            console.error(error);
            setError('Не удалось загрузить список клиентов');
        } finally {
            setLoading(false);
        }
    }

    async function createClient(data: ClientFormData) {
        await api.post('/clients', data);
        await loadClients();
    }

    async function updateClient(data: ClientFormData) {
        if (!editingClient) {
            return;
        }

        await api.patch(
            `/clients/${editingClient.id}`,
            data,
        );

        await loadClients();
    }

    const filteredClients = clients.filter((client) => {
        const query = search.toLowerCase().trim();

        const matchesSearch =
            !query ||
            client.name.toLowerCase().includes(query) ||
            client.email?.toLowerCase().includes(query) ||
            client.phone?.toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === 'ALL' ||
            (statusFilter === 'ACTIVE' && client.isActive) ||
            (statusFilter === 'INACTIVE' && !client.isActive);

        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Клиенты</h1>
                    <p>Управление клиентами WMS</p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => setShowCreateForm(true)}
                >
                    + Создать клиента
                </button>
            </div>

            <div className="clients-toolbar">
                <input
                    type="text"
                    placeholder="Поиск клиента..."
                    value={search}
                    onChange={(event) =>
                        setSearch(event.target.value)
                    }
                />

                <select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(
                            event.target.value as
                            | 'ALL'
                            | 'ACTIVE'
                            | 'INACTIVE',
                        )
                    }
                >
                    <option value="ALL">
                        Все клиенты
                    </option>

                    <option value="ACTIVE">
                        Активные
                    </option>

                    <option value="INACTIVE">
                        Неактивные
                    </option>
                </select>
            </div>

            {loading && (
                <div className="table-state">
                    Загрузка клиентов...
                </div>
            )}

            {!loading && error && (
                <div className="table-state table-state-error">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                filteredClients.length === 0 && (
                    <div className="table-state">
                        {search
                            ? 'По вашему запросу ничего не найдено'
                            : 'Клиентов пока нет'}
                    </div>
                )}

            {!loading &&
                !error &&
                filteredClients.length > 0 && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Название</th>
                                    <th>Тип</th>
                                    <th>Email</th>
                                    <th>Телефон</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredClients.map((client) => (
                                    <tr key={client.id}>
                                        <td>{client.name}</td>

                                        <td>{client.clientType}</td>

                                        <td>{client.email ?? '—'}</td>

                                        <td>{client.phone ?? '—'}</td>

                                        <td>
                                            <span
                                                className={
                                                    client.isActive
                                                        ? 'status status-active'
                                                        : 'status status-inactive'
                                                }
                                            >
                                                {client.isActive
                                                    ? 'Активен'
                                                    : 'Неактивен'}
                                            </span>
                                        </td>

                                        <td>
                                            <button
                                                className="table-action"
                                                onClick={() =>
                                                    setEditingClient(client)
                                                }
                                            >
                                                Редактировать
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            {showCreateForm && (
                <ClientForm
                    onSubmit={createClient}
                    onSuccess={() => setShowCreateForm(false)}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}

            {editingClient && (
                <ClientForm
                    client={editingClient}
                    onSubmit={updateClient}
                    onSuccess={() => setEditingClient(null)}
                    onCancel={() => setEditingClient(null)}
                />
            )}
        </div>
    );
}