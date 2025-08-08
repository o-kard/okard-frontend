"use client";

import { useEffect, useState } from "react";

type TestItem = {
  id: string;
  title: string;
  description: string;
};

export default function TestComponent() {
  const [data, setData] = useState<TestItem[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests`);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddOrUpdate = async () => {
    const payload = { title, description };

    if (editId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tests/${editId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        resetForm();
        fetchData();
      }
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        resetForm();
        fetchData();
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tests/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      fetchData();
    }
  };

  const handleEdit = (item: TestItem) => {
    setEditId(item.id);
    setTitle(item.title);
    setDescription(item.description);
  };

  return (
    <div className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Test CRUD with UUID</h1>

      <div className="space-y-2">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border w-full px-3 py-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full px-3 py-2 rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAddOrUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editId ? "Update" : "Add"}
          </button>
          {editId && (
            <button
              onClick={resetForm}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <ul className="space-y-2">
        {data.map((item) => (
          <li key={item.id} className="border p-4 rounded">
            <div className="font-semibold">{item.title}</div>
            <div className="text-sm text-gray-600">{item.description}</div>
            <div className="flex gap-4 mt-2 text-sm">
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
