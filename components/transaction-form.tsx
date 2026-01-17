"use client";

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "./ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { Input } from "./ui/input";
import { type Category } from "@/types/Category";


export const transactionFormSchema = z.object({
    transactionType: z.enum(["income", "expense"]),
    categoryId: z.coerce.number().positive("Please select a category"),
    transactionDate: z.coerce.date().max(addDays(new Date(), 1), "Transaction date cannot be in the future"),
    amount: z.coerce.number().positive("Amount must be greater than zero"),
    description: z.string()
    .min(3, "Description must contain at least 3 characters")
    .max(300, "Description must contain at most 300 characters"),
});

type Props = {
  categories: Category[];
  onSubmit?: (data: z.infer<typeof transactionFormSchema>) => Promise<void> | void;
  defaultValues?: {
    transactionType: "income" | "expense",
    amount: number;
    categoryId: number;
    description: string;
    transactionDate: Date;
  }
};

type TransactionFormValues = z.input<typeof transactionFormSchema>;
type TransactionFormOutput = z.output<typeof transactionFormSchema>;


export default function TransactionForm({ 
    categories, 
    onSubmit, 
    defaultValues 
}: Props) {
  const form = useForm<TransactionFormValues, undefined, TransactionFormOutput>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: 0,
      categoryId: 0,
      description: "",
      transactionDate: new Date(),
      transactionType: "income",
      ...defaultValues,
    },
  });



    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const transactionType = form.watch("transactionType");
    const filteredCategories = categories.filter((category) => {
        if (!transactionType) return true;
        return category.type === transactionType;
    });
    const handleSubmit = React.useCallback(
        async (data: z.infer<typeof transactionFormSchema>) => {
            if (onSubmit) {
                await onSubmit(data);
                return;
            }
            console.log({ data });
        },
        [onSubmit]
    );

  return ( 
  <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)}>
        <fieldset disabled={form.formState.isSubmitting} className="grid grid-cols-2 gap-y-5 gap-x-2">
        <FormField 
        control={form.control} 
        name="transactionType" 
        render={({field}) => {
        return (
            <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <FormControl>
                    <Select onValueChange={(newValue) => {
                        field.onChange(newValue);
                        form.setValue("categoryId", 0);
                        }} 
                        value={field.value}
                        >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="income">Income</SelectItem>
                                <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>     
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        );
    }}
        />

    <FormField 
            control={form.control} 
            name="categoryId" 
            render={({field}) => {
        return (
            <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                    <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={field.value == null ? "" : String(field.value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredCategories.length === 0 ? (
                                    <SelectItem value="0" disabled>
                                        No categories found
                                    </SelectItem>
                                ) : (
                                    filteredCategories.map((category) => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>     
                    </Select>
                </FormControl>
                <FormMessage />
            </FormItem>
        );
    }}
    />

    <FormField 
            control={form.control} 
            name="transactionDate" 
            render={({field}) => {
        return (
            <FormItem>
                <FormLabel>Transaction Date</FormLabel>
                <FormControl>

                     <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className={cn( 
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                        >
                            {date ? date.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon className="mr-2 h-4 w-4" />
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                            }}
                            disabled={{
                                after: new Date(),
                            }}
                        />
                        </PopoverContent>
                    </Popover>

                </FormControl>
                <FormMessage />
            </FormItem>
        );
    }}
    />

     <FormField 
            control={form.control} 
            name="amount" 
            render={({field}) => {
        return (
            <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                    {/* <Input {...field} type="number" /> */}
                    <Input
                        type="number"
                        value={field.value == null ? "" : String(field.value)}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                        />
                </FormControl>
                <FormMessage />
            </FormItem>
        );
    }}
    />
    </fieldset>
    <fieldset  disabled={form.formState.isSubmitting} className="mt-5 flex flex-col gap-5">
         <FormField 
            control={form.control} 
            name="description" 
            render={({field}) => {
        return (
            <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                    {/* <Input {...field} type="number" /> */}
                    <Input
                        {...field}
                        // type="number"
                        // value={field.value == null ? "" : String(field.value)}
                        // onChange={(event) => field.onChange(Number(event.target.value))}
                        />
                </FormControl>
                <FormMessage />
            </FormItem>
        );
    }}
    />
    <Button type="submit">
        Submit
    </Button>
    </fieldset>
    </form>
  </Form>
    );
}
  
