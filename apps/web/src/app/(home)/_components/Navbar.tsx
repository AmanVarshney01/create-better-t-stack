"use client";
import { cn } from "@/lib/utils";
import {
  BookMarked,
  BookMarkedIcon,
  Github,
  Maximize2,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import PackageIcon from "./Icons";

const Navbar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [bgStyles, setBgStyles] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  useEffect(() => {
    const updateBackground = (linkId: string) => {
      const linkElement = linkRefs.current[linkId];
      if (linkElement) {
        setBgStyles({
          padding: "0.75rem 0rem",
          width: `${linkElement.clientWidth - 12}px`,
          transform: `translateX(${linkElement.offsetLeft}px)`,
          opacity: 1,
        });
      }
    };

    updateBackground(activeLink);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", () => updateBackground(activeLink));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", () => updateBackground(activeLink));
    };
  }, [activeLink]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-[100] flex w-full items-center justify-between px-4 py-4 transition-all duration-300 sm:px-8",
          scrolled ? "bg-transparent" : "bg-background/80 backdrop-blur-xl"
        )}
      >
        <div
          className={cn(
            "flex flex-row items-center space-x-3 transition-opacity duration-300",
            scrolled ? "opacity-0" : "opacity-100"
          )}
        >
          <div className='flex h-4 w-4 items-center justify-center rounded-sm'>
            <span className='text-md text-primary'>$_</span>
          </div>
          <span className='font-semibold text-foreground text-md'>
            Better-T Stack
          </span>
        </div>

        <div className='-translate-x-1/2 absolute left-1/2 hidden transform md:block'>
          <div
            className={cn(
              "relative flex items-center rounded-lg border border-border bg-muted/90 px-1.5 py-1 text-sm backdrop-blur-sm transition-all duration-500 ease-out",
              scrolled ? "w-[420px]" : "w-[313px]"
            )}
          >
            <div
              className='absolute rounded-md bg-background transition-all duration-200 ease-in-out'
              style={bgStyles}
            />
            <Link
              href='/'
              ref={(ref) => {
                linkRefs.current.home = ref;
              }}
              onMouseOver={() => setActiveLink("home")}
              className='relative flex items-center gap-1 rounded-md px-4 py-2 font-mono text-muted-foreground transition-colors hover:text-primary'
            >
              <span className='text-primary'>~/</span>
              home
            </Link>

            <Link
              href='https://my-better-t-app-client.pages.dev/'
              target='_blank'
              ref={(ref) => {
                linkRefs.current.demo = ref;
              }}
              onMouseOver={() => setActiveLink("demo")}
              onMouseLeave={() => setActiveLink("home")}
              className='relative flex items-center gap-2 rounded-md px-4 py-2 font-mono text-muted-foreground transition-colors hover:text-primary'
            >
              <span>demo</span>
            </Link>

            <Link
              href='/docs'
              ref={(ref) => {
                linkRefs.current.docs = ref;
              }}
              onMouseOver={() => setActiveLink("docs")}
              onMouseLeave={() => setActiveLink("home")}
              className='relative flex items-center gap-2 rounded-md px-4 py-2 font-mono text-muted-foreground transition-colors hover:text-primary'
            >
              <span>docs</span>
            </Link>

            <Link
              href='https://www.npmjs.com/package/create-better-t-stack'
              target='_blank'
              ref={(ref) => {
                linkRefs.current.npm = ref;
              }}
              onMouseOver={() => setActiveLink("npm")}
              onMouseLeave={() => setActiveLink("home")}
              className='relative flex items-center gap-2 rounded-md px-4 py-2 font-mono text-muted-foreground transition-colors hover:text-primary'
            >
              <PackageIcon pm='npm' className='h-4 w-4 rounded-full' />{" "}
              <span>npm</span>
            </Link>

            <Link
              href='https://www.github.com/better-t-stack/create-better-t-stack'
              target='_blank'
              ref={(ref) => {
                linkRefs.current.github = ref;
              }}
              onMouseOver={() => setActiveLink("github")}
              onMouseLeave={() => setActiveLink("home")}
              className={cn(
                "relative flex items-center gap-2 rounded-md px-4 py-2 font-mono text-muted-foreground transition-colors hover:text-primary",
                scrolled
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none opacity-0"
              )}
            >
              <Github className='size-4'>
                <title>GitHub</title>
              </Github>
              Github
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "hidden justify-end gap-2 transition-opacity duration-300 md:flex",
            scrolled ? "pointer-events-none opacity-0" : "opacity-100"
          )}
        >
          <Link
            href='/new'
            className='inline-flex items-center rounded-lg border border-primary/50 bg-primary/10 px-4 py-1 font-mono text-primary text-sm backdrop-blur-sm transition-colors hover:bg-primary/20'
          >
            <Maximize2 className='mr-1 size-4' />
            Stack Builder
          </Link>
          <Link
            href='https://www.github.com/better-t-stack/create-better-t-stack'
            target='_blank'
            className='inline-flex items-center rounded-lg border border-border bg-muted/90 px-4 py-1 font-mono text-muted-foreground text-sm backdrop-blur-sm transition-colors hover:bg-muted hover:text-primary'
          >
            <Github className='mr-1 size-4'>
              <title>GitHub</title>
            </Github>
            Star on GitHub
          </Link>
        </div>

        <button
          type='button'
          onClick={toggleMobileMenu}
          className='flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted/50 focus:outline-none md:hidden'
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className='size-5' aria-hidden='true' />
          ) : (
            <Menu className='size-5' aria-hidden='true' />
          )}
          <span className='sr-only'>Toggle menu</span>
        </button>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-[99] pt-16 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden",
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <div className='mx-4 mt-4 overflow-hidden rounded-lg border border-border bg-background/95'>
          <div className='flex items-center bg-muted px-4 py-2'>
            <div className='mr-4 flex space-x-2'>
              <div className='h-3 w-3 rounded-full bg-red-500' />
              <div className='h-3 w-3 rounded-full bg-yellow-500' />
              <div className='h-3 w-3 rounded-full bg-green-500' />
            </div>
            <div className='font-mono text-muted-foreground text-sm'>
              better-t-stack:~
            </div>
          </div>

          <div className='p-4 font-mono text-sm'>
            <div className='pb-3'>
              <span className='text-[--color-chart-4]'>
                user@better-t-stack
              </span>
              <span className='text-muted-foreground'>:~$</span>
              <span className='ml-2 text-foreground'>ls -la</span>
            </div>

            <div className='space-y-2 border-border border-l-2 pl-4'>
              <Link
                href='/'
                className='block text-primary hover:underline'
                onClick={() => setMobileMenuOpen(false)}
              >
                ~/home
              </Link>

              <Link
                href='https://my-better-t-app-client.pages.dev/'
                target='_blank'
                className='block text-primary hover:underline'
                onClick={() => setMobileMenuOpen(false)}
              >
                ~/demo
              </Link>

              <div className='flex items-center'>
                <PackageIcon pm='npm' className='mr-1 h-4 w-4' />
                <Link
                  href='https://www.npmjs.com/package/create-better-t-stack'
                  target='_blank'
                  className='block text-primary hover:underline'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ~/npm
                </Link>
              </div>

              <div className='flex items-center'>
                <BookMarked className='mr-1 h-4 w-4' />
                <Link
                  href='/docs'
                  className='block text-primary hover:underline'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ~/docs
                </Link>
              </div>

              <div className='flex items-center'>
                <Github className='mr-1 size-4 text-foreground' />
                <Link
                  href='https://www.github.com/better-t-stack/create-better-t-stack'
                  target='_blank'
                  className='block text-primary hover:underline'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ~/github
                </Link>
              </div>
            </div>

            <div className='mt-6 pb-3'>
              <span className='text-[--color-chart-4]'>
                user@better-t-stack
              </span>
              <span className='text-muted-foreground'>:~$</span>
              <span className='ml-2 text-foreground'>star-repo</span>
            </div>

            <div className='border-border border-l-2 pb-2 pl-4'>
              <Link
                href='https://www.github.com/better-t-stack/create-better-t-stack'
                target='_blank'
                className='inline-flex items-center rounded-md bg-muted px-4 py-2 text-foreground transition-colors hover:bg-muted/80'
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className='mr-1 size-5' />
                Star on GitHub
              </Link>
            </div>

            <div className='mt-4'>
              <span className='text-[--color-chart-4]'>
                user@better-t-stack
              </span>
              <span className='text-muted-foreground'>:~$</span>
              <span className='ml-2 animate-pulse text-foreground'>█</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
