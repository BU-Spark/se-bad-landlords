import { useRouter } from 'next/router'

export default function Navbar() {
    
    const router = useRouter()

    const navigateTo = (path: string) => {
        router.push(path);
    };

    const isActive = (path: string) => {
        return router.pathname === path;
    };

    return (
        <nav className="flex flex-col md:flex-row text-sm font-bold items-center border-b-1 border-[#021C66] shadow md:h-14 w-full">
            {/* logo */}
            <img src="/logo.svg" alt="Logo" className="px-4 mt-5 mb-2 md:my-0" />

            {/* navigation buttons */}
            <div className="flex md:flex-row ml-auto mr-4 my-2 md:my-0 w-full md:w-auto justify-center">
                <button 
                    onClick={() => navigateTo('/')} 
                    className={`mx-2 text-[#58585B] hover:text-white hover:bg-navbar-orange px-4 py-1 rounded-3xl ${isActive('/') ? 'text-white bg-navbar-orange' : ''}`}
                >
                    HOME
                </button>
                <button 
                    onClick={() => navigateTo('/landlords')} 
                    className={`mx-2 text-[#58585B] hover:text-white hover:bg-navbar-orange px-4 py-1 rounded-3xl ${isActive('/landlords') ? 'text-white bg-navbar-orange' : ''}`}
                >
                    LANDLORDS
                </button>
                <button 
                    onClick={() => navigateTo('/map')} 
                    className={`mx-2 text-[#58585B] hover:text-white hover:bg-navbar-orange px-4 py-1 rounded-3xl ${isActive('/map') ? 'text-white bg-navbar-orange' : ''}`}
                >
                    MAP
                </button>
            </div>
        </nav>
    );
}