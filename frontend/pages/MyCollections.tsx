import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Divider, Input, List, message, Radio, Table, Tag, Typography } from "antd";
import "dotenv/config";
import { useEffect, useState } from "react";
const { Column } = Table;

const { Title, Paragraph } = Typography;

interface Poll {
  vote_id: number;
  creator: string;
  title: string;
  description: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  votes: [];
  voters: [];
  is_open: boolean;
  end_time: number;
}

export function MyCollections() {
  const [pollId, setPollId] = useState<number | null>(null);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({});

  const { account, signAndSubmitTransaction } = useWallet();

  function formatTimestamp(timestamp: number) {
    const date = new Date(Number(timestamp * 1000));
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const returnDate = `${day} ${month} ${year} ${hours}:${minutes}`;

    return returnDate;
  }

  const fetchAllPolls = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::VotingSystem::view_votes_by_creator`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const pollList = result[0];

      if (Array.isArray(pollList)) {
        setPolls(pollList as Poll[]);
      } else {
        setPolls([]);
      }
    } catch (error) {
      console.error("Failed to fetch Proposals by address:", error);
    }
  };
  const fetchPoll = async (id: number) => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::VotingSystem::view_vote_by_id`,
        functionArguments: [id],
      };

      const result = await aptosClient().view({ payload });
      const fetchedPoll = result[0] as Poll;

      setPoll(fetchedPoll);
    } catch (error) {
      console.error("Failed to fetch poll:", error);
      message.error("Failed to fetch poll data.");
    }
  };

  const handleFetchPoll = () => {
    if (pollId !== null) {
      fetchPoll(pollId);
    } else {
      message.error("Please enter a valid poll ID.");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptionChange = (poll_id: number, value: any) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [poll_id]: value,
    }));
  };

  const handleVote = async (pollId: number) => {
    if (selectedOptions === null) {
      message.error("Please select an option to vote.");
      return;
    }

    console.log(selectedOptions);

    const getSelectedOptionIndex = (pollId: number) => {
      return selectedOptions[pollId] !== undefined ? selectedOptions[pollId] : null;
    };

    const selectedIndex = getSelectedOptionIndex(pollId);
    console.log(selectedIndex);
    try {
      const response = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::VotingSystem::vote_in_event`,
          functionArguments: [pollId, selectedIndex],
        },
      });
      message.success("You have voted successfully!");

      await aptosClient().waitForTransaction(response.hash);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user. You already Initialized Scholarship");
        console.error("Transaction rejected by user. You already Initialized Scholarship");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
    }
  };

  useEffect(() => {
    fetchAllPolls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <>
      <LaunchpadHeader title="View All Proposals" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>All Available Proposals on the Platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Table dataSource={polls} rowKey="vote_id" className="max-w-screen-xl mx-auto">
                <Column title="ID" dataIndex="vote_id" />
                <Column title="Title" dataIndex="title" />
                <Column
                  title="Description"
                  dataIndex="description"
                  render={(creator: string) => creator.substring(0, 200)}
                />
                <Column
                  title="Donor"
                  dataIndex="creator"
                  render={(creator: string) => creator.substring(0, 6)}
                  responsive={["lg"]}
                />
                <Column title="Opt 1" dataIndex="option1" responsive={["lg"]} />
                <Column title="Opt 2" dataIndex="option2" responsive={["lg"]} />
                <Column title="Opt 3" dataIndex="option3" responsive={["lg"]} />
                <Column title="Opt 4" dataIndex="option4" responsive={["lg"]} />

                <Column
                  title="Is Open"
                  dataIndex="is_open"
                  render={(is_open: boolean) => (is_open ? "Open" : "Closed")}
                  responsive={["md"]}
                />
                <Column
                  title="End Time"
                  dataIndex="end_time"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  render={(time: any) => formatTimestamp(time).toString()}
                  responsive={["md"]}
                />
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>View Poll By ID</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                <Input
                  placeholder="Enter Poll ID"
                  type="number"
                  value={pollId || ""}
                  onChange={(e) => setPollId(Number(e.target.value))}
                  style={{ marginBottom: 16 }}
                />
                <Button onClick={handleFetchPoll} variant="submit" size="lg" className="text-base w-full" type="submit">
                  Fetch Poll
                </Button>

                <Card style={{ marginTop: 16, padding: 16 }}>
                  {poll && (
                    <div>
                      <Title level={3}>Poll ID: {poll.vote_id}</Title>
                      <Divider />
                      <Paragraph>
                        <strong>Title:</strong> {poll.title}
                      </Paragraph>
                      <Paragraph>
                        <strong>Description:</strong> {poll.description}
                      </Paragraph>
                      <Paragraph>
                        <strong>Creator:</strong> <Tag>{poll.creator}</Tag>
                      </Paragraph>
                      <Paragraph strong>Options:</Paragraph>
                      <List
                        bordered
                        dataSource={[poll.option1, poll.option2, poll.option3, poll.option4]}
                        renderItem={(option, index) => <List.Item>{`${index} :  ${option}`}</List.Item>}
                      />
                      <Paragraph className="my-2">
                        <strong>Is Open:</strong>{" "}
                        {poll.is_open ? (
                          <Tag color="green">
                            <CheckCircleOutlined /> Yes
                          </Tag>
                        ) : (
                          <Tag color="red">
                            <CloseCircleOutlined /> No
                          </Tag>
                        )}
                      </Paragraph>
                      <Paragraph>
                        <strong>End Time:</strong> {new Date(poll.end_time * 1000).toLocaleString()}
                      </Paragraph>
                      <Paragraph>
                        <strong>Votes:</strong> {poll.votes.join(", ")}
                      </Paragraph>
                      <Divider />
                      <Paragraph strong>Voters:</Paragraph>
                      {poll.voters.length > 0 ? (
                        <List
                          bordered
                          dataSource={poll.voters}
                          renderItem={(voter) => <List.Item>{voter}</List.Item>}
                        />
                      ) : (
                        <Paragraph>No voters yet.</Paragraph>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get all Proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {polls.length > 0 ? (
                  polls.map((vote, index) => (
                    <Card key={index} className="mb-6 shadow-lg p-4">
                      <h4 className="text-xl font-bold mb-2">{vote.title}</h4>
                      <p className="text-sm text-gray-500 mb-4">Poll ID: {vote.vote_id}</p>
                      <p className="text-sm text-gray-500 mb-4">{vote.description}</p>

                      {/* Radio Group for Options */}
                      <Radio.Group
                        onChange={(e) => handleOptionChange(vote.vote_id, e.target.value)}
                        value={selectedOptions[vote.vote_id]}
                        className="flex flex-col space-y-4"
                      >
                        <Radio value={0} className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg">{vote.option1}</div>
                        </Radio>
                        <Radio value={1} className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg">{vote.option2}</div>
                        </Radio>
                        <Radio value={2} className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg">{vote.option3}</div>
                        </Radio>
                        <Radio value={3} className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg">{vote.option4}</div>
                        </Radio>
                      </Radio.Group>

                      <Button type="submit" className="mt-4 w-full" size="lg" onClick={() => handleVote(vote.vote_id)}>
                        Vote
                      </Button>
                    </Card>
                  ))
                ) : (
                  <p>No polls found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
