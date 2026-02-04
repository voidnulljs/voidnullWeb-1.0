import { useRouter } from 'next/router';
import Logo from '../Global/Logo';
import Link from 'next/link';

export default function Header() {
    const router = useRouter();
    
    return (
        <>
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center space-x-5 w-full">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <ul className="space-x-4 flex-1 justify-end sm:justify-start flex items-center">
                        <li>
                            <Link href="/" className={`flex items-center ${router.route == '/' ? 'text-gray-100 font-semibold' : 'hover:text-white transition-all'}`}>
                                <h6>Home</h6>
                            </Link>
                        </li>
                        <li>
                            <Link href="/projects" className={`flex items-center ${router.route == '/projects' ? 'text-gray-100 font-semibold' : 'hover:text-white transition-all'}`}>
                                <h6>Projects</h6>
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className={`flex items-center ${router.route == '/contact' ? 'text-gray-100 font-semibold' : 'hover:text-white transition-all'}`}>
                                <h6>Contact</h6>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                    <a target="_blank" href="https://discord.com/users/619841555255132160" className="text-white hover:bg-zinc-900/50 transition-all flex items-center justify-center cursor-pointer social w-10 h-10 rounded-lg">
                        <i className="fab fa-discord" />
                    </a>
                    <a target="_blank" href="https://github.com/voidnulljs" className="text-white hover:bg-zinc-900/50 transition-all flex items-center justify-center cursor-pointer social w-10 h-10 rounded-lg">
                        <i className="fab fa-github" />
                    </a>
                    <a target="_blank" href="https://www.npmjs.com/~voidnull.js" className="text-white hover:bg-zinc-900/50 transition-all flex items-center justify-center cursor-pointer social w-10 h-10 rounded-lg">
                        <i className="fa-brands fa-npm" />
                    </a>
                    <a target="_blank" href="https://repl.it/@voidnull-js" className="text-white hover:bg-zinc-900/50 transition-all flex items-center justify-center cursor-pointer social w-10 h-10 rounded-lg">
                        <i className="fa-solid fa-aperture" />
                    </a>
                </div>
            </div>
        </>
    );
};
