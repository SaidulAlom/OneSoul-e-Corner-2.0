"use client";

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Book, Briefcase, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';

const FloatingElement = ({ children, className, depth }: { children: React.ReactNode, className?: string, depth: number }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 200 };

    const dx = useSpring(useTransform(mouseX, [0, 1], [-depth, depth]), springConfig);
    const dy = useSpring(useTransform(mouseY, [0, 1], [-depth, depth]), springConfig);

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                mouseX.set(x / (rect.width/2));
                mouseY.set(y / (rect.height/2));
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div ref={ref} style={{ x: dx, y: dy }} className={className}>
            {children}
        </motion.div>
    );
};

export default function HeroSection() {
    return (
        <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-background">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-secondary/20 to-background" />
             <div className="absolute inset-0 z-1 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            <div className="absolute inset-0 z-0 opacity-40">
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary/50 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute top-1/2 right-10 w-72 h-72 bg-accent/50 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-secondary/50 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <FloatingElement depth={10} className="absolute top-[15%] left-[10%] z-10">
                <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 flex items-center justify-center">
                    <Book className="w-12 h-12 text-primary opacity-70"/>
                </div>
            </FloatingElement>
             <FloatingElement depth={15} className="absolute bottom-[20%] left-[25%] z-10">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-3 flex items-center justify-center">
                    <Briefcase className="w-8 h-8 text-accent opacity-70"/>
                </div>
            </FloatingElement>
             <FloatingElement depth={-10} className="absolute top-[25%] right-[15%] z-10">
                <div className="w-20 h-20 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 p-4 flex items-center justify-center transform rotate-12">
                     <Newspaper className="w-10 h-10 text-primary opacity-70"/>
                </div>
            </FloatingElement>
             <FloatingElement depth={-15} className="absolute bottom-[15%] right-[10%] z-10">
                <div className="w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-4 flex items-center justify-center transform -rotate-12"/>
            </FloatingElement>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
                className="relative z-20 text-center px-4"
            >
                <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter"
                    style={{
                        textShadow: `
                            0px 1px 1px rgba(255,255,255,0.1),
                            0px 2px 2px rgba(0,0,0,0.5),
                            0px 4px 4px rgba(0,0,0,0.4),
                            0px 8px 8px rgba(0,0,0,0.3),
                            0px 12px 12px rgba(0,0,0,0.2)
                        `
                    }}
                >
                    <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        Unlock Your
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Future Potential
                    </span>
                </h1>
                <p className="mt-6 max-w-xl mx-auto text-lg md:text-xl text-muted-foreground">
                    NexusEd is your all-in-one platform for education, jobs, news, and services, designed to propel you forward.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button size="lg" className="w-full sm:w-auto rounded-full text-lg px-8 py-6 bg-primary text-primary-foreground shadow-[0_0_20px_theme(colors.primary/0.5)] hover:shadow-[0_0_35px_theme(colors.primary)] transition-all duration-300">
                            Get Started <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full text-lg px-8 py-6 bg-transparent border-2 hover:bg-white/10 hover:text-white transition-colors">
                            Explore Services
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
