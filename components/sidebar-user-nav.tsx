'use client';

import {
  ChevronRight,
  Settings,
  Moon,
  Sun,
  User,
  LogOut,
  LogIn,
  Palette,
  Bell,
  HelpCircle,
  Shield,
  Download,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import type { User as NextAuthUser } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { toast } from './toast';
import { LoaderIcon } from './icons';
import { guestRegex } from '@/lib/constants';

export function SmartSidebarUserNav({ user }: { user: NextAuthUser }) {
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isGuest = user.email && guestRegex.test(user.email);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ redirect: false });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/register');
  };

  const getAvatarUrl = (email: string) => {
    // Use a more reliable avatar service or fallback
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email)}`;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Image
                  src={getAvatarUrl(user.email || 'user')}
                  alt={user.name || 'User'}
                  width={32}
                  height={32}
                  className="rounded-lg"
                  unoptimized
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user.name || 'User'}
                </span>
                <span className="truncate text-xs">
                  {user.email}
                </span>
              </div>
              <ChevronRight className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src={getAvatarUrl(user.email || 'user')}
                    alt={user.name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-lg"
                    unoptimized
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.name || 'User'}
                  </span>
                  <span className="truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Profile Section */}
            <DropdownMenuItem onClick={() => router.push('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>

            {/* Theme Selector */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}>
                  <Settings className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Help & Support */}
            <DropdownMenuItem onClick={() => router.push('/help')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push('/notifications')}>
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </DropdownMenuItem>

            {!isGuest && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/privacy')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push('/export')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />

            {/* Authentication Actions */}
            {isGuest ? (
              <>
                <DropdownMenuItem
                  onClick={handleLogin}
                  className="text-blue-600 focus:text-blue-600 focus:bg-blue-50 dark:focus:bg-blue-950"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignup}
                  className="text-green-600 focus:text-green-600 focus:bg-green-50 dark:focus:bg-green-950"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign Up
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
              >
                {isSigningOut ? (
                  <LoaderIcon />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                {isSigningOut ? 'Signing out...' : 'Sign out'}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

// Export the component with the expected name for backward compatibility
export { SmartSidebarUserNav as SidebarUserNav };