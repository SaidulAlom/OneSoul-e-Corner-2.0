
import Image from 'next/image';

import { getEBooks } from '@/lib/ebooks';
import { EBook } from '@/lib/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function EBookItem({ ebook }: { ebook: EBook }) {
  return (
    <Card className="bg-secondary/30 border border-white/10 backdrop-blur-md shadow-lg hover:border-primary/50 transition-colors duration-300 flex flex-col sm:flex-row gap-6 p-6">
        <div className="relative w-32 h-48 flex-shrink-0 mx-auto sm:mx-0">
            <Image src={ebook.coverImageUrl} alt={ebook.title} fill className="object-cover rounded-md"/>
        </div>
        <div className="flex-1 flex flex-col">
            <CardHeader className="p-0">
                <CardTitle className="text-lg font-semibold text-foreground">
                {ebook.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">by {ebook.author}</p>
            </CardHeader>
            <CardContent className="p-0 mt-2 flex-grow">
                <p className="text-muted-foreground line-clamp-3">{ebook.description}</p>
            </CardContent>
            <div className="mt-4">
                <Button asChild>
                    <a href={ebook.downloadUrl} target="_blank" rel="noopener noreferrer">Download</a>
                </Button>
            </div>
        </div>
      </Card>
  );
}

export default async function EBooksList() {
  const ebooks = await getEBooks();

  if (ebooks.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-secondary/20 rounded-lg">
        <h3 className="text-xl font-semibold">No E-Books Available... Yet!</h3>
        <p className="text-muted-foreground mt-2">Check back soon for new reading material.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {ebooks.map((ebook) => (
        <EBookItem key={ebook.id} ebook={ebook} />
      ))}
    </div>
  );
}
