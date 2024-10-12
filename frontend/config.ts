import Placeholder1 from "@/assets/placeholders/bear-1.png";
import Placeholder2 from "@/assets/placeholders/bear-2.png";
import Placeholder3 from "@/assets/placeholders/bear-3.png";

export const config: Config = {
  // Removing one or all of these socials will remove them from the page
  socials: {
    twitter: "https://twitter.com/",
    discord: "https://discord.com",
    homepage: "/",
  },

  defaultCollection: {
    name: "Voting Proposals",
    description: "A collection of decentralized voting proposals securely recorded on the Aptos blockchain.",
    image: Placeholder1,
  },

  ourStory: {
    title: "Our Story",
    subTitle: "Innovative Opinion Platform on Aptos",
    description:
      "The Voting App is a decentralized platform built on the Aptos blockchain, designed to enable secure and transparent voting events. Users can create proposals, vote on various topics, and track results in real time.",
    discordLink: "https://discord.com",
    images: [Placeholder1, Placeholder2, Placeholder3],
  },

  ourTeam: {
    title: "Our Team",
    members: [
      {
        name: "Alex",
        role: "Blockchain Developer",
        img: Placeholder1,
        socials: {
          twitter: "https://twitter.com",
        },
      },
      {
        name: "Jordan",
        role: "Marketing Specialist",
        img: Placeholder2,
      },
      {
        name: "Taylor",
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
        title: "Is this project free for creators and voters?",
        description: "Yes! This project is completely free to use, and you can create as many proposals as you want.",
      },
      {
        title: "How do I create a proposal?",
        description:
          "To create a proposal, connect your wallet, enter a question, provide options for answers, and submit. Your proposal will be added to the blockchain for participants to vote.",
      },
      {
        title: "How do I vote in a proposal?",
        description:
          "Simply choose the proposal you want to participate in, select your preferred option, and submit your vote. All votes are recorded securely on the blockchain.",
      },
      {
        title: "Is it safe to use?",
        description:
          "Yes, the platform leverages blockchain security, ensuring that votes cannot be tampered with and are transparently recorded.",
      },
      {
        title: "Can I close a proposal?",
        description: "As a proposal creator, you can close your proposal once it's complete to stop further voting.",
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
