import React, { forwardRef } from 'react';
import { Github } from 'lucide-react';

const Receipt = forwardRef(({ data }, ref) => {
    if (!data) return null;

    const {
        user, items, surcharge, date, time,
        codingStyle, dateRange, languageBreakdown,
        effortScore, footer, receiptId, terminalId
    } = data;

    const calculateTotal = () => {
        let subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
        let taxAmount = 0;

        if (surcharge) {
            if (surcharge.isPercentage) {
                taxAmount = subtotal * (surcharge.amount / 100);
            } else {
                taxAmount = surcharge.amount;
            }
        }

        return (subtotal + taxAmount).toFixed(2);
    };

    const renderEffortBar = (score) => {
        const totalBlocks = 15;
        const filledBlocks = Math.round((score / 100) * totalBlocks);
        const emptyBlocks = totalBlocks - filledBlocks;
        return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    };

    return (
        <div ref={ref} className="relative bg-white text-ink font-receipt p-6 w-full max-w-sm mx-auto shadow-2xl transform transition-transform duration-500">
            {/* Jagged Edges */}
            <div className="absolute top-0 left-0 w-full h-4 -mt-4 receipt-edge-top"></div>
            <div className="absolute bottom-0 left-0 w-full h-4 -mb-4 receipt-edge-bottom"></div>

            {/* Header */}
            <div className="text-center mb-6">
                <div className="flex justify-center items-center gap-2 mb-2">
                    <Github size={24} />
                    <h1 className="text-3xl font-bold tracking-widest">GITRECEIPT</h1>
                </div>
                <p className="text-sm uppercase">User: @{user.login}</p>
                <p className="text-sm uppercase">Style: {codingStyle}</p>
                <p className="text-sm uppercase">Period: {dateRange}</p>
                <div className="flex justify-between text-xs mt-2 px-4">
                    <span>{date}</span>
                    <span>{time}</span>
                </div>
            </div>

            {/* Divider */}
            <div className="border-b-2 border-dashed border-ink my-4"></div>

            {/* Items */}
            <div className="flex flex-col gap-2 text-lg uppercase">
                <div className="flex justify-between font-bold text-sm mb-2">
                    <span>QTY ITEM</span>
                    <span>AMT</span>
                </div>

                {items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <span>{String(item.qty).padEnd(3, ' ')}x {item.desc}</span>
                        <span>${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            {/* Language Breakdown */}
            {languageBreakdown && languageBreakdown.length > 0 && (
                <>
                    <div className="border-b-2 border-dashed border-ink my-4"></div>
                    <div className="text-sm uppercase">
                        <p className="font-bold mb-2">LANGUAGE USAGE</p>
                        {languageBreakdown.map((lang, index) => (
                            <div key={index} className="flex justify-between">
                                <span>{lang.lang}</span>
                                <span>{'.'.repeat(20 - lang.lang.length - String(lang.percent).length)} {lang.percent}%</span>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Divider */}
            <div className="border-b-2 border-dashed border-ink my-4"></div>

            {/* Surcharge */}
            {surcharge && (
                <div className="flex justify-between text-lg uppercase mb-4">
                    <span>{surcharge.label}</span>
                    <span>
                        {surcharge.isPercentage ? `${surcharge.amount}%` : `$${surcharge.amount.toFixed(2)}`}
                    </span>
                </div>
            )}

            {/* Effort Meter */}
            <div className="mb-4">
                <div className="flex justify-between text-sm font-bold uppercase mb-1">
                    <span>TOTAL EFFORT</span>
                    <span>{effortScore}%</span>
                </div>
                <div className="text-xs tracking-widest">
                    {renderEffortBar(effortScore)}
                </div>
            </div>

            {/* Total */}
            <div className="flex justify-between text-4xl font-bold uppercase mt-2 mb-6">
                <span>TOTAL</span>
                <span>${calculateTotal()}</span>
            </div>

            {/* Footer */}
            <div className="text-center space-y-2">
                <div className="barcode h-12 w-full opacity-80 mb-2"></div>
                <p className="text-xs font-bold">SCAN FOR SOURCE</p>
                <p className="text-sm uppercase font-bold mt-4">{footer}</p>

                <div className="flex justify-between text-xs mt-4 text-zinc-500">
                    <span>RECEIPT ID: {receiptId}</span>
                    <span>TERM: {terminalId}</span>
                </div>

                <p className="text-xs mt-4">git-receipt.vercel.app</p>
            </div>
        </div>
    );
});

Receipt.displayName = 'Receipt';

export default Receipt;
