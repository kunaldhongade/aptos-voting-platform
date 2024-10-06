import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { isMobile, useWallet } from "@aptos-labs/wallet-adapter-react";
import { DatePicker, Form, message, Radio } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();

  const [, setPolls] = useState<Poll[]>([]);
  const [pollsCreatedBy, setPollsCreatedBy] = useState<Poll[]>([]);
  const [pollID, setPollID] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({});

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOptionChange = (poll_id: number, value: any) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [poll_id]: value,
    }));
  };

  const disabledDateTime = () => {
    const now = moment();
    return {
      disabledHours: () => [...Array(24).keys()].slice(0, now.hour()),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === now.hour()) {
          return [...Array(60).keys()].slice(0, now.minute());
        }
        return [];
      },
      disabledSeconds: (selectedHour: number, selectedMinute: number) => {
        if (selectedHour === now.hour() && selectedMinute === now.minute()) {
          return [...Array(60).keys()].slice(0, now.second());
        }
        return [];
      },
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const disabledDate = (current: any) => {
    return current && current < moment().endOf("day");
  };

  const handleCreatePoll = async (values: Poll) => {
    try {
      const pollId = pollID + 1000;
      const datePicker = values.end_time.toString();

      const timestamp = Date.parse(datePicker);
      const end_time = timestamp / 1000;

      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::VotingSystem::create_vote`,
          functionArguments: [
            pollId,
            values.title,
            values.description,
            values.option1,
            values.option2,
            values.option3,
            values.option4,
            end_time,
          ],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Proposal created!");
      fetchAllPolls();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error creating Proposal.", error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAllPolls = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::VotingSystem::view_all_votes`,
      };

      const result = await aptosClient().view({ payload });

      if (result[0]) {
        if (Array.isArray(result[0])) {
          setPollID(result[0].length);
        } else {
          setPollID(0);
        }
      } else {
        setPollID(0);
      }

      const pollList = result[0];

      if (Array.isArray(pollList)) {
        setPolls(pollList);
      } else {
        setPolls([]);
      }
    } catch (error) {
      console.error("Failed to fetch Proposals:", error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchAllPollsCreatedBy = async () => {
    try {
      const WalletAddr = account?.address;
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::VotingSystem::view_votes_by_creator`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const pollList = result[0];

      if (Array.isArray(pollList)) {
        setPollsCreatedBy(pollList as Poll[]);
      } else {
        setPollsCreatedBy([]);
      }
    } catch (error) {
      console.error("Failed to fetch Proposals by address:", error);
    }
  };

  const handleVote = async (pollId: number) => {
    if (selectedOptions === null) {
      message.error("Please select an option to vote.");
      return;
    }
    const getSelectedOptionIndex = (pollId: number) => {
      return selectedOptions[pollId] !== undefined ? selectedOptions[pollId] : null;
    };

    const selectedIndex = getSelectedOptionIndex(pollId);
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
    fetchAllPollsCreatedBy();
  }, [account, fetchAllPolls, fetchAllPollsCreatedBy]);

  return (
    <>
      <LaunchpadHeader title="Create Proposals" />
      <div className="flex flex-col items-center justify-center px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full flex flex-col gap-y-4">
          <Card>
            <CardHeader>
              <CardDescription>Create Proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onFinish={handleCreatePoll}
                labelCol={{
                  span: 3,
                }}
                wrapperCol={{
                  span: 100,
                }}
                layout="horizontal"
                style={{
                  maxWidth: 1000,
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                  padding: "1.7rem",
                }}
              >
                <Form.Item label="Title" name="title" rules={[{ required: true }]}>
                  <Input placeholder="Enter Title of Proposal" />
                </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true }]}>
                  <Input placeholder="Description goes here" />
                </Form.Item>
                <Form.Item label="Option 1" name="option1" rules={[{ required: true }]}>
                  <Input placeholder="Enter option 1" />
                </Form.Item>
                <Form.Item label="Option 2" name="option2" rules={[{ required: true }]}>
                  <Input placeholder="Enter option 2" />
                </Form.Item>
                <Form.Item label="Option 3" name="option3" rules={[{ required: true }]}>
                  <Input placeholder="Enter option 3" />
                </Form.Item>
                <Form.Item label="Option 4" name="option4" rules={[{ required: true }]}>
                  <Input placeholder="Enter option 4" />
                </Form.Item>
                <Form.Item name="end_time" label="End Time" rules={[{ required: true }]}>
                  <DatePicker
                    showTime={isMobile() ? false : true}
                    disabledDate={disabledDate}
                    disabledTime={disabledDateTime}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                    popupClassName="max-w-full sm:max-w-lg"
                    className="w-full"
                  />
                </Form.Item>
                <Form.Item>
                  <Button variant="submit" size="lg" className="text-base w-full" type="submit">
                    Create Proposal
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Proposals Created By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {pollsCreatedBy.length > 0 ? (
                  pollsCreatedBy.map((vote, index) => (
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
