"use client";

import { useState } from "react";
import { PredictInput, PredictResponse } from "../predict/types/predictTypes";
import { predictApi } from "../predict/api/api";

export default function PredictForm() {
    const [form, setForm] = useState<PredictInput>({
        goal: 0,
        name: "",
        blurb: "",
        start_date: "",
        end_date: "",
        currency: "",
        country_displayable_name: "",
        location_state: "",
        has_video: 0,
        has_photo: 0,
        // dur_bin: "",
    });

    const [result, setResult] = useState<PredictResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
        ...prev,
        [name]:
        name === "goal"
            ? Number(value)
            : name === "has_video" || name === "has_photo"
            ? Number(value) 
            : value,
    }));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log(JSON.stringify(form, null, 2));
        try {
        const response = await predictApi(form);
        setResult(response);
        } catch (err) {
        console.error("Prediction error", err);
        } finally {
        setLoading(false);
        }
    };

    return (
        <div style={{ padding: 24 }}>
        <h1>🎯 Prediction Form</h1>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 500 }}>
            <input name="goal" placeholder="Goal" value={form.goal} onChange={handleChange} />
            <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
            <input name="blurb" placeholder="Blurb" value={form.blurb} onChange={handleChange} />
            <input type="date" name="start_date" value={form.start_date} onChange={handleChange} />
            <input type="date" name="end_date" value={form.end_date} onChange={handleChange} />
            <input name="currency" placeholder="Currency" value={form.currency} onChange={handleChange} />
            <input name="country_displayable_name" placeholder="Country" value={form.country_displayable_name} onChange={handleChange} />
            <input name="location_state" placeholder="Location state" value={form.location_state} onChange={handleChange} />
            <select name="has_video" value={form.has_video} onChange={handleChange}>
            <option value={0}>No video</option>
            <option value={1}>Has video</option>
            </select>
            <select name="has_photo" value={form.has_photo} onChange={handleChange}>
            <option value={0}>No photo</option>
            <option value={1}>Has photo</option>
            </select>
            {/* <input name="dur_bin" placeholder="Duration bin" value={form.dur_bin} onChange={handleChange} /> */}
            <button type="submit" disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
            </button>
        </form>

        {result && (
            <div style={{ marginTop: 24 }}>
            <h2>✅ Prediction Result</h2>
            <pre style={{ background: "#eee", padding: 12, borderRadius: 8 }}>
                {JSON.stringify(result, null, 2)}
            </pre>
            </div>
        )}
        </div>
    );
}
