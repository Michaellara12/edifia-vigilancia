import React, { createContext, useState, useContext } from "react";

// // ----------------------------------------------------------------------

interface LoadingContextProps {
    loading: boolean;
    setLoading: (value: boolean) => void;
    open: boolean;
    setOpen: (value: boolean) => void;
    handleClose: () => void;
    handleOpen: () => void;
}

const LoadingContext = createContext<LoadingContextProps | null>(null);

interface DashboardLoadingContextProps {
    children: React.ReactNode;
}

export const DashboardLoadingContext = ({ children }: DashboardLoadingContextProps) => {
    const [loading, setLoading] = useState(false);

    const [open, setOpen] = useState(false)
    
    const handleOpen = () => {
        setOpen(true);
    };

    function handleClose() {
        setOpen(false)
    }

    return (
        <LoadingContext.Provider
            value={{
                loading,
                setLoading,
                open,
                setOpen,
                handleOpen,
                handleClose
            }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

export default DashboardLoadingContext;

// // ----------------------------------------------------------------------

export const useDashboardLoadingContext = () => {
    const context = useContext(LoadingContext);

    if (!context) throw new Error('Unexpected context error');

    return context
}


