import { Outlet, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

export const LayoutAuth = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Minimal Header */}
      <header className="p-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <ArrowLeftOutlined /> Quay lại trang chủ
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white overflow-hidden transition-all hover:shadow-indigo-100/50">
          <Outlet />
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="p-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Clean Blog. Design with ❤ by Nakaisoft.</p>
      </footer>
    </div>
  );
}