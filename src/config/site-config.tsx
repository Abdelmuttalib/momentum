const BASE_SITE_URL = "https://momentum-gamma.vercel.app";

export const siteConfig = {
  appName: "Momentum",
  title: "Momentum",
  description: "A clean, fast issue tracker inspired by Linear.",
  url: BASE_SITE_URL,
  siteUrl: BASE_SITE_URL,

  seo: {
    title: "Momentum",
    description: "A clean, fast issue tracker inspired by Linear.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: BASE_SITE_URL,
      site_name: "Momentum",
    },
    twitter: {
      handle: "@abdelmuttalib",
      site: "@abdelmuttalib",
      cardType: "summary_large_image",
    },
  },

  pages: {
    main: {
      links: {
        overview: {
          title: "overview",
          href: "/overview",
        },
        teams: {
          title: "teams",
          href: "/teams",
        },
        projects: {
          title: "projects",
          href: (teamId: string) => `/teams/${teamId}/projects`,
        },
        signIn: {
          title: "sign in",
          href: "/sign-in",
        },
      },
    },
  },

  githubUrl: "https://github.com/Abdelmuttalib/momentum",

  logo: "",
  image: "",
  twitter: "",
};
