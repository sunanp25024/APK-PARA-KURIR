"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/icons/AppLogo";
import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  Users,
  Briefcase,
  Bell,
  MailCheck,
  FileText,
  ShieldCheck,
  ClipboardList
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import type { UserRole, UserProfile } from "@/types";
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
}

const allNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ['MasterAdmin', 'Admin', 'PIC', 'Kurir'] },
  { href: "/profile", icon: User, label: "Profil Saya", roles: ['MasterAdmin', 'Admin', 'PIC', 'Kurir'] },
  
  // MasterAdmin specific
  { href: "/manage-admins", icon: Users, label: "Manage Admin", roles: ['MasterAdmin'] },
  { href: "/approvals", icon: ShieldCheck, label: "Persetujuan", roles: ['MasterAdmin'] },
  { href: "/notifications", icon: Bell, label: "Notifikasi Sistem", roles: ['MasterAdmin'] },

  // Admin and MasterAdmin
  { href: "/manage-pics", icon: Briefcase, label: "Manage PIC", roles: ['MasterAdmin', 'Admin'] },
  { href: "/manage-kurirs", icon: Users, label: "Manage Kurir", roles: ['MasterAdmin', 'Admin'] },
  
  // Admin specific
  { href: "/pending-approvals", icon: MailCheck, label: "Status Persetujuan", roles: ['Admin'] },
  
  // PIC specific
  { href: "/courier-management", icon: ClipboardList, label: "Manajemen Kurir", roles: ['PIC'] },
  { href: "/reports", icon: FileText, label: "Laporan", roles: ['PIC'] },
  { href: "/courier-updates", icon: Bell, label: "Update Kurir", roles: ['PIC'] },

  // Kurir specific
  { href: "/attendance", icon: ClipboardCheck, label: "Absen", roles: ['Kurir'] },
  { href: "/performance", icon: BarChart3, label: "Performa", roles: ['Kurir'] },
  
  { href: "/settings", icon: Settings, label: "Pengaturan Akun", roles: ['MasterAdmin', 'Admin', 'PIC', 'Kurir'] },
];

// Enhanced error boundary with better error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Layout Error Boundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Layout Error Boundary details:', error, errorInfo);
    
    // If it's a workStore error, try to recover
    if (error.message?.includes('workStore') || error.message?.includes('searchParams')) {
      console.log('Detected workStore error, attempting recovery...');
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined });
      }, 1000);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan Sementara</h2>
            <p className="text-muted-foreground mb-4">
              Sistem sedang memulihkan diri. Silakan tunggu sebentar atau refresh halaman.
            </p>
            <div className="space-x-2">
              <Button 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                variant="outline"
              >
                Coba Lagi
              </Button>
              <Button onClick={() => window.location.reload()}>
                Refresh Halaman
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = React.useState<UserProfile | null>(null);
  const [navItems, setNavItems] = React.useState<NavItem[]>([]);
  const [loadingAuth, setLoadingAuth] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Critical: Ensure proper mounting sequence to prevent workStore issues
  React.useEffect(() => {
    setMounted(true);
    // Add a small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    if (!mounted || !isHydrated) return;

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setLoadingAuth(true);
        try {
          if (firebaseUser) {
            let userProfile: UserProfile | null = null;
            
            // Safe localStorage access with error handling
            try {
              const localData = localStorage.getItem('loggedInUser');
              if (localData) {
                const parsed = JSON.parse(localData) as UserProfile;
                if (parsed.uid === firebaseUser.uid) {
                  userProfile = parsed;
                }
              }
            } catch (e) { 
              console.warn("Could not parse user data from localStorage.", e);
              try {
                localStorage.removeItem('loggedInUser');
              } catch (storageError) {
                console.warn("Could not clear localStorage:", storageError);
              }
            }

            if (!userProfile) {
              try {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                  userProfile = { uid: firebaseUser.uid, ...userDocSnap.data() } as UserProfile;
                  try {
                    localStorage.setItem('loggedInUser', JSON.stringify(userProfile));
                    localStorage.setItem('isAuthenticated', 'true');
                  } catch (storageError) {
                    console.warn("Could not save to localStorage:", storageError);
                  }
                } else {
                  await signOut(auth);
                  userProfile = null;
                }
              } catch (error) {
                console.error("Error fetching user profile from Firestore:", error);
                try {
                  await signOut(auth);
                } catch (signOutError) {
                  console.error("Error signing out:", signOutError);
                }
                userProfile = null;
              }
            }
            
            if (userProfile) {
              setCurrentUser(userProfile);
              if (userProfile.role) {
                setNavItems(allNavItems.filter(item => item.roles.includes(userProfile!.role)));
              }
            } else {
               setCurrentUser(null);
            }

          } else {
            // Safe cleanup of localStorage
            try {
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('loggedInUser');
              localStorage.removeItem('courierCheckedInToday');
            } catch (storageError) {
              console.warn("Could not clear localStorage:", storageError);
            }
            
            setCurrentUser(null);
            setNavItems([]);
            
            const publicPages = ['/', '/login', '/setup-admin'];
            if (!publicPages.includes(pathname)) {
              router.replace('/');
            }
          }
        } catch (error) {
          console.error("Auth state change error:", error);
          setCurrentUser(null);
          setNavItems([]);
        } finally {
          setLoadingAuth(false);
        }
      });
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setLoadingAuth(false);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error unsubscribing from auth:", error);
        }
      }
    };
  }, [router, pathname, mounted, isHydrated]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
      try {
        localStorage.clear();
      } catch (storageError) {
        console.warn("Could not clear localStorage:", storageError);
      }
      router.push('/');
    }
  };

  // Critical: Don't render anything until fully mounted and hydrated
  if (!mounted || !isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse">Memuat aplikasi...</div>
      </div>
    );
  }

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p>Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }
  
  const publicPages = ['/', '/login', '/setup-admin'];
  if (!currentUser && !publicPages.includes(pathname)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-2">Mengalihkan...</div>
          <p className="text-sm text-muted-foreground">Mengarahkan ke halaman utama</p>
        </div>
      </div>
    );
  }
  
  if (publicPages.includes(pathname)) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  const userInitials = currentUser?.fullName?.split(" ").map(n => n[0]).join("").toUpperCase() || "XX";

  return (
    <ErrorBoundary>
      <SidebarProvider defaultOpen>
        <Sidebar>
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <AppLogo className="h-10 w-10 text-primary" />
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold text-sidebar-foreground">INSAN MOBILE</h2>
                <span className="text-xs text-muted-foreground">Aplikasi Mobile</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname.startsWith(item.href)}
                      tooltip={{ children: item.label, side: "right", align: "center" }}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-sidebar-border">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start items-center p-2 h-auto">
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src={currentUser?.avatarUrl || `https://placehold.co/100x100.png?text=${userInitials}`} alt={currentUser?.fullName || "User"} data-ai-hint="man face"/>
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="text-left flex-grow">
                    <p className="text-sm font-medium text-sidebar-foreground">{currentUser?.fullName || "User"}</p>
                    <p className="text-xs text-muted-foreground">{currentUser?.id}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56 mb-2">
                <DropdownMenuLabel>Akun Saya ({currentUser?.role})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 md:hidden">
               <SidebarTrigger />
            </div>
            {children}
          </div>
        </SidebarInset>
        <Toaster />
      </SidebarProvider>
    </ErrorBoundary>
  );
}