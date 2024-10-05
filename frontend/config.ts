import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com/kunaldhongade",
    discord: "https://discord.com",
    homepage: "https://kunaldhongade.vercel.app",
  },

  defaultCollection: {
    name: "Lorem Ipsum",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris congue convallis augue in pharetra.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "Innovative Opinion Platform on Aptos",
    description:
      "The PublicOpinionPoll smart contract allows users to create and vote on decentralized polls using DIDs for identity verification. It tracks poll details, vote counts, and results, while enabling event-based interactions on Aptos.",
    discordLink: "https://discord.com",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Kunal",
        role: "Blockchain Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com/kunaldhongade",
        },
      },
      {
        name: "Soham",
        role: "Marketing Specialist",
        img: Placeholder2,
      },
      {
        name: "Amrita",
        role: "Community Manager",
        img: Placeholder3,
        socials: {
          twitter: "https://twitter.com",
        },
      },
    ],
  },

  faqs: {
    title: "F.A.Q.",

    questions: [
      {
        title: "Is this project is Free for creator and voter?",
        description: "Yesss! This project is completely Free to use and you can create as many Poll as you want.",
      },
      {
        title: "How To Create POLLs brief info?",
        description:
          "To create a poll, connect your wallet, enter a question, options for answers, and submit. Your poll will be added to the blockchain for participants to vote.",
      },
      {
        title: "How do I vote in a poll?",
        description:
          "Simply choose the poll you want to participate in, select your preferred option, and submit your vote. All votes are recorded securely on the blockchain.",
      },
      {
        title: "Is it safe to use?",
        description:
          "Yes, Opinion Poll leverages blockchain security, ensuring votes cannot be tampered with and are transparently recorded.",
      },
      {
        title: "Can I close a poll?",
        description: "As a poll creator, you can close your poll when it's complete to stop further voting.",
      },
    ],
  },

  nftBanner: [Placeholder1, Placeholder2, Placeholder3],
};

export interface Config {
  socials?: {
    twitter?: string;
    discord?: string;
    homepage?: string;
  };

  defaultCollection?: {
    name: string;
    description: string;
    image: string;
  };

  ourTeam?: {
    title: string;
    members: Array<ConfigTeamMember>;
  };

  ourStory?: {
    title: string;
    subTitle: string;
    description: string;
    discordLink: string;
    images?: Array<string>;
  };

  faqs?: {
    title: string;
    questions: Array<{
      title: string;
      description: string;
    }>;
  };

  nftBanner?: Array<string>;
}

export interface ConfigTeamMember {
  name: string;
  role: string;
  img: string;
  socials?: {
    twitter?: string;
    discord?: string;
  };
}
