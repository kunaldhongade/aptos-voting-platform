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
      "The Voting App is a decentralized platform built on the Aptos blockchain, designed to enable secure and transparent voting events. Users can create proposals, vote on various topics, and track results in real time.",
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
        description: "Yesss! This project is completely Free to use and you can create as many proposal as you want.",
      },
      {
        title: "How To Create Proposal brief info?",
        description:
          "To create a proposal, connect your wallet, enter a question, options for answers, and submit. Your proposal will be added to the blockchain for participants to vote.",
      },
      {
        title: "How do I vote in a Proposal?",
        description:
          "Simply choose the proposal you want to participate in, select your preferred option, and submit your vote. All votes are recorded securely on the blockchain.",
      },
      {
        title: "Is it safe to use?",
        description:
          "Yes, Opinion proposal leverages blockchain security, ensuring votes cannot be tampered with and are transparently recorded.",
      },
      {
        title: "Can I close a Proposal?",
        description: "As a proposal creator, you can close your proposal when it's complete to stop further voting.",
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
