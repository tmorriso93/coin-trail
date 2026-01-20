"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import numeral from "numeral";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

export function CashflowContent({
    annualCashflow
}: {
    annualCashflow: {month: number; income: number; expenses: number}[];
}) {
    const today = new Date();
    const totalAnnualIncome = annualCashflow.reduce((prevValue: number, month) => {
        return prevValue + month.income;
    }, 0);
    const totalAnnualExpenses = annualCashflow.reduce((prevValue: number, month) => {
        return prevValue + month.expenses;
    }, 0);
    const balance = totalAnnualIncome - totalAnnualExpenses;

    return (
        <div className="flex flex-col gap-4 md:flex-row">
        <ChartContainer config={{
        income: {
            label: "Income",
            color: "#84cc16"
        },
        expenses: {
            label: "Expenses",
            color: "#f97316"
        },
        }}
        className="w-full h-[300px]"
        >
            <BarChart data={annualCashflow}>
                <CartesianGrid vertical={false} />
                <YAxis tickFormatter={(value) => {
                    return `$${numeral(value).format("0,0")}`
                }} />
                <XAxis dataKey="month" tickFormatter={(value) => {
                    return format(new Date(today.getFullYear(), value -1, 1), "MMM")
                }} />
                    <ChartTooltip content={
                        <ChartTooltipContent labelFormatter={(value, payload) => {
                            console.log({ value, payload });
                            const month = payload[0]?.payload?.month;
                            return <div>
                                {format(new Date(today.getFullYear(), month -1, 1), "MMM")}
                            </div>;
                        }} />
                    } />
                    <Legend
                        verticalAlign="top"
                        align="center"
                        height={30}
                        wrapperStyle={{ width: "100%", left: 0, right: 0 }}
                        content={({ payload }) => (
                            <div className="flex w-full justify-center md:justify-end gap-4 text-sm">
                                {payload?.map((entry) => (
                                    <div key={entry.value} className="flex items-center gap-2">
                                        <span
                                            className="inline-block size-2.5 rounded-full"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="capitalize text-primary">{entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                <Bar dataKey="income" radius={4} fill="var(--color-income)" />
                <Bar dataKey="expenses" radius={4} fill="var(--color-expenses)" />
            </BarChart>
        </ChartContainer>
        <div
            id="cashSummary"
            className="order-first flex flex-col gap-4 border-b pb-4 md:order-none md:border-b-0 md:border-l md:px-4 md:pb-0"
        >
            <div>
                <span className="text-muted-foreground font-bold text-sm">income</span>
                <h2 className="text-3xl">
                    ${numeral(totalAnnualIncome).format("0,0[.]00")}
                </h2>
            </div>
            <div className="border-t" />
            <div>
                <span className="text-muted-foreground font-bold text-sm">Expenses</span>
                <h2 className="text-3xl">
                    ${numeral(totalAnnualExpenses).format("0,0[.]00")}
                </h2>
            </div>
             <div className="border-t" />
            <div>
                <span className="text-muted-foreground font-bold text-sm">Balance</span>
                <h2 className={cn("text-3xl font-bold", balance >= 0 ? "text-lime-500" : "text-orange-500"           
                )}
                >
                    ${numeral(balance).format("0,0[.]00")}
                </h2>
            </div>
        </div>
        </div>
    )
}
