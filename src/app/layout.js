import './globals.css';

export const metadata = {
  title: 'Birthday Surprise Creator',
  description: 'Create a magical interactive birthday surprise for someone special',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
