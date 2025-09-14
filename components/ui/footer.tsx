import { Stethoscope } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">ElitorcAI</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 ElitorcAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
