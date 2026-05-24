import AIMessageGenerator from '@/components/AIMessageGenerator';

export const metadata = {
  title: 'AI Birthday Message Generator',
  description: 'Generate a personalized birthday message with AI.',
};

export default function AIMessagePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-12">
      <AIMessageGenerator />
    </main>
  );
}
