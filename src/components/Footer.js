export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">
            Built by{' '}
            <a 
              href="https://www.linkedin.com/in/hirodkar/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
            >
              Tanmay Hirodkar
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
