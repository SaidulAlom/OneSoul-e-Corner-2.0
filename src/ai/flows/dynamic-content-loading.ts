'use server';

/**
 * @fileOverview This file defines a Genkit flow for dynamically loading relevant content based on user interactions and preferences.
 *
 * The flow analyzes user interactions and preferences to determine the most relevant content to display, such as news articles, job listings, or learning materials.
 *
 * - `dynamicContentLoading`: An async function that takes user interaction data as input and returns a list of relevant content.
 * - `DynamicContentLoadingInput`: The input type for the `dynamicContentLoading` function, representing user interaction data.
 * - `DynamicContentLoadingOutput`: The output type for the `dynamicContentLoading` function, representing a list of relevant content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';


const DynamicContentLoadingInputSchema = z.object({
  userInteractions: z.string().describe('A string containing the history of user interactions, such as clicks, searches, and content views.'),
  contentType: z.enum(['news', 'jobs', 'learning', 'services']).default('news').describe('The type of content to load dynamically.'),
});

export type DynamicContentLoadingInput = z.infer<typeof DynamicContentLoadingInputSchema>;

const DynamicContentLoadingOutputSchema = z.object({
  relevantContent: z.array(z.string()).describe('A list of relevant content items based on user interactions and preferences.'),
});

export type DynamicContentLoadingOutput = z.infer<typeof DynamicContentLoadingOutputSchema>;

export async function dynamicContentLoading(input: DynamicContentLoadingInput): Promise<DynamicContentLoadingOutput> {
  return dynamicContentLoadingFlow(input);
}

const dynamicContentLoadingPrompt = ai.definePrompt({
  name: 'dynamicContentLoadingPrompt',
  input: {schema: DynamicContentLoadingInputSchema},
  output: {schema: DynamicContentLoadingOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized content recommendations.

  Based on the user's past interactions and preferences, identify the most relevant content to display.

  The user interaction history is as follows: {{{userInteractions}}}

  The content type requested is: {{{contentType}}}

  Please provide a list of content relevant to the user, tailored to their interests.
  Ensure the content is appropriate for the specified content type. Content should be very short, about 20 words per listing.
  Example of a good listing (news): "Local school board approves new STEM curriculum after community debate."
  Example of a good listing (jobs): "Senior Software Engineer position open at Google; requires 5+ years of experience."
  Example of a good listing (learning): "Introductory course to Python programming now available; learn basic syntax."
  Example of a good listing (services): "AI-powered resume builder to help you land your dream job."
  `,
});

const dynamicContentLoadingFlow = ai.defineFlow(
  {
    name: 'dynamicContentLoadingFlow',
    inputSchema: DynamicContentLoadingInputSchema,
    outputSchema: DynamicContentLoadingOutputSchema,
  },
  async input => {
    const {output} = await dynamicContentLoadingPrompt(input);
    return output!;
  }
);
