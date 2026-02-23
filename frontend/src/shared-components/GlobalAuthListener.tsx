"use client";

import { useState, useEffect } from "react";
import LoginModal from "@/app/user/_components/LoginModal";
import { useRouter } from "next/navigation";

export default function GlobalAuthListener() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleUnauthorized = () => {
            // Only open the modal if we are not already on a dedicated login page
            // (if you eventually add one), otherwise just show the modal
            setIsLoginModalOpen(true);
        };

        window.addEventListener('open-login-modal', handleUnauthorized);

        // Optional: Also listen to a success event to close the modal if needed
        const handleLoginSuccess = () => {
            setIsLoginModalOpen(false);
            window.location.reload(); // Refresh state after login
        };
        window.addEventListener('login_success', handleLoginSuccess);

        return () => {
            window.removeEventListener('open-login-modal', handleUnauthorized);
            window.removeEventListener('login_success', handleLoginSuccess);
        };
    }, []);

    // Also handle switch to register if you have a register modal
    const handleSwitchToRegister = () => {
        setIsLoginModalOpen(false);
        // If you have a register route or modal, handle it here
        // For now, maybe just redirect to home or open a register modal
    };

    return (
        <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSwitchToRegister={handleSwitchToRegister}
        />
    );
}
