import Image from 'next/image';
import { Users, Target, Book, TrendingUp } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Founder & CEO',
    image: PlaceHolderImages.find(img => img.id === 'vlog-thumbnail-3') || { imageUrl: 'https://picsum.photos/seed/person1/400/400', description: 'Team member photo', imageHint: 'person portrait' },
  },
  {
    name: 'Samantha Lee',
    role: 'Head of Product',
    image: { imageUrl: 'https://picsum.photos/seed/person2/400/400', description: 'Team member photo', imageHint: 'person portrait' },
  },
  {
    name: 'David Chen',
    role: 'Lead Engineer',
    image: { imageUrl: 'https://picsum.photos/seed/person3/400/400', description: 'Team member photo', imageHint: 'person portrait' },
  },
];

const values = [
    {
      icon: Target,
      title: 'Accessibility',
      description: 'Making education and career opportunities available to everyone, everywhere.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Continuously pushing the boundaries of what\'s possible in educational technology.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Fostering a supportive network of learners, educators, and professionals.',
    },
     {
      icon: Book,
      title: 'Knowledge',
      description: 'Promoting lifelong learning as a cornerstone of personal and professional growth.',
    },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-5xl px-4 space-y-24">
        
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About NexusEd
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            We are dedicated to building a future where knowledge and opportunity are accessible to all, breaking down barriers to create a global community of learners and leaders.
          </p>
        </div>

        {/* Our Mission */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl shadow-black/30">
                <Image 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGNvbGxhYm9yYXRpbmd8ZW58MHx8fHwxNzY2MjA4MzQxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Our Mission"
                    data-ai-hint="students collaborating"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div>
                <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground">Our Mission</h2>
                <p className="mt-4 text-muted-foreground text-lg">
                    Our mission is to empower individuals worldwide by providing a comprehensive platform for education, career development, and lifelong learning. We believe that by connecting people with the right resources, we can unlock their full potential and create a brighter future for everyone.
                </p>
            </div>
        </div>

        {/* Our Story */}
         <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
                <h2 className="font-headline text-4xl font-bold tracking-tight text-foreground">Our Story</h2>
                <p className="mt-4 text-muted-foreground text-lg">
                    Founded in a dorm room by a group of passionate students, NexusEd started as a simple idea: to make high-quality educational content and career opportunities more accessible. Frustrated by fragmented resources, we envisioned a single, unified platform. Today, NexusEd has grown into a global community, but our core vision remains the same.
                </p>
            </div>
             <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl shadow-black/30 order-1 md:order-2">
                <Image 
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjb21tdW5pdHl8ZW58MHx8fHwxNzY2MjA4NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Our Story"
                    data-ai-hint="community hands"
                    fill
                    className="object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
        </div>

        {/* Our Values */}
        <div>
            <div className="text-center mb-12">
                <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Our Core Values</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                    The principles that guide our work and our community.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value) => (
                    <div key={value.title} className="text-center p-6 rounded-2xl bg-secondary/30 border border-white/10 shadow-lg">
                        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/20 border border-primary/30 mb-4">
                            <value.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                        <p className="mt-2 text-muted-foreground">{value.description}</p>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Team Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">Meet the Team</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              The passionate individuals behind NexusEd.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="group relative text-center">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg transform transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={member.image.imageUrl}
                    alt={member.name}
                    data-ai-hint={member.image.imageHint}
                    width={200}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                  <p className="text-primary">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
