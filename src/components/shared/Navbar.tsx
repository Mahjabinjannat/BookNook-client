// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";

// import {
//   BookOpen,
//   Menu,
//   X,
//   ChevronDown,
//   UserRound,
//   LogOut,
//   LibraryBig,
// } from "lucide-react";

// import { signOut, useSession } from "@/lib/auth-client";

// const publicLinks = [
//   { label: "Home", href: "/" },
//   { label: "All Books", href: "/books" },
// ];

// const privateLinks = [
//   { label: "Add Book", href: "/add-book" },
//   { label: "My Books", href: "/my-books" },
//   { label: "My Borrows", href: "/my-borrows" },
// ];

// export default function Navbar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const { data: session, isPending } = useSession();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [profileOpen, setProfileOpen] = useState(false);
//   const [loggingOut, setLoggingOut] = useState(false);

//   const user = session?.user;
//   const isLoggedIn = !!user;

//   const links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

//   // EXACT PATH MATCHING
//   // Book details pages will not highlight All Books.
//   const isActive = (href: string) => {
//     return pathname === href;
//   };

//   const closeMenus = () => {
//     setMobileOpen(false);
//     setProfileOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       setLoggingOut(true);

//       await signOut({
//         fetchOptions: {
//           onSuccess: () => {
//             closeMenus();
//             router.push("/");
//             router.refresh();
//           },
//         },
//       });
//     } catch (error) {
//       console.error("Logout failed:", error);
//     } finally {
//       setLoggingOut(false);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-50 border-b border-[#e9e6dc] bg-[#faf9f4]/95 backdrop-blur-md">
//       <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10 lg:px-16">
//         {/* LOGO */}
//         <Link
//           href="/"
//           onClick={closeMenus}
//           className="flex shrink-0 items-center gap-3"
//         >
//           <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d513b] text-white">
//             <BookOpen size={22} strokeWidth={1.7} />

//             <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#faf9f4] bg-[#d7a34d]" />
//           </div>

//           <div>
//             <h1 className="font-heading text-[25px] font-semibold leading-none tracking-tight text-[#19271f]">
//               BookNook
//             </h1>

//             <p className="mt-1.5 hidden text-[9px] font-medium uppercase tracking-[0.27em] text-[#778077] sm:block">
//               A small library for big readers
//             </p>
//           </div>
//         </Link>

//         {/* DESKTOP NAVIGATION */}
//         <nav className="hidden h-full items-center gap-7 lg:flex">
//           {links.map((link) => {
//             const active = isActive(link.href);

//             return (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 aria-current={active ? "page" : undefined}
//                 className={`relative flex h-full items-center whitespace-nowrap text-sm transition-colors ${
//                   active
//                     ? "font-medium text-[#17291f]"
//                     : "text-[#657067] hover:text-[#1d513b]"
//                 }`}
//               >
//                 {link.label}

//                 {active && (
//                   <span className="absolute bottom-0 left-0 h-px w-full bg-[#d6a44d]" />
//                 )}
//               </Link>
//             );
//           })}
//         </nav>

//         {/* DESKTOP AUTH ACTIONS */}
//         <div className="hidden items-center gap-5 lg:flex">
//           {isPending ? (
//             <div className="h-10 w-28 animate-pulse rounded-full bg-[#e9e6dc]" />
//           ) : isLoggedIn ? (
//             <div className="relative">
//               <button
//                 type="button"
//                 onClick={() => setProfileOpen(!profileOpen)}
//                 aria-expanded={profileOpen}
//                 aria-label="Open account menu"
//                 className="flex items-center gap-2 rounded-full border border-[#e5e8e0] px-2 py-1.5 transition hover:bg-[#f0f1e9]"
//               >
//                 {user.image ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={user.image}
//                     alt={user.name || "Profile"}
//                     className="h-9 w-9 rounded-full object-cover"
//                   />
//                 ) : (
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d513b] text-white">
//                     <UserRound size={19} />
//                   </div>
//                 )}

//                 <span className="max-w-28 truncate text-sm font-medium text-[#24362b]">
//                   {user.name}
//                 </span>

//                 <ChevronDown size={15} />
//               </button>

//               {profileOpen && (
//                 <>
//                   {/* CLOSE DROPDOWN ON OUTSIDE CLICK */}
//                   <button
//                     type="button"
//                     aria-label="Close account menu"
//                     className="fixed inset-0 z-10 cursor-default"
//                     onClick={() => setProfileOpen(false)}
//                   />

//                   {/* PROFILE DROPDOWN */}
//                   <div className="absolute right-0 top-14 z-20 w-60 rounded-xl border border-[#e9e6dc] bg-[#faf9f4] p-2 shadow-xl">
//                     <div className="border-b border-[#e9e6dc] px-3 py-3">
//                       <p className="truncate text-sm font-semibold">
//                         {user.name}
//                       </p>

//                       <p className="truncate text-xs text-[#778077]">
//                         {user.email}
//                       </p>
//                     </div>

//                     <Link
//                       href="/profile"
//                       onClick={closeMenus}
//                       className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[#edf0e8]"
//                     >
//                       <UserRound size={17} />
//                       My Profile
//                     </Link>

//                     <button
//                       type="button"
//                       disabled={loggingOut}
//                       onClick={handleLogout}
//                       className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
//                     >
//                       <LogOut size={17} />

//                       {loggingOut ? "Logging out..." : "Logout"}
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           ) : (
//             <>
//               <Link
//                 href="/signIn"
//                 className="text-sm font-medium text-[#19271f] transition hover:text-[#1d513b]"
//               >
//                 Sign In
//               </Link>

//               <Link
//                 href="/signUp"
//                 className="rounded-full bg-[#1d513b] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#153d2c]"
//               >
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </div>

//         {/* MOBILE MENU BUTTON */}
//         <button
//           type="button"
//           onClick={() => setMobileOpen(!mobileOpen)}
//           aria-label={mobileOpen ? "Close menu" : "Open menu"}
//           aria-expanded={mobileOpen}
//           className="rounded-lg p-2 text-[#1d513b] hover:bg-[#edf0e8] lg:hidden"
//         >
//           {mobileOpen ? <X size={25} /> : <Menu size={25} />}
//         </button>
//       </div>

//       {/* MOBILE NAVIGATION */}
//       {mobileOpen && (
//         <nav className="border-t border-[#e9e6dc] bg-[#faf9f4] px-5 py-5 shadow-lg lg:hidden">
//           <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
//             {links.map((link) => {
//               const active = isActive(link.href);

//               return (
//                 <Link
//                   key={link.href}
//                   href={link.href}
//                   onClick={closeMenus}
//                   aria-current={active ? "page" : undefined}
//                   className={`rounded-lg px-4 py-3 text-sm font-medium ${
//                     active
//                       ? "bg-[#e7eee7] text-[#1d513b]"
//                       : "text-[#657067] hover:bg-[#f0f1e9]"
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               );
//             })}

//             {/* MOBILE AUTH ACTIONS */}
//             {!isPending && (
//               <div className="mt-4 border-t border-[#e9e6dc] pt-4">
//                 {isLoggedIn ? (
//                   <>
//                     <div className="mb-3 flex items-center gap-3 px-4">
//                       <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d513b] text-white">
//                         <LibraryBig size={20} />
//                       </div>

//                       <div className="min-w-0">
//                         <p className="truncate text-sm font-semibold">
//                           {user.name}
//                         </p>

//                         <p className="truncate text-xs text-[#778077]">
//                           {user.email}
//                         </p>
//                       </div>
//                     </div>

//                     <Link
//                       href="/profile"
//                       onClick={closeMenus}
//                       className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-[#edf0e8]"
//                     >
//                       <UserRound size={18} />
//                       My Profile
//                     </Link>

//                     <button
//                       type="button"
//                       disabled={loggingOut}
//                       onClick={handleLogout}
//                       className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
//                     >
//                       <LogOut size={18} />

//                       {loggingOut ? "Logging out..." : "Logout"}
//                     </button>
//                   </>
//                 ) : (
//                   <div className="flex gap-3">
//                     <Link
//                       href="/signIn"
//                       onClick={closeMenus}
//                       className="flex-1 rounded-full border border-[#1d513b] px-5 py-3 text-center text-sm font-medium text-[#1d513b]"
//                     >
//                       Sign In
//                     </Link>

//                     <Link
//                       href="/signUp"
//                       onClick={closeMenus}
//                       className="flex-1 rounded-full bg-[#1d513b] px-5 py-3 text-center text-sm font-medium text-white"
//                     >
//                       Sign Up
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </nav>
//       )}
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import {
  BookOpen,
  Menu,
  X,
  ChevronDown,
  UserRound,
  LogOut,
} from "lucide-react";

import { signOut, useSession } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// PUBLIC NAVIGATION LINKS
const publicLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/books" },
];

// PRIVATE NAVIGATION LINKS
const privateLinks = [
  { label: "Add Book", href: "/add-book" },
  { label: "My Books", href: "/my-books" },
  { label: "My Borrows", href: "/my-borrows" },
];

// REUSABLE USER AVATAR
interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
}

function UserAvatar({ name, image, className = "size-9" }: UserAvatarProps) {
  const initial = name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <Avatar className={className}>
      {image?.trim() && (
        <AvatarImage
          src={image}
          alt={name ? `${name}'s profile photo` : "Profile photo"}
          className="object-cover"
        />
      )}

      <AvatarFallback className="bg-[#1d513b] font-semibold text-white">
        {initial}
      </AvatarFallback>
    </Avatar>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;
  const isLoggedIn = !!user;

  const links = isLoggedIn ? [...publicLinks, ...privateLinks] : publicLinks;

  // EXACT PATH MATCHING
  // Book details pages will not highlight All Books.
  const isActive = (href: string) => {
    return pathname === href;
  };

  // CLOSE MOBILE AND PROFILE MENUS
  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  // LOG OUT USER
  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await signOut({
        fetchOptions: {
          onSuccess: () => {
            closeMenus();
            router.push("/");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#e9e6dc] bg-[#faf9f4]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-6 px-5 md:px-10 lg:px-16">
        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-3"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1d513b] text-white">
            <BookOpen size={22} strokeWidth={1.7} />

            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#faf9f4] bg-[#d7a34d]" />
          </div>

          <div>
            <h1 className="font-heading text-[25px] font-semibold leading-none tracking-tight text-[#19271f]">
              BookNook
            </h1>

            <p className="mt-1.5 hidden text-[9px] font-medium uppercase tracking-[0.27em] text-[#778077] sm:block">
              A small library for big readers
            </p>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden h-full items-center gap-7 lg:flex">
          {links.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center whitespace-nowrap text-sm transition-colors ${
                  active
                    ? "font-medium text-[#17291f]"
                    : "text-[#657067] hover:text-[#1d513b]"
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute bottom-0 left-0 h-px w-full bg-[#d6a44d]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP AUTH ACTIONS */}
        <div className="hidden items-center gap-5 lg:flex">
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-full bg-[#e9e6dc]" />
          ) : isLoggedIn ? (
            <div className="relative">
              {/* PROFILE BUTTON */}
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
                className="flex items-center gap-2 rounded-full border border-[#e5e8e0] px-2 py-1.5 transition hover:bg-[#f0f1e9]"
              >
                <UserAvatar
                  name={user.name}
                  image={user.image}
                  className="size-9"
                />

                <span className="max-w-28 truncate text-sm font-medium text-[#24362b]">
                  {user.name || "User"}
                </span>

                <ChevronDown
                  size={15}
                  className={`shrink-0 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* PROFILE DROPDOWN */}
              {profileOpen && (
                <>
                  {/* CLOSE ON OUTSIDE CLICK */}
                  <button
                    type="button"
                    aria-label="Close account menu"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setProfileOpen(false)}
                  />

                  <div className="absolute right-0 top-14 z-20 w-60 rounded-xl border border-[#e9e6dc] bg-[#faf9f4] p-2 shadow-xl">
                    {/* USER INFORMATION */}
                    <div className="flex items-center gap-3 border-b border-[#e9e6dc] px-3 py-3">
                      <UserAvatar
                        name={user.name}
                        image={user.image}
                        className="size-10"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#24362b]">
                          {user.name || "User"}
                        </p>

                        <p className="truncate text-xs text-[#778077]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* PROFILE LINK */}
                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-[#edf0e8]"
                    >
                      <UserRound size={17} />
                      My Profile
                    </Link>

                    {/* LOGOUT */}
                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={17} />

                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              {/* SIGN IN */}
              <Link
                href="/signIn"
                className="text-sm font-medium text-[#19271f] transition hover:text-[#1d513b]"
              >
                Sign In
              </Link>

              {/* SIGN UP */}
              <Link
                href="/signUp"
                className="rounded-full bg-[#1d513b] px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-[#153d2c]"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setProfileOpen(false);
          }}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-[#1d513b] hover:bg-[#edf0e8] lg:hidden"
        >
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <nav className="border-t border-[#e9e6dc] bg-[#faf9f4] px-5 py-5 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
            {/* NAVIGATION LINKS */}
            {links.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    active
                      ? "bg-[#e7eee7] text-[#1d513b]"
                      : "text-[#657067] hover:bg-[#f0f1e9]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* MOBILE AUTH ACTIONS */}
            {!isPending && (
              <div className="mt-4 border-t border-[#e9e6dc] pt-4">
                {isLoggedIn ? (
                  <>
                    {/* MOBILE USER INFO */}
                    <div className="mb-3 flex items-center gap-3 px-4">
                      <UserAvatar
                        name={user.name}
                        image={user.image}
                        className="size-10"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#24362b]">
                          {user.name || "User"}
                        </p>

                        <p className="truncate text-xs text-[#778077]">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* MY PROFILE */}
                    <Link
                      href="/profile"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm hover:bg-[#edf0e8]"
                    >
                      <UserRound size={18} />
                      My Profile
                    </Link>

                    {/* LOGOUT */}
                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <LogOut size={18} />

                      {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </>
                ) : (
                  /* MOBILE SIGN IN / SIGN UP */
                  <div className="flex gap-3">
                    <Link
                      href="/signIn"
                      onClick={closeMenus}
                      className="flex-1 rounded-full border border-[#1d513b] px-5 py-3 text-center text-sm font-medium text-[#1d513b]"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/signUp"
                      onClick={closeMenus}
                      className="flex-1 rounded-full bg-[#1d513b] px-5 py-3 text-center text-sm font-medium text-white"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
