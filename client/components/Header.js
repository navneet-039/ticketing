import Link from 'next/link';

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && {label:'My Orders',href:'/orders'},
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ].filter(Boolean);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          GitTix
        </Link>

        {/* Right Side Links */}
        <div className="flex items-center space-x-6">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-gray-600 hover:text-blue-600 font-medium transition"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
