import { useState, useEffect } from "react";

type FetchFunction<T> = () => Promise<T>;

export const useFetch = <T>(fetchFunction: FetchFunction<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Reset error before fetching
            try {
                const result = await fetchFunction();
                setData(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchFunction]); // Re-run if the fetch function changes

    return { data, loading, error };
};
