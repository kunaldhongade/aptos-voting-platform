module my_addrx::OpinionPoll {
    use std::signer;
    use std::vector;
    use std::timestamp;
    use std::string::{String, utf8};

    // Struct to store each poll
    struct Poll has key, store, copy ,drop {
        poll_id: u64,
        creator: address,
        question: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        votes: vector<u64>,
        voters: vector<address>,
        end_time: u64,
        is_open: bool,
    }

    // Resource holding all polls on the platform
    struct PollsHolder has key, store {
        polls: vector<Poll>,
    }

    struct CreatorAddresses has key, store {
        addresses: vector<address>,
    }

    const GLOBAL_POLLS_ADDRESS: address = @poll_addrx; // Some address to hold the PollsHolder

    // Error codes
    const ERR_POLL_NOT_FOUND: u64 = 0;
    const ERR_ALREADY_VOTED: u64 = 1;
    const ERR_INVALID_OPTION: u64 = 2;
    const ERR_POLL_MUST_HAVE_4_OPTIONS: u64 = 3;
    const ERR_POLL_ALREADY_INITIALIZED: u64 = 4;
    const ERR_POLL_ALREADY_CLOASED: u64 = 5;
    const ERR_UNAUTHORIZED_ACCESS: u64 = 6;

    // Initialize Polls Holder
    public entry fun initialize_polls(creator: &signer) {
        assert!(!exists<PollsHolder>(GLOBAL_POLLS_ADDRESS), ERR_POLL_ALREADY_INITIALIZED);

        if(!exists<CreatorAddresses>(signer::address_of(creator))){
            move_to<CreatorAddresses>(creator, CreatorAddresses { addresses: vector::empty() });
        };

        let polls_holder = PollsHolder { polls: vector::empty<Poll>() };
        move_to(creator, polls_holder);
    }

    fun add_creator_address(creator_addr: address) acquires CreatorAddresses {
        let creator_addresses = borrow_global_mut<CreatorAddresses>(GLOBAL_POLLS_ADDRESS);

        if (!vector::contains(&creator_addresses.addresses, &creator_addr)) {
            vector::push_back(&mut creator_addresses.addresses, creator_addr);
        };
    }

    // Create a new poll
    public entry fun create_poll(
        creator: &signer,
        poll_id : u64,
        question: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        duration: u64
        ) acquires PollsHolder , CreatorAddresses {
        let creator_addr = signer::address_of(creator);
        let polls_holder = borrow_global_mut<PollsHolder>(GLOBAL_POLLS_ADDRESS);
        let end_time = timestamp::now_seconds() + duration;

        let new_poll = Poll {
            poll_id: poll_id,
            question: question,
            option1: option1,
            option2: option2,
            option3: option3,
            option4: option4,
            creator: creator_addr,
            end_time: end_time,
            is_open: true,
            votes: vector::empty<u64>(),
            voters: vector::empty<address>(),
        };

        vector::push_back(&mut new_poll.votes, 0); // Option 1 votes
        vector::push_back(&mut new_poll.votes, 0); // Option 2 votes
        vector::push_back(&mut new_poll.votes, 0); // Option 3 votes
        vector::push_back(&mut new_poll.votes, 0); // Option 4 votes        

        vector::push_back(&mut polls_holder.polls, new_poll);
        add_creator_address(creator_addr);
    }

    // Vote in a poll
    public entry fun vote_in_poll(
        voter: &signer,
        poll_id: u64,
        option_index: u64
    ) acquires PollsHolder {
        let voter_addr = signer::address_of(voter);
        let polls_holder = borrow_global_mut<PollsHolder>(GLOBAL_POLLS_ADDRESS);
        let polls_len = vector::length(&polls_holder.polls);

        let poll_index = 0;
        let found_poll = false;

        // First, find the index of the poll by poll_id
        let i = 0;
        while (i < polls_len) {
            let current_poll_ref = vector::borrow(&polls_holder.polls, i);
            if (current_poll_ref.poll_id == poll_id) {
                poll_index = i;
                found_poll = true;
                break
            };
            i = i + 1;
        };

        // Check if the poll was found
        assert!(found_poll, ERR_POLL_NOT_FOUND);

        // Now that we have the index, create a mutable reference to the poll
        let poll_ref = vector::borrow_mut(&mut polls_holder.polls, poll_index);

        // Check if the voter has already voted
        let voters_len = vector::length(&poll_ref.voters);
        let j = 0;
        while (j < voters_len) {
            let addr = vector::borrow(&poll_ref.voters, j);
            assert!(*addr != voter_addr, ERR_ALREADY_VOTED);
            j = j + 1;
        };

        // Check if the poll is still open and if the option index is valid
        assert!(timestamp::now_seconds() <= poll_ref.end_time, ERR_POLL_ALREADY_CLOASED);
        assert!(poll_ref.is_open, ERR_POLL_ALREADY_CLOASED);
        assert!(option_index < 4, ERR_INVALID_OPTION);

        // Add voter to the list and update the vote count
        vector::push_back(&mut poll_ref.voters, voter_addr);
        let current_votes = vector::borrow_mut(&mut poll_ref.votes, option_index);
        *current_votes = *current_votes + 1;
    }

    public entry fun close_poll(
        creator: &signer,
        poll_id: u64
    ) acquires PollsHolder {
        let polls_holder = borrow_global_mut<PollsHolder>(GLOBAL_POLLS_ADDRESS);
        let polls_len = vector::length(&polls_holder.polls);

        // Find the index of the poll by poll_id
        let poll_index = 0;
        let found = false;

        let i = 0;
        while (i < polls_len) {
            let poll_ref = vector::borrow(&polls_holder.polls, i);
            if (poll_ref.poll_id == poll_id) {
                poll_index = i;
                found = true;
                break
            };
            i = i + 1;
        };

        // Ensure the poll exists
        assert!(found, ERR_POLL_NOT_FOUND);

        // Get a mutable reference to the poll
        let poll_ref = vector::borrow_mut(&mut polls_holder.polls, poll_index);

        // Ensure the signer is the creator of the poll
        assert!(poll_ref.creator == signer::address_of(creator), ERR_UNAUTHORIZED_ACCESS);

        // Mark the poll as closed
        poll_ref.is_open = false;
    }


    // View all polls with their details
    #[view]
    public fun view_all_polls(): vector<Poll> acquires PollsHolder {
        let polls_holder = borrow_global<PollsHolder>(GLOBAL_POLLS_ADDRESS);
        return polls_holder.polls
    }

    // View creator of a poll by poll ID
    #[view]
    public fun get_creator_by_poll_id(poll_id: u64): address acquires PollsHolder {
        let polls_holder = borrow_global<PollsHolder>(GLOBAL_POLLS_ADDRESS);

        let i = 0;
        let polls_len = vector::length(&polls_holder.polls);

        // Iterate over the polls vector to find the poll with the matching poll_id
        while (i < polls_len) {
            let poll_ref = vector::borrow(&polls_holder.polls, i);
            if (poll_ref.poll_id == poll_id) {
                return poll_ref.creator // Return the creator's address
            };
            i = i + 1;
        };

        // If no poll is found, throw an error
        assert!(false, ERR_POLL_NOT_FOUND);
        return @0x0 // This is just to satisfy the compiler
    }
    // View specific poll details by poll ID
    #[view]
    public fun view_poll_by_id(poll_id: u64): Poll acquires PollsHolder {
        let polls_holder = borrow_global<PollsHolder>(GLOBAL_POLLS_ADDRESS);

        let i = 0;
        let polls_len = vector::length(&polls_holder.polls);

        // Iterate over the polls vector to find the poll with the matching poll_id
        while (i < polls_len) {
            let poll_ref = vector::borrow(&polls_holder.polls, i);
            if (poll_ref.poll_id == poll_id) {
                return *poll_ref // Return the matching poll
            };
            i = i + 1;
        };

        // If no poll is found, throw an error
        assert!(false, ERR_POLL_NOT_FOUND);
        return *vector::borrow(&polls_holder.polls, 0) // This is just to satisfy the compiler
    }

    // View the highest voted option in a poll
    #[view]
    public fun view_highest_voted_option(poll_id: u64): (String, u64) acquires PollsHolder {
        let polls_holder = borrow_global<PollsHolder>(GLOBAL_POLLS_ADDRESS);
        let polls_len = vector::length(&polls_holder.polls);

        // Find the poll by poll_id
        let poll_index = 0;
        let found = false;
        let i = 0;
        while (i < polls_len) {
            let current_poll_ref = vector::borrow(&polls_holder.polls, i);
            if (current_poll_ref.poll_id == poll_id) {
                poll_index = i;
                found = true;
                break
            };
            i = i + 1;
        };

        // Ensure the poll exists
        assert!(found, ERR_POLL_NOT_FOUND);

        // Get a reference to the poll
        let poll_ref = vector::borrow(&polls_holder.polls, poll_index);

        let highest_votes = 0;
        let highest_option = utf8(b"");

        // Iterate through the votes vector to find the highest vote count
        let j = 0;
        let votes_len = vector::length(&poll_ref.votes);

        while (j < votes_len) {
            let votes = vector::borrow(&poll_ref.votes, j);

            if (*votes > highest_votes) {
                highest_votes = *votes;

                // Set the highest voted option
                if (j == 0) {
                    highest_option = poll_ref.option1;
                } else if (j == 1) {
                    highest_option = poll_ref.option2;
                } else if (j == 2) {
                    highest_option = poll_ref.option3;
                } else {
                    highest_option = poll_ref.option4;
                };
            };
            j = j + 1;
        };

        return (highest_option, highest_votes)
    }

    #[view]
    public fun view_highest_voted_All_options(poll_id: u64): (vector<String>, u64) acquires PollsHolder {
        let polls_holder = borrow_global<PollsHolder>(GLOBAL_POLLS_ADDRESS);
        let polls_len = vector::length(&polls_holder.polls);

        // Find the poll by poll_id
        let poll_index = 0;
        let found = false;
        let i = 0;
        while (i < polls_len) {
            let current_poll_ref = vector::borrow(&polls_holder.polls, i);
            if (current_poll_ref.poll_id == poll_id) {
                poll_index = i;
                found = true;
                break
            };
            i = i + 1;
        };

        // Ensure the poll exists
        assert!(found, ERR_POLL_NOT_FOUND);

        // Get a reference to the poll
        let poll_ref = vector::borrow(&polls_holder.polls, poll_index);

        let highest_votes = 0;
        let highest_options: vector<String> = vector::empty<String>();

        // Iterate through the votes vector to find the highest vote count
        let j = 0;
        let votes_len = vector::length(&poll_ref.votes);

        while (j < votes_len) {
            let votes = vector::borrow(&poll_ref.votes, j);

            if (*votes > highest_votes) {
                highest_votes = *votes;
                // Clear the highest options vector by reassigning a new empty vector
                highest_options = vector::empty<String>();
                if (j == 0) {
                    vector::push_back(&mut highest_options, poll_ref.option1);
                } else if (j == 1) {
                    vector::push_back(&mut highest_options, poll_ref.option2);
                } else if (j == 2) {
                    vector::push_back(&mut highest_options, poll_ref.option3);
                } else {
                    vector::push_back(&mut highest_options, poll_ref.option4);
                };
            } else if (*votes == highest_votes) {
                // If the vote count is the same as the highest, add this option too
                if (j == 0) {
                    vector::push_back(&mut highest_options, poll_ref.option1);
                } else if (j == 1) {
                    vector::push_back(&mut highest_options, poll_ref.option2);
                } else if (j == 2) {
                    vector::push_back(&mut highest_options, poll_ref.option3);
                } else {
                    vector::push_back(&mut highest_options, poll_ref.option4);
                };
            };
            j = j + 1;
        };

        // Return all options with the highest votes and the vote count
        return (highest_options, highest_votes)
    }



    #[view]
    public fun view_polls_by_creator(creator: address): vector<Poll> acquires PollsHolder {
        let polls_holder = borrow_global<PollsHolder>(GLOBAL_POLLS_ADDRESS);
        let polls_len = vector::length(&polls_holder.polls);
        let result = vector::empty<Poll>();

        let i = 0;
        // Iterate over all polls and find polls where the creator matches the input address
        while (i < polls_len) {
            let poll_ref = vector::borrow(&polls_holder.polls, i);
            if (poll_ref.creator == creator) {
                vector::push_back(&mut result, *poll_ref);
            };
            i = i + 1;
        };

        return result // Return the vector of polls created by the specific address
    }

    #[view]
    public fun view_polls_by_voter(voter: address): vector<Poll> acquires PollsHolder {
        let polls_holder = borrow_global<PollsHolder>(GLOBAL_POLLS_ADDRESS);
        let polls_len = vector::length(&polls_holder.polls);
        let result = vector::empty<Poll>();

        let i = 0;
        // Iterate over all polls
        while (i < polls_len) {
            let poll_ref = vector::borrow(&polls_holder.polls, i);
            let voters_len = vector::length(&poll_ref.voters);
            
            let j = 0;
            // Check if the voter has voted in the current poll
            while (j < voters_len) {
                let addr = vector::borrow(&poll_ref.voters, j);
                if (*addr == voter) {
                    vector::push_back(&mut result, *poll_ref); // Add to result if the voter is found
                    break
                };
                j = j + 1;
            };

            i = i + 1;
        };

        return result // Return the vector of polls where the voter has voted
    }

}
