"use client"

/**
 * Shadcn primitives imports
 */
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


import {useParams} from 'next/navigation';
import {useTransition} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';

/**
 * Toggle for dark and light themes
 */
export function I18nToggle() {
  
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const params = useParams();

  function handleClick(language: string) {


    const nextLocale = language==="English" ? "en" : "es";
    
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <DropdownMenu>

      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="default"
          className="ghost"
          disabled={isPending}
        >
          Cambio de Idioma
          <span className="sr-only">Cambio de idioma</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleClick("English")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClick("Spanish")}>
          Español
        </DropdownMenuItem>
        
      </DropdownMenuContent>

    </DropdownMenu>
  );
}