'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Search, Menu, X } from 'lucide-react';
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

const Logo = () => (
    <Link href="/" className="font-bold text-xl tracking-tight text-foreground">
        Tuition-ed
    </Link>
);

const navLinks = [
    { href: '/courses', label: 'Courses' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

const Navbar = () => {
    const { data: session, status } = useSession();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const handleOpenLogin = () => {
        setIsSignUpModalOpen(false);
        setIsLoginModalOpen(true);
    };

    const handleOpenSignUp = () => {
        setIsLoginModalOpen(false);
        setIsSignUpModalOpen(true);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background backdrop-blur-lg">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
                <div className="flex items-center space-x-8">
                    <Logo />
                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (<Link key={link.href} href={link.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors" > {link.label} </Link>))}
                    </div>
                </div>
                {/* Desktop right side */}
                <div className="hidden md:flex items-center gap-4">
                    <TextField
                        placeholder="Search for courses..."
                        variant="outlined"
                        size="small"
                        className="[&_.MuiInputBase-root]:h-10 [&_.MuiInputBase-root]:bg-muted [&_.MuiInputBase-root]:text-muted-foreground [&_.MuiOutlinedInput-notchedOutline]:border-border hover:[&_.MuiOutlinedInput-notchedOutline]:border-ring focus-within:[&_.MuiOutlinedInput-notchedOutline]:border-ring"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"> <Search className="h-5 w-5 text-foreground" /> </InputAdornment>
                            ),
                        }}
                    />
                    {status === 'authenticated' ? (
                        <>
                            <span className="text-sm font-medium text-foreground whitespace-nowrap">
                                Hi, {session.user?.fullName?.split(' ')[0]}
                            </span>
                            <Button
                                variant="contained"
                                onClick={() => signOut()}
                                sx={{
                                    height: '40px',
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    '&:hover': { backgroundColor: '#f0f0f0' }
                                }}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" onClick={handleOpenLogin} sx={{
                            height: '40px',
                            backgroundColor: '#fff',
                            color: '#000',
                            '&:hover': { backgroundColor: '#f0f0f0' }
                        }}>
                            Login
                        </Button>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary" aria-expanded="false">
                        <span className="sr-only">Open main menu</span>
                        {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                    </button>
                </div>
            </nav>
            {/* Mobile Menu Dropdown */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-background border-b shadow-lg transition-all duration-300 ease-in-out
          ${isMobileMenuOpen
                        ? 'opacity-100 translate-y-0 visible'
                        : 'opacity-0 -translate-y-4 invisible'
                    }`}
            >
                <div className="px-4 pt-2 pb-4 space-y-4">
                    <TextField
                        placeholder="Search for courses..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        className="[&_.MuiInputBase-root]:h-10 [&_.MuiInputBase-root]:bg-muted [&_.MuiInputBase-root]:text-muted-foreground [&_.MuiOutlinedInput-notchedOutline]:border-border hover:[&_.MuiOutlinedInput-notchedOutline]:border-ring focus-within:[&_.MuiOutlinedInput-notchedOutline]:border-ring"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search className="h-5 w-5 text-foreground" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <div className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary hover:bg-muted" onClick={() => setIsMobileMenuOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        {status === 'authenticated' ? (
                            <Button
                                variant="contained"
                                onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                                fullWidth sx={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    '&:hover': { backgroundColor: '#f0f0f0' }
                                }}
                            >
                                Logout
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => { handleOpenLogin(); setIsMobileMenuOpen(false); }}
                                fullWidth sx={{
                                    backgroundColor: '#fff',
                                    color: '#000',
                                    '&:hover': { backgroundColor: '#f0f0f0' }
                                }}
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            <LoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onSwitchToSignUp={handleOpenSignUp} />
            <SignUpModal open={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
        </header>
    );
};

export default Navbar;