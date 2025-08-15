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

interface SmartUserNavProps {
  user: NextAuthUser;
}

export function SmartSidebarUserNav({ user }: SmartUserNavProps) {
  const router = useRouter();
  const { data, status } = useSession();
  const { setTheme, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isGuest = guestRegex.test(data?.user?.email ?? '');

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      type: 'success',
      description: `Theme changed to ${newTheme} mode`,
    });
  };

  const handleSignOut = () => {
    signOut({
      redirectTo: '/',
    });
    toast({
      type: 'success',
      description: 'Signed out successfully',
    });
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  // Safe email getter with fallback
  const getUserEmail = () => {
    return user?.email ?? data?.user?.email ?? 'user@example.com';
  };

  const getUserName = () => {
    return user?.name ?? data?.user?.name ?? 'User';
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            {status === 'loading' ? (
              <SidebarMenuButton className="h-10 w-10 rounded-full p-0">
                <div className="size-8 bg-zinc-500/30 rounded-full animate-pulse" />
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                data-testid="smart-user-nav-button"
                className="h-10 w-10 rounded-full p-0 hover:scale-105 transition-transform duration-200"
                // Fix: Properly handle title prop
                {...(isGuest ? {} : { title: getUserEmail() })}
              >
                <Image
                  src={`https://avatar.vercel.sh/${getUserEmail()}`}
                  alt={getUserEmail()}
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-primary/20 hover:border-primary/40 transition-colors"
                />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            data-testid="smart-user-nav-menu"
            side="top"
            className="w-64 p-2"
            align="start"
          >
            {/* User Info Header */}
            <div className="flex items-center gap-3 p-2 mb-2 bg-muted/50 rounded-full">
              <Image
                src={`https://avatar.vercel.sh/${getUserEmail()}`}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {isGuest ? 'Guest User' : getUserName()}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {isGuest ? 'Not signed in' : getUserEmail()}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Account Section */}
            {!isGuest && (
              <>
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  className="cursor-pointer gap-2"
                  onClick={handleProfileClick}
                >
                  <User className="h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy & Security
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Appearance Section */}
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Appearance
            </DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuItem 
                  className="cursor-pointer gap-2"
                  onClick={() => handleThemeChange('light')}
                >
                  <Sun className="h-4 w-4" />
                  Light Mode
                  {theme === 'light' && <div className="ml-auto h-2 w-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer gap-2"
                  onClick={() => handleThemeChange('dark')}
                >
                  <Moon className="h-4 w-4" />
                  Dark Mode
                  {theme === 'dark' && <div className="ml-auto h-2 w-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer gap-2"
                  onClick={() => handleThemeChange('system')}
                >
                  <Settings className="h-4 w-4" />
                  System Default
                  {theme === 'system' && <div className="ml-auto h-2 w-2 bg-primary rounded-full" />}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* More Options */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" />
                More Options
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Help & Support
                </DropdownMenuItem>
                {!isGuest && (
                  <DropdownMenuItem className="cursor-pointer gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                  </DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Authentication */}
            <DropdownMenuItem asChild data-testid="smart-user-nav-auth">
              <button
                type="button"
                className="w-full cursor-pointer gap-2 text-left flex items-center"
                onClick={() => {
                  if (status === 'loading') {
                    toast({
                      type: 'error',
                      description: 'Please wait, checking authentication status...',
                    });
                    return;
                  }

                  if (isGuest) {
                    router.push('/login');
                  } else {
                    handleSignOut();
                  }
                }}
              >
                {isGuest ? (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In to Account
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </>
                )}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
