import ContactForm from '@/components/contact/contact-form';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="text-center mb-16">
          <h1 className="font-headline text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help and answer any question you might have. We look forward to hearing from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
             <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Email</h3>
                    <p className="text-muted-foreground">Our support team is here to help.</p>
                    <a href="mailto:support@nexused.com" className="text-primary hover:underline">support@nexused.com</a>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                    <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">Mon-Fri from 9am to 5pm.</p>
                    <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-890</a>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/20 border border-primary/30">
                    <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-foreground">Office</h3>
                    <p className="text-muted-foreground">123 Innovation Drive, Tech City, 12345</p>
                    <a href="#" className="text-primary hover:underline">Get Directions</a>
                </div>
            </div>
          </div>
          <div className="relative p-8 rounded-3xl bg-secondary/20 border border-white/10 backdrop-blur-md shadow-2xl shadow-black/20">
            <h3 className="text-2xl font-bold text-center mb-6">Send us a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
