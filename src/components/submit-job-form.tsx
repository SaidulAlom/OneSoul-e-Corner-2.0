"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { Loader2, Check, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters."),
  companyName: z.string().min(2, "Company name must be at least 2 characters."),
  location: z.string().min(2, "Location is required."),
  description: z.string().min(20, "Description must be at least 20 characters."),
});

type FormStatus = "idle" | "loading" | "success" | "error";

export default function SubmitJobForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      companyName: "",
      location: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // UI-only simulation
    console.log(values);
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        form.reset();
      }, 3000);
    }, 2000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Senior Software Engineer" {...field} className="bg-background/50 focus:ring-primary focus:ring-2 focus:bg-background transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Nexus Corp" {...field} className="bg-background/50 focus:ring-primary focus:ring-2 focus:bg-background transition-all" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Remote or San Francisco, CA" {...field} className="bg-background/50 focus:ring-primary focus:ring-2 focus:bg-background transition-all" />
                </FormControl>
                 <FormDescription>
                  Specify if the job is remote, hybrid, or on-site.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about the role, responsibilities, and requirements..."
                  className="resize-none bg-background/50 h-40 focus:ring-primary focus:ring-2 focus:bg-background transition-all"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
            type="submit" 
            disabled={status !== "idle"}
            className="w-full text-lg py-6 rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_theme(colors.primary/0.5)] hover:shadow-[0_0_35px_theme(colors.primary)] transition-all duration-300 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.span
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
            >
              {status === "idle" && <><span className="mr-2">Submit Job Posting</span> <ArrowRight className="h-5 w-5"/></>}
              {status === "loading" && <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...</>}
              {status === "success" && <><Check className="mr-2 h-5 w-5" /> Submitted Successfully!</>}
            </motion.span>
          </AnimatePresence>
        </Button>
      </form>
    </Form>
  );
}
