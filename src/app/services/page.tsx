import ServicesList from '@/components/services/services-list';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ShieldCheck, Zap, Award } from 'lucide-react';

const professionalServicesFeatures = [
    {
      Icon: CheckCircle,
      title: 'Expert Guidance',
    },
    {
      Icon: ShieldCheck,
      title: 'Secure Payments',
    },
    {
      Icon: Zap,
      title: 'Quick Processing',
    },
];

const trustBadges = [
    {
        Icon: ShieldCheck,
        title: 'Secure Payments',
        description: '256-bit SSL encryption for all transactions',
    },
    {
        Icon: Award,
        title: 'Trusted Service',
        description: 'Over 1000+ satisfied customers',
    },
    {
        Icon: Zap,
        title: 'Quick Processing',
        description: 'Fast turnaround time guaranteed',
    },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-32">
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Services</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">Comprehensive solutions for all your business and personal needs</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
                {professionalServicesFeatures.map(feature => (
                    <Badge key={feature.title} variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-sm py-1 px-3">
                        <feature.Icon className="h-4 w-4 mr-2" />
                        {feature.title}
                    </Badge>
                ))}
            </div>
        </div>
      </div>
      
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Choose from 11 Professional Services</h2>
            <p className="mt-2 text-muted-foreground">Click on any service to view detailed information, pricing, and apply directly</p>
          </div>
          <ServicesList />
        </div>
      </div>

      <div className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {trustBadges.map(badge => (
                    <div key={badge.title} className="flex flex-col items-center">
                        <badge.Icon className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-xl font-semibold text-foreground">{badge.title}</h3>
                        <p className="text-muted-foreground">{badge.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
