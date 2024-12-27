import { ReactNode, useEffect, useState, useCallback } from "react";
import { createContext } from "use-context-selector";
import { api } from "../lib/axios";

interface Transaction {
  id: number,
  description: string,
  type: 'income' | 'outcome',
  price: number,
  category: string,
  createdAt: string
}

// eslint-disable-next-line react-refresh/only-export-components
export const TransactionsContext = createContext({} as TransactionsContextType);

interface TransactionsProviderProps {
    children: ReactNode
}

interface CreateTransactionInput {
    description: string;
    price: number;
    category: string;
    type: 'income' | 'outcome';
}

interface TransactionsContextType {
    transactions: Transaction[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>;
}




export function TransactionsProvider({ children }: TransactionsProviderProps) {

    const [transactions, setTransactions] = useState<Transaction[]>([]);

   const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
        params: {
            _sort: 'createdAt',
            _order: 'asc'
        }
    })

    const sortedData = response.data.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    let filteredData = sortedData;
    if (query) {
        filteredData = filteredData.filter((transaction: { description: string }) => {
            return transaction.description.toLowerCase().includes(query.toLowerCase());
        });
    }

    setTransactions(filteredData);
}, []);

    const createTransaction = useCallback(
        async (data: CreateTransactionInput) => {
            const { description, price, category, type } = data;
    
            const response = await api.post('transactions', {
                description,
                price,
                category,
                type,
                createdAt: new Date(),
           })
    
           setTransactions(state => [ response.data, ...state]);
        }, []
    )

    useEffect(() => {
        fetchTransactions();
    }, [])

    return (
        <TransactionsContext.Provider value={{ 
            transactions,
            fetchTransactions,
            createTransaction 
        }}>
            {children}
        </TransactionsContext.Provider>
    )
}