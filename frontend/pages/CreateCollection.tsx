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
import { Link } from "react-router-dom";

export function CreateCollection() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [pollsCreatedBy, setPollsCreatedBy] = useState<Poll[]>([]);
  const [pollID, setPollID] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: number }>({});
  interface Poll {
    poll_id: number;
    creator: string;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    votes: [];
    voters: [];
    is_open: boolean;
    end_time: number;
  }

  useEffect(() => {
    fetchAllPolls();
    fetchAllPollsCreatedBy();
  }, [account]);

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

  // function formatTimestamp(timestamp: number) {
  //   const date = new Date(Number(timestamp * 1000));
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  //   const year = date.getFullYear();
  //   const hours = String(date.getHours()).padStart(2, "0");
  //   const minutes = String(date.getMinutes()).padStart(2, "0");
  //   const returnDate = `${day} ${month} ${year} ${hours}:${minutes}`;

  //   return returnDate;
  // }

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
          function: `${MODULE_ADDRESS}::OpinionPoll::create_poll`,
          functionArguments: [
            pollId,
            values.question,
            values.option1,
            values.option2,
            values.option3,
            values.option4,
            end_time,
          ],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      message.success("Poll created!");
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
      console.log("Error creating scholarship.", error);
    } finally {
    }
  };

  const fetchAllPolls = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::OpinionPoll::view_all_polls`,
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
      console.log(polls);
    } catch (error) {
      console.error("Failed to fetch Polls:", error);
    } finally {
    }
  };

  const fetchAllPollsCreatedBy = async () => {
    try {
      const WalletAddr = account?.address;
      console.log(WalletAddr);
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::OpinionPoll::view_polls_by_creator`,
        functionArguments: [WalletAddr],
      };

      const result = await aptosClient().view({ payload });

      const pollList = result[0];

      if (Array.isArray(pollList)) {
        setPollsCreatedBy(
          pollList.map((poll: any) => ({
            poll_id: poll.poll_id,
            creator: poll.creator,
            question: poll.question,
            option1: poll.option1,
            option2: poll.option2,
            option3: poll.option3,
            option4: poll.option4,
            votes: poll.votes,
            voters: poll.voters,
            is_open: poll.is_open,
            end_time: poll.end_time,
          })),
        );
      } else {
        setPollsCreatedBy([]);
      }
      console.log(pollsCreatedBy);
    } catch (error) {
      console.error("Failed to fetch Polls by address:", error);
    } finally {
    }
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
          function: `${MODULE_ADDRESS}::OpinionPoll::vote_in_poll`,
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

  return (
    <>
      <LaunchpadHeader title="Create Polls" />
      <div className="flex flex-col md:flex-row items-start justify-between px-4 py-2 gap-4 max-w-screen-xl mx-auto">
        <div className="w-full md:w-2/3 flex flex-col gap-y-4 order-2 md:order-1">
          <Card>
            <CardHeader>
              <CardDescription>Create Opinion Polls</CardDescription>
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
                <Form.Item label="Question" name="question" rules={[{ required: true }]}>
                  <Input placeholder="Enter poll question" />
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
                    Create Poll
                  </Button>
                </Form.Item>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Get Poll Created By You</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-2">
                {pollsCreatedBy.map((poll, index) => (
                  <Card key={index} className="mb-6 shadow-lg p-4">
                    <h4 className="text-xl font-bold mb-2">{poll.question}</h4>
                    <p className="text-sm text-gray-500 mb-4">Poll ID: {poll.poll_id}</p>

                    {/* Radio Group for Options */}
                    <Radio.Group
                      onChange={(e) => handleOptionChange(poll.poll_id, e.target.value)}
                      value={selectedOptions[poll.poll_id]}
                      className="flex flex-col space-y-4"
                    >
                      <Radio value={0} className="flex items-center space-x-3">
                        <div className="p-2  rounded-lg">{poll.option1}</div>
                      </Radio>
                      <Radio value={1} className="flex items-center space-x-3">
                        <div className="p-2  rounded-lg">{poll.option2}</div>
                      </Radio>
                      <Radio value={2} className="flex items-center space-x-3">
                        <div className="p-2  rounded-lg">{poll.option3}</div>
                      </Radio>
                      <Radio value={3} className="flex items-center space-x-3">
                        <div className="p-2  rounded-lg">{poll.option4}</div>
                      </Radio>
                    </Radio.Group>

                    <Button type="submit" className="mt-4 w-full" size="lg" onClick={() => handleVote(poll.poll_id)}>
                      Vote
                    </Button>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-1/3 order-1 md:order-2">
          <Card>
            <CardHeader className="body-md-semibold">Learn More</CardHeader>
            <CardContent>
              <Link
                to="https://github.com/kunaldhongade/Aptos-opinion-poll"
                className="body-sm underline"
                target="_blank"
              >
                Find out more about the Platform
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
