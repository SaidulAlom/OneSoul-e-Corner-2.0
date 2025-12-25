import { collection, getDocs, addDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { ProfessionalService } from './types';

const defaultServices: Omit<ProfessionalService, 'id'>[] = [
  {
    title: 'Admission Consultancy',
    subtitle: 'Form fill-up / Apply',
    description: '<p>Expert guidance for admission processes across various universities and institutions. We help you navigate through complex admission procedures, fill out application forms correctly, and ensure all requirements are met.</p><ul><li>University admission assistance</li><li>Form filling support</li><li>Document verification</li><li>Application tracking</li></ul>',
    features: ['IGNOU Admission', 'NIOS Admission', 'University Applications', 'Form Filling Assistance', 'Document Verification', 'Application Tracking'],
    icon: 'GraduationCap',
    startingPrice: 499,
  },
  {
    title: 'Career Guidance',
    subtitle: 'Professional counseling',
    description: '<p>Comprehensive career counseling services to help you make informed decisions about your professional future. Get personalized advice based on your interests, skills, and career goals.</p><ul><li>Career assessment</li><li>Pathway planning</li><li>Skill development guidance</li><li>Job market insights</li></ul>',
    features: ['Career Assessment', 'Pathway Planning', 'Skill Development', 'Resume Building', 'Interview Preparation', 'Job Market Analysis'],
    icon: 'Briefcase',
    startingPrice: 799,
  },
  {
    title: 'Educational Consulting',
    subtitle: 'Academic support',
    description: '<p>Professional educational consulting services to help students and parents navigate the education system. From course selection to academic planning, we provide comprehensive support.</p><ul><li>Course selection guidance</li><li>Academic planning</li><li>Scholarship assistance</li><li>Study abroad consultation</li></ul>',
    features: ['Course Selection', 'Academic Planning', 'Scholarship Assistance', 'Study Abroad Guidance', 'Educational Counseling', 'Institution Selection'],
    icon: 'BookOpen',
    startingPrice: 999,
  },
  {
    title: 'Documentation Services',
    subtitle: 'Paperwork assistance',
    description: '<p>Professional documentation services to help you with all your paperwork needs. We assist with form filling, document preparation, and submission processes.</p><ul><li>Form filling assistance</li><li>Document preparation</li><li>Application submission</li><li>Follow-up support</li></ul>',
    features: ['Form Filling', 'Document Preparation', 'Application Submission', 'Follow-up Support', 'Verification Assistance', 'Status Tracking'],
    icon: 'FileText',
    startingPrice: 299,
  },
  {
    title: 'Training Programs',
    subtitle: 'Skill development',
    description: '<p>Comprehensive training programs designed to enhance your skills and boost your career prospects. We offer various training modules covering different professional skills.</p><ul><li>Professional skills training</li><li>Certification programs</li><li>Workshop sessions</li><li>Practical training</li></ul>',
    features: ['Professional Skills', 'Certification Programs', 'Workshop Sessions', 'Practical Training', 'Skill Assessment', 'Career Development'],
    icon: 'Users',
    startingPrice: 1299,
  },
  {
    title: 'Exam Preparation',
    subtitle: 'Test readiness',
    description: '<p>Expert exam preparation services to help you succeed in various competitive exams. We provide study materials, practice tests, and personalized guidance.</p><ul><li>Study materials</li><li>Practice tests</li><li>Mock exams</li><li>Personalized guidance</li></ul>',
    features: ['Study Materials', 'Practice Tests', 'Mock Exams', 'Personalized Guidance', 'Exam Strategies', 'Performance Analysis'],
    icon: 'ClipboardCheck',
    startingPrice: 599,
  },
  {
    title: 'Scholarship Assistance',
    subtitle: 'Financial aid support',
    description: '<p>Comprehensive scholarship assistance to help you find and apply for financial aid opportunities. We help identify suitable scholarships and guide you through the application process.</p><ul><li>Scholarship search</li><li>Application assistance</li><li>Document preparation</li><li>Follow-up support</li></ul>',
    features: ['Scholarship Search', 'Application Assistance', 'Document Preparation', 'Follow-up Support', 'Eligibility Check', 'Award Tracking'],
    icon: 'Award',
    startingPrice: 399,
  },
  {
    title: 'Resume Writing',
    subtitle: 'Professional CV',
    description: '<p>Professional resume writing services to help you create a compelling CV that stands out to employers. We craft resumes tailored to your industry and career goals.</p><ul><li>Resume creation</li><li>CV optimization</li><li>Cover letter writing</li><li>LinkedIn profile optimization</li></ul>',
    features: ['Resume Creation', 'CV Optimization', 'Cover Letter Writing', 'LinkedIn Optimization', 'ATS Optimization', 'Professional Review'],
    icon: 'FileEdit',
    startingPrice: 499,
  },
  {
    title: 'Interview Preparation',
    subtitle: 'Job readiness',
    description: '<p>Comprehensive interview preparation services to boost your confidence and improve your chances of success. We provide mock interviews, feedback, and tips.</p><ul><li>Mock interviews</li><li>Feedback sessions</li><li>Interview tips</li><li>Confidence building</li></ul>',
    features: ['Mock Interviews', 'Feedback Sessions', 'Interview Tips', 'Confidence Building', 'Question Preparation', 'Body Language Training'],
    icon: 'MessageSquare',
    startingPrice: 699,
  },
  {
    title: 'Study Abroad Consultation',
    subtitle: 'International education',
    description: '<p>Expert study abroad consultation services to help you pursue education in foreign countries. We assist with university selection, visa processes, and application procedures.</p><ul><li>University selection</li><li>Visa assistance</li><li>Application support</li><li>Pre-departure guidance</li></ul>',
    features: ['University Selection', 'Visa Assistance', 'Application Support', 'Pre-departure Guidance', 'Scholarship Search', 'Accommodation Help'],
    icon: 'Plane',
    startingPrice: 1999,
  },
  {
    title: 'Professional Development',
    subtitle: 'Career growth',
    description: '<p>Comprehensive professional development services to help you advance in your career. We offer coaching, mentoring, and skill development programs.</p><ul><li>Career coaching</li><li>Mentoring programs</li><li>Skill development</li><li>Leadership training</li></ul>',
    features: ['Career Coaching', 'Mentoring Programs', 'Skill Development', 'Leadership Training', 'Networking Opportunities', 'Career Planning'],
    icon: 'TrendingUp',
    startingPrice: 1499,
  },
];

export async function seedDefaultServices(firestore: Firestore): Promise<number> {
  try {
    // Check if services already exist
    const servicesRef = collection(firestore, 'services');
    const snapshot = await getDocs(servicesRef);
    
    if (snapshot.size > 0) {
      console.log(`Services collection already has ${snapshot.size} documents. Skipping seed.`);
      return 0;
    }

    // Add default services
    console.log('Seeding default services...');
    let addedCount = 0;
    
    for (const service of defaultServices) {
      try {
        await addDoc(servicesRef, service);
        addedCount++;
        console.log(`Added service: ${service.title}`);
      } catch (error) {
        console.error(`Failed to add service ${service.title}:`, error);
      }
    }

    console.log(`Successfully seeded ${addedCount} default services.`);
    return addedCount;
  } catch (error) {
    console.error('Error seeding default services:', error);
    throw error;
  }
}

