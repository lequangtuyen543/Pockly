import React from 'react';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/lib/storage';

type TransactionTableProps = {
  groupedTransactions: Record<string, Transaction[]>;
  handleEdit: (transaction: Transaction) => void;
  handleDelete: (transaction: Transaction) => void;
  getCategoryIcon: (categoryId: string) => string;
  getCategoryName: (categoryId: string) => string;
};

const TransactionTable: React.FC<TransactionTableProps> = ({
  groupedTransactions,
  handleEdit,
  handleDelete,
  getCategoryIcon,
  getCategoryName,
}) => {
  const hasTransactions = Object.keys(groupedTransactions).length > 0;

  if (!hasTransactions) {
    return (
      <div className="text-center py-16">
        <div className="text-4xl mb-2" style={{ color: '#c96442' }}>📝</div>
        <p className="font-body-sm text-body-sm" style={{ color: '#5f5e5a' }}>No transactions yet</p>
        <p className="font-body-sm text-body-sm" style={{ color: '#5f5e5a' }}>Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-xl">
      {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
        <section key={date}>
          <h2 className="font-label-caps text-label-caps text-secondary mb-md tracking-widest uppercase">
            {date}
          </h2>
          <div className="card-ivory rounded-xl overflow-hidden ring-subtle">
            {dayTransactions.map((transaction, index) => (
              <div key={transaction.id}>
                <div
                  className="flex items-center justify-between p-md hover:bg-[#faf9f5] transition-colors relative z-10"
                  style={{
                    borderLeft: `4px solid ${transaction.type === 'income' ? '#004f50' : '#c96442'}`,
                    backgroundColor: 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#faf9f5'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  <div className="flex items-center gap-md">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#fdeae4', border: '1px solid #e8e6dc' }}
                    >
                      <span className="material-symbols-outlined" style={{ color: '#c96442' }}>{getCategoryIcon(transaction.category)}</span>
                    </div>
                    <div>
                      <h3 className="font-body-lg font-semibold text-on-surface">{getCategoryName(transaction.category)}</h3>
                      {transaction.note && (
                        <p className="font-body-sm text-body-sm" style={{ color: '#5f5e5a' }}>{transaction.note}</p>
                      )}
                      <p className="text-xs" style={{ color: '#a8a29e' }}>{format(new Date(transaction.date), 'HH:mm')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-body-lg font-bold ${transaction.type === 'income' ? 'text-[#004f50]' : 'text-[#c96442]'}`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-xs hover:text-[#c96442] transition-colors"
                        style={{ color: '#a8a29e' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction)}
                        className="text-xs hover:text-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
                {index < dayTransactions.length - 1 && (
                  <div className="h-px mx-md" style={{ backgroundColor: '#e8e6dc' }}></div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TransactionTable;