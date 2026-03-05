"use client";

import { useEffect, useRef, useState } from "react";
import { organizationApi } from "@/lib/api";
import { Building2, Image, Phone, Mail, Globe, Save, CheckCircle, AlertCircle, Loader2, Upload, FolderOpen } from "lucide-react";

interface OrgProfile {
    organizationName: string;
    contactEmail: string;
    contactPhone: string;
    website: string;
    logoUrl: string;
}

export default function OrganizationSettingsPage() {
    const [form, setForm] = useState<OrgProfile>({
        organizationName: "",
        contactEmail: "",
        contactPhone: "",
        website: "",
        logoUrl: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [statusMsg, setStatusMsg] = useState("");
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [logoImgError, setLogoImgError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchOrg = async () => {
            try {
                const data = await organizationApi.getMe();
                if (data.success && data.organization) {
                    const org = data.organization;
                    setForm({
                        organizationName: org.organizationName || "",
                        contactEmail: org.contactEmail || "",
                        contactPhone: org.contactPhone || "",
                        website: org.website || "",
                        logoUrl: org.logoUrl || "",
                    });
                    if (org.logoUrl) setLogoPreview(org.logoUrl);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchOrg();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (name === "logoUrl") {
            setLogoPreview(value || null);
            setLogoImgError(false); // Reset error when URL changes
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Limit to 2MB
        if (file.size > 2 * 1024 * 1024) {
            setStatus("error");
            setStatusMsg("Image is too large. Please use a file under 2MB.");
            setTimeout(() => setStatus("idle"), 4000);
            return;
        }

        const reader = new FileReader();
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string;
            setForm(prev => ({ ...prev, logoUrl: dataUrl }));
            setLogoPreview(dataUrl);
            setLogoImgError(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus("idle");
        try {
            await organizationApi.updateProfile({
                organizationName: form.organizationName,
                logoUrl: form.logoUrl,
                contactEmail: form.contactEmail,
                contactPhone: form.contactPhone,
                website: form.website,
            });
            setStatus("success");
            setStatusMsg("Profile updated successfully! Students will see the new logo on their next login.");
        } catch (err: any) {
            setStatus("error");
            setStatusMsg(err?.response?.data?.message || "Failed to save. Please try again.");
        } finally {
            setSaving(false);
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500 mx-auto mb-3" />
                    <p className="text-slate-400 text-sm">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                    <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Organization Settings</h1>
                </div>
                <p className="text-slate-400 text-sm ml-12">Update your profile details and organization logo.</p>
            </div>

            {/* Status Banner */}
            {status !== "idle" && (
                <div className={`mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium
                    ${status === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}>
                    {status === "success"
                        ? <CheckCircle className="h-4 w-4 shrink-0" />
                        : <AlertCircle className="h-4 w-4 shrink-0" />}
                    {statusMsg}
                </div>
            )}

            <div className="space-y-5">

                {/* === LOGO CARD === */}
                <div className="rounded-2xl bg-[#111827] border border-white/5 overflow-hidden">
                    <div className="px-6 pt-5 pb-4 border-b border-white/5">
                        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Image className="h-4 w-4 text-blue-400" />
                            Organization Logo
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">This logo appears in the student dashboard navbar alongside the Praedico brand.</p>
                    </div>

                    <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                        {/* Preview */}
                        <div className="flex-shrink-0">
                            <div className="h-24 w-24 rounded-2xl bg-[#1e293b] border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden relative">
                                {logoPreview ? (
                                    logoImgError ? (
                                        <div className="text-center px-2">
                                            <AlertCircle className="h-6 w-6 text-amber-500 mx-auto mb-1" />
                                            <span className="text-[9px] text-amber-500 leading-tight">Can&apos;t<br />preview</span>
                                        </div>
                                    ) : (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="h-full w-full object-contain p-1"
                                            onError={() => setLogoImgError(true)}
                                        />
                                    )
                                ) : (
                                    <div className="text-center">
                                        <Upload className="h-6 w-6 text-slate-600 mx-auto mb-1" />
                                        <span className="text-[10px] text-slate-600">Preview</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-600 text-center mt-2">Live Preview</p>
                        </div>

                        {/* URL input */}
                        <div className="flex-1 w-full">
                            <label className="block text-xs font-medium text-slate-400 mb-2">Logo URL</label>
                            <div className="flex gap-2">
                                <input
                                    type="url"
                                    name="logoUrl"
                                    value={form.logoUrl.startsWith('data:') ? '' : form.logoUrl}
                                    onChange={handleChange}
                                    placeholder="https://your-cdn.com/logo.png"
                                    className="flex-1 px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                />
                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    title="Upload from your computer"
                                    className="flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-[#1e293b] border border-slate-700/50 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-700/70 hover:border-blue-500/40 transition-all"
                                >
                                    <FolderOpen className="h-4 w-4" />
                                    <span className="hidden sm:inline">Browse</span>
                                </button>
                            </div>
                            {form.logoUrl.startsWith('data:') && (
                                <p className="text-[11px] text-emerald-500/80 mt-2 flex items-center gap-1.5">
                                    <CheckCircle className="h-3 w-3 shrink-0" />
                                    Local image uploaded successfully — ready to save.
                                </p>
                            )}
                            {logoImgError && logoPreview && !form.logoUrl.startsWith('data:') && (
                                <p className="text-[11px] text-amber-500/80 mt-2 flex items-center gap-1.5">
                                    <AlertCircle className="h-3 w-3 shrink-0" />
                                    Image couldn&apos;t load in preview (may be CORS or hotlink protected). The URL is still saved — make sure it&apos;s a direct public image link.
                                </p>
                            )}
                            {!logoImgError && !form.logoUrl.startsWith('data:') && (
                                <p className="text-[11px] text-slate-500 mt-2">
                                    Paste a direct image URL or click <strong className="text-slate-400">Browse</strong> to upload from your computer (max 2MB).
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* === DETAILS CARD === */}
                <div className="rounded-2xl bg-[#111827] border border-white/5 overflow-hidden">
                    <div className="px-6 pt-5 pb-4 border-b border-white/5">
                        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-blue-400" />
                            Basic Information
                        </h2>
                    </div>
                    <div className="p-6 space-y-5">

                        {/* Organization Name */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Organization Name</label>
                            <input
                                type="text"
                                name="organizationName"
                                value={form.organizationName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                placeholder="MIT Indore"
                            />
                        </div>

                        {/* Two-column row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    <Mail className="h-3 w-3 inline mr-1 text-slate-500" />
                                    Contact Email
                                </label>
                                <input
                                    type="email"
                                    name="contactEmail"
                                    value={form.contactEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                    placeholder="admin@org.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                    <Phone className="h-3 w-3 inline mr-1 text-slate-500" />
                                    Contact Phone
                                </label>
                                <input
                                    type="text"
                                    name="contactPhone"
                                    value={form.contactPhone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        {/* Website */}
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                <Globe className="h-3 w-3 inline mr-1 text-slate-500" />
                                Website
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0f172a] border border-slate-700/50 rounded-xl text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
                                placeholder="https://www.mit.edu"
                            />
                        </div>

                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-900/30 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                    {saving ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Saving Changes...</>
                    ) : (
                        <><Save className="h-4 w-4" /> Save Changes</>
                    )}
                </button>
            </div>
        </div>
    );
}
