
import * as LucideIcons from 'lucide-react';

import { getServices } from '@/lib/services';
import { ProfessionalService } from '@/lib/types';
import { Button } from '@/components/ui/button';

function ServiceItem({ service }: { service: ProfessionalService }) {
    const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Briefcase;

    return (
        <div className="bg-card text-card-foreground rounded-lg border shadow-sm p-6 flex flex-col">
            <div className="flex items-start gap-4 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.subtitle}</p>
                </div>
            </div>
            
            <div className="flex-grow space-y-4">
                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
                Starting at ₹{service.startingPrice}
                </div>

                {service.features && service.features.length > 0 && (
                    <div>
                        <h4 className="font-semibold text-sm mb-2">Services Included:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {service.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-center">
                                    <span className="text-primary mr-2">•</span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="mt-6">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">View Details & Apply</Button>
            </div>
        </div>
    );
}

export default async function ServicesList() {
    const services = await getServices();

    if (services.length === 0) {
        return (
            <div className="col-span-full text-center py-10 px-4 bg-secondary/20 rounded-lg">
                <h3 className="text-xl font-semibold">No Services Available</h3>
                <p className="text-muted-foreground mt-2">Please check back later.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {services.map((service) => (
                <ServiceItem key={service.id} service={service} />
            ))}
        </div>
    );
}
