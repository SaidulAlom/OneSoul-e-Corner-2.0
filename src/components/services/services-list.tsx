'use client';

import {
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Shield,
  CreditCard,
  FileSignature,
  Car,
  Newspaper,
  Wrench,
} from 'lucide-react';
import { Button } from '../ui/button';

const services = [
  {
    icon: GraduationCap,
    title: 'Admission Consultancy',
    subtitle: 'Form fill-up / Apply',
    features: ['IGNOU', 'NIOS', 'Universities', '+5 more services'],
  },
  {
    icon: Award,
    title: 'Scholarship',
    subtitle: 'Apply',
    features: ['NSP', 'Umbrella Scholarships', 'Stipend'],
  },
  {
    icon: Shield,
    title: 'Insurance Services',
    subtitle: 'Motor Insurance, Health Insurance',
    features: ['Bike', 'Car', 'Pick Up', '+2 more services'],
  },
  {
    icon: FileText,
    title: 'Entrance Exam',
    subtitle: 'Form Fill Up',
    features: ['NEET', 'IIT', 'NIT', '+5 more services'],
  },
  {
    icon: Briefcase,
    title: 'Job and Requirement Test',
    subtitle: 'Form Fill Up / Online Apply',
    features: ['APSSB', 'APPSC', 'UP Police', '+6 more services'],
  },
  {
    icon: Briefcase,
    title: 'Job and Placement',
    subtitle: 'Office of the placement, Resume, Bio-data, CV',
    features: [],
  },
  {
    icon: CreditCard,
    title: 'PAN Card and Election Card',
    subtitle: 'Apply',
    features: [],
  },
  {
    icon: FileSignature,
    title: 'Income Tax Return (ITR)',
    subtitle: 'Fill Up',
    features: [],
  },
  {
    icon: Newspaper,
    title: 'GST Registration',
    subtitle: 'New GST Apply',
    features: [],
  },
  {
    icon: Car,
    title: 'Driving License',
    subtitle: 'LL Apply, DL Apply',
    features: ['Form Fill Up', 'Challan', 'Documents Management'],
  },
  {
    icon: Wrench,
    title: 'new',
    subtitle: 'sadasdasd',
    features: ['asdasdasd', 'asdasdasddas'],
  },
];

export default function ServicesList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {services.map((service, index) => (
        <div key={index} className="bg-card text-card-foreground rounded-lg border shadow-sm p-6 flex flex-col">
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-primary/10 p-3 rounded-lg">
                <service.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <h3 className="font-bold text-lg">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.subtitle}</p>
            </div>
          </div>
          
          <div className="flex-grow space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300">
              Starting at ₹?
            </div>

            {service.features.length > 0 && (
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
      ))}
    </div>
  );
}
