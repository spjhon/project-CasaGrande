import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'es'],
 
  // Used when no locale matches
  defaultLocale: 'en',

  pathnames: {
    '/': {
      es: '/',
    },

    '/about': {
      es: '/acercadenosotors'
    },

    '/explore/[[...filtros]]': {
      es: '/explorar/[[...filtros]]'
    },
    

    
  }
});