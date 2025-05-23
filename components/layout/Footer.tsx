import Link from 'next/link';
import { Code, Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/50 border-t border-border/20 py-6 px-6 md:px-8 flex flex-col">
      <div className="max-w-7xl mx-auto flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-500" />
              <span className="text-lg font-medium text-white">Ebrojevi API</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Skenirajte vaše deklaracije i saznajte koliko je zdrava hrana koju
              mislite konzumirati
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-4">Linkovi</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/pristup"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Baza Ebrojeva
                </Link>
              </li>
              <li>
                <Link
                  href="/api-docs"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  API Ebrojeva
                </Link>
              </li>
              <li>
                <Link
                  href="/arhive"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Vaši Skenovi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium text-white mb-4">Resursi</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <Link
                  href="/politika-privatnosti"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Politika Privatnosti
                </Link>
              </li>
              <li>
                <Link
                  href="/uvjeti-koristenja"
                  className="text-sm text-muted-foreground hover:text-white transition-colors"
                >
                  Uvjeti Korištenja
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 mt-6 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Ebrojevi API. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
