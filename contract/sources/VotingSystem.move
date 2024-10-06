module my_addrx::VotingSystem {
    use std::signer;
    use std::vector;
    use std::timestamp;
    use std::string::{String, utf8};

    // Struct to store each voting event
    struct VoteEvent has key, store, copy, drop {
        vote_id: u64,
        creator: address,
        title: String,
        description: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        votes: vector<u64>,
        voters: vector<address>,
        end_time: u64,
        is_open: bool,
    }

    // Resource to hold all voting events on the platform
    struct VotesHolder has key, store {
        votes: vector<VoteEvent>,
    }

    // Resource to store creators (admins) of voting events
    struct CreatorAddresses has key, store {
        addresses: vector<address>,
    }

    const GLOBAL_VOTES_ADDRESS: address = @vote_addrx; // Address to hold the VotesHolder

    // Error codes
    const ERR_VOTE_NOT_FOUND: u64 = 0;
    const ERR_ALREADY_VOTED: u64 = 1;
    const ERR_INVALID_OPTION: u64 = 2;
    const ERR_VOTE_MUST_HAVE_4_OPTIONS: u64 = 3;
    const ERR_VOTE_ALREADY_INITIALIZED: u64 = 4;
    const ERR_VOTE_ALREADY_CLOSED: u64 = 5;
    const ERR_UNAUTHORIZED_ACCESS: u64 = 6;

    // Initialize Votes Holder
    public entry fun initialize_votes(creator: &signer) {
        assert!(!exists<VotesHolder>(GLOBAL_VOTES_ADDRESS), ERR_VOTE_ALREADY_INITIALIZED);

        if (!exists<CreatorAddresses>(signer::address_of(creator))) {
            move_to<CreatorAddresses>(creator, CreatorAddresses { addresses: vector::empty() });
        };

        let votes_holder = VotesHolder { votes: vector::empty<VoteEvent>() };
        move_to(creator, votes_holder);
    }

    // Add creator address to the system
    fun add_creator_address(creator_addr: address) acquires CreatorAddresses {
        let creator_addresses = borrow_global_mut<CreatorAddresses>(GLOBAL_VOTES_ADDRESS);

        if (!vector::contains(&creator_addresses.addresses, &creator_addr)) {
            vector::push_back(&mut creator_addresses.addresses, creator_addr);
        };
    }

    // Create a new vote
    public entry fun create_vote(
        creator: &signer,
        vote_id: u64,
        title: String,
        description: String,
        option1: String,
        option2: String,
        option3: String,
        option4: String,
        end_time: u64
    ) acquires VotesHolder, CreatorAddresses {
        let creator_addr = signer::address_of(creator);
        let votes_holder = borrow_global_mut<VotesHolder>(GLOBAL_VOTES_ADDRESS);
       
        let new_vote = VoteEvent {
            vote_id: vote_id,
            title: title,
            description: description,
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

        vector::push_back(&mut new_vote.votes, 0); // Option 1 votes
        vector::push_back(&mut new_vote.votes, 0); // Option 2 votes
        vector::push_back(&mut new_vote.votes, 0); // Option 3 votes
        vector::push_back(&mut new_vote.votes, 0); // Option 4 votes

        vector::push_back(&mut votes_holder.votes, new_vote);
        add_creator_address(creator_addr);
    }

    // Cast a vote in a voting event
    public entry fun vote_in_event(
        voter: &signer,
        vote_id: u64,
        option_index: u64
    ) acquires VotesHolder {
        let voter_addr = signer::address_of(voter);
        let votes_holder = borrow_global_mut<VotesHolder>(GLOBAL_VOTES_ADDRESS);
        let votes_len = vector::length(&votes_holder.votes);

        let vote_index = 0;
        let found_vote = false;

        // Find the voting event by vote_id
        let i = 0;
        while (i < votes_len) {
            let current_vote_ref = vector::borrow(&votes_holder.votes, i);
            if (current_vote_ref.vote_id == vote_id) {
                vote_index = i;
                found_vote = true;
                break
            };
            i = i + 1;
        };

        assert!(found_vote, ERR_VOTE_NOT_FOUND);

        // Reference to the vote
        let vote_ref = vector::borrow_mut(&mut votes_holder.votes, vote_index);

        // Ensure voter hasn't already voted
        let voters_len = vector::length(&vote_ref.voters);
        let j = 0;
        while (j < voters_len) {
            let addr = vector::borrow(&vote_ref.voters, j);
            assert!(*addr != voter_addr, ERR_ALREADY_VOTED);
            j = j + 1;
        };

        // Ensure vote is still open and option is valid
        assert!(timestamp::now_seconds() <= vote_ref.end_time, ERR_VOTE_ALREADY_CLOSED);
        assert!(vote_ref.is_open, ERR_VOTE_ALREADY_CLOSED);
        assert!(option_index < 4, ERR_INVALID_OPTION);

        // Record vote
        vector::push_back(&mut vote_ref.voters, voter_addr);
        let current_votes = vector::borrow_mut(&mut vote_ref.votes, option_index);

        *current_votes = *current_votes + 1;
    }

    // Close voting event
    public entry fun close_vote(
        creator: &signer,
        vote_id: u64
    ) acquires VotesHolder {
        let votes_holder = borrow_global_mut<VotesHolder>(GLOBAL_VOTES_ADDRESS);
        let votes_len = vector::length(&votes_holder.votes);

        let vote_index = 0;
        let found = false;

        let i = 0;
        while (i < votes_len) {
            let vote_ref = vector::borrow(&votes_holder.votes, i);
            if (vote_ref.vote_id == vote_id) {
                vote_index = i;
                found = true;
                break
            };
            i = i + 1;
        };

        assert!(found, ERR_VOTE_NOT_FOUND);

        let vote_ref = vector::borrow_mut(&mut votes_holder.votes, vote_index);

        // Ensure only creator can close the vote
        assert!(vote_ref.creator == signer::address_of(creator), ERR_UNAUTHORIZED_ACCESS);

        vote_ref.is_open = false;
    }

    // View all votes
    #[view]
    public fun view_all_votes(): vector<VoteEvent> acquires VotesHolder {
        let votes_holder = borrow_global<VotesHolder>(GLOBAL_VOTES_ADDRESS);
        return votes_holder.votes
    }

    // View vote details by vote ID
    #[view]
    public fun view_vote_by_id(vote_id: u64): VoteEvent acquires VotesHolder {
        let votes_holder = borrow_global<VotesHolder>(GLOBAL_VOTES_ADDRESS);
        let i = 0;
        let votes_len = vector::length(&votes_holder.votes);

        while (i < votes_len) {
            let vote_ref = vector::borrow(&votes_holder.votes, i);
            if (vote_ref.vote_id == vote_id) {
                return *vote_ref
            };
            i = i + 1;
        };

        assert!(false, ERR_VOTE_NOT_FOUND);
        return *vector::borrow(&votes_holder.votes, 0)
    }

    // View the highest voted option in a vote
    #[view]
    public fun view_highest_voted_option(vote_id: u64): (String, u64) acquires VotesHolder {
        let votes_holder = borrow_global<VotesHolder>(GLOBAL_VOTES_ADDRESS);
        let votes_len = vector::length(&votes_holder.votes);

        let vote_index = 0;
        let found = false;

        let i = 0;
        while (i < votes_len) {
            let current_vote_ref = vector::borrow(&votes_holder.votes, i);
            if (current_vote_ref.vote_id == vote_id) {
                vote_index = i;
                found = true;
                break
            };
            i = i + 1;
        };

        assert!(found, ERR_VOTE_NOT_FOUND);

        let vote_ref = vector::borrow(&votes_holder.votes, vote_index);

        let highest_votes = 0;
        let highest_option = utf8(b"");

        // Find the highest vote count
        let j = 0;
        let votes_len = vector::length(&vote_ref.votes);

        while (j < votes_len) {
            let votes = vector::borrow(&vote_ref.votes, j);

            if (*votes > highest_votes) {
                highest_votes = *votes;
                highest_option = if (j == 0) { vote_ref.option1 } else if (j == 1) { vote_ref.option2 } else if (j == 2) { vote_ref.option3 } else { vote_ref.option4 };
            };
            j = j + 1;
        };

        return (highest_option, highest_votes)
    }

    #[view]
    public fun view_votes_by_creator(creator: address): vector<VoteEvent> acquires VotesHolder {
        let votes_holder = borrow_global<VotesHolder>(GLOBAL_VOTES_ADDRESS);
        let votes_len = vector::length(&votes_holder.votes);
        let result = vector::empty<VoteEvent>();

        let i = 0;
        // Iterate over all votes and find votes where the creator matches the input address
        while (i < votes_len) {
            let vote_ref = vector::borrow(&votes_holder.votes, i);
            if (vote_ref.creator == creator) {
                vector::push_back(&mut result, *vote_ref);
            };
            i = i + 1;
        };

        return result
    }

    #[view]
    public fun view_votes_by_voter(voter: address): vector<VoteEvent> acquires VotesHolder {
        let votes_holder = borrow_global<VotesHolder>(GLOBAL_VOTES_ADDRESS);
        let votes_len = vector::length(&votes_holder.votes);
        let result = vector::empty<VoteEvent>();

        let i = 0;
        // Iterate over all votes
        while (i < votes_len) {
            let vote_ref = vector::borrow(&votes_holder.votes, i);
            let voters_len = vector::length(&vote_ref.voters);
            
            let j = 0;
            // Check if the voter has voted in the current vote event
            while (j < voters_len) {
                let addr = vector::borrow(&vote_ref.voters, j);
                if (*addr == voter) {
                    vector::push_back(&mut result, *vote_ref); // Add to result if the voter is found
                    break
                };
                j = j + 1;
            };

            i = i + 1;
        };

        return result
    }
}
