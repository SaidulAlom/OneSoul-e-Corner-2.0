'use client';

import * as LucideIcons from 'lucide-react';
import { collection } from 'firebase/firestore';
import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { ProfessionalService } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Settings } from 'lucide-react';
import { seedDefaultServices } from '@/lib/seed-services';

function ServiceItem({ service }: { service: ProfessionalService }) {
    const Icon = (LucideIcons as any)[service.icon] || Settings;
    // Show first 3 features, then "+X more" if there are more
    const displayedFeatures = service.features?.slice(0, 3) || [];
    const remainingCount = (service.features?.length || 0) - 3;

    return (
        <div className="bg-white dark:bg-card text-card-foreground rounded-lg border shadow-sm p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            {/* Header with Icon and Title */}
            <div className="flex items-start gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/20 border border-primary/30 flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground leading-tight">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{service.subtitle}</p>
                </div>
            </div>
            
            {/* Pricing Badge with Horizontal Line */}
            <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-primary/20"></div>
                <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300 whitespace-nowrap">
                    Starting at ₹{service.startingPrice}
                </div>
            </div>

            {/* Services Included Section */}
            {service.features && service.features.length > 0 && (
                <div className="flex-grow mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <h4 className="font-semibold text-sm text-foreground">Services Included:</h4>
                    </div>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                        {displayedFeatures.map((feature, fIndex) => (
                            <li key={fIndex} className="flex items-start">
                                <span className="text-primary mr-2 mt-0.5 flex-shrink-0">•</span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    {remainingCount > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">+{remainingCount} more services</p>
                    )}
                </div>
            )}

            {/* View Details & Apply Button */}
            <div className="mt-auto pt-4">
                <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:via-primary/80 hover:to-primary/70 text-white font-semibold rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                    <Link href={`/services/${service.id}`}>
                        View Details & Apply
                    </Link>
                </Button>
            </div>
        </div>
    );
}

function ServicesListSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border shadow-sm p-6 flex flex-col h-full">
                    <div className="flex items-start gap-3 mb-4">
                        <Skeleton className="w-9 h-9 rounded-lg" />
                        <div className="flex-1">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    </div>
                    <Skeleton className="h-6 w-24 mb-4" />
                    <div className="space-y-2 mb-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                    <Skeleton className="h-10 w-full mt-auto" />
                </div>
            ))}
        </div>
    );
}

export default function ServicesList() {
    const firestore = useFirestore();
    const [isSeeding, setIsSeeding] = useState(false);

    // Use collection without orderBy to avoid index requirement, sort client-side
    const servicesCollectionQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'services');
    }, [firestore]);

    const { data: services, isLoading, error } = useCollection<ProfessionalService>(servicesCollectionQuery);

    // Auto-seed default services if collection is empty
    useEffect(() => {
        if (!firestore || isLoading || isSeeding) return;
        
        if (services && services.length === 0) {
            setIsSeeding(true);
            seedDefaultServices(firestore)
                .then((count) => {
                    if (count > 0) {
                        console.log(`Auto-seeded ${count} default services`);
                    }
                })
                .catch((error) => {
                    console.error('Failed to seed default services:', error);
                })
                .finally(() => {
                    setIsSeeding(false);
                });
        }
    }, [firestore, services, isLoading, isSeeding]);

    // Sort services client-side by title
    const sortedServices = useMemo(() => {
        if (!services) return null;
        return [...services].sort((a, b) => {
            const titleA = a.title?.toLowerCase() || '';
            const titleB = b.title?.toLowerCase() || '';
            return titleA.localeCompare(titleB);
        });
    }, [services]);

    // Debug logging
    useEffect(() => {
        console.log('=== SERVICES DEBUG ===');
        console.log('Firestore instance:', firestore ? 'Available' : 'Not available');
        console.log('Loading:', isLoading);
        console.log('Has Error:', !!error);
        if (error) {
            console.error('Error details:', error);
            console.error('Error code:', (error as any)?.code);
            console.error('Error message:', error.message);
        }
        console.log('Services count:', services?.length || 0);
        if (services) {
            console.log('Services data:', services);
            if (services.length > 0) {
                console.log('First service:', services[0]);
            }
        }
        console.log('========================');
    }, [services, error, isLoading]);

    if (isLoading) {
        return <ServicesListSkeleton />;
    }

    if (error) {
        console.error('Error fetching services:', error);
        const errorCode = (error as any)?.code;
        const isIndexError = error.message?.includes('index') || errorCode === 'failed-precondition';
        
        return (
            <div className="col-span-full text-center py-10 px-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <h3 className="text-xl font-semibold text-destructive">Error Loading Services</h3>
                <p className="text-muted-foreground mt-2">
                    {error.message || 'Failed to load services. Please try refreshing the page.'}
                </p>
                {isIndexError && (
                    <p className="text-sm text-muted-foreground mt-2">
                        A Firestore index may need to be created. Check the browser console for the index link, or create services without ordering.
                    </p>
                )}
                <p className="text-xs text-muted-foreground mt-4">
                    Error Code: {errorCode || 'unknown'}
                </p>
            </div>
        );
    }

    if (!sortedServices || sortedServices.length === 0) {
        return (
            <div className="col-span-full text-center py-10 px-4 bg-secondary/20 rounded-lg">
                <h3 className="text-xl font-semibold">No Services Available</h3>
                <p className="text-muted-foreground mt-2">
                    {isLoading ? 'Loading services...' : 'No services have been created yet. Please create services from the admin panel.'}
                </p>
                {!isLoading && (
                    <p className="text-sm text-muted-foreground mt-4">
                        Go to <strong>/admin/services</strong> to create your first service.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedServices.map((service) => (
                <ServiceItem key={service.id} service={service} />
            ))}
        </div>
    );
}
