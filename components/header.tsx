"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  const { isSignedIn } = useUser()
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                className="h-8 w-8 mr-2 text-orange-500"
              >
                <circle cx="10" cy="10" r="10" fill="currentColor" />
                <circle cx="7" cy="8" r="1.5" fill="white" />
                <circle cx="13" cy="8" r="1.5" fill="white" />
                <path d="M6 12.5C7.5 14.5 12.5 14.5 14 12.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="font-bold text-xl hidden sm:inline-block">Reddit Clone</span>
            </Link>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input type="search" placeholder="Search Reddit" className="w-full bg-gray-100 dark:bg-gray-800 pl-8" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isSignedIn ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/create-community">Create Community</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/submit">Create Post</Link>
                    </DropdownMenuItem>
                    {pathname.startsWith("/r/") && pathname.split("/").length === 3 && (
                      <DropdownMenuItem asChild>
                        <Link href={`${pathname}/submit`}>Create Post in this Community</Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <SignInButton>
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
