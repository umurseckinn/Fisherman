import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display">404 Lost at Sea</h1>
        <p className="text-gray-600 mb-8">This island doesn't exist on our maps.</p>
        <Link href="/">
          <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-primary hover:bg-primary/90 transition-colors">
            Return Home
          </a>
        </Link>
      </div>
    </div>
  );
}
