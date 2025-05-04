import axios from "@/apis/callApi";
import { APIResponse } from "@/apis/ts";
import React, { useState, useRef } from "react";
import { Button, Form, Input, Modal, Table, Card, Col, Row, Select, Space } from "antd";
import ChatbotAdminModal from "./ChatbotAdminModal";
import { setInterval } from "timers/promises";
import "../../style/ChatbotAdmin.css";

const ChatbotAdminPage = () => {
    const callApi = axios();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showKeyword, setShowHistory] = useState(false);
    const [gridData, setGridData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [apiCount, setApiCount] = useState({
        gptAnswerCnt: "",
        clovaAnswerCnt: "",
        dbAnswerCnt: ""
    });
    const [apiName, setApiName] = useState("");
    const [keywordCount, setKeywordCount] = useState([]);

    useEffect(() => {
        console.log("useEffect 들어옴");
        getApiData("");
        getApiCount();
        getKeyword();
    }, []);

    const handleRowClick = (record: any) => {
        setSelectedRow(record);
        setIsModalOpen(true);
    };

    // chatbot 페이지로 이동
    const navigate = useNavigate();

    // 질문 검색
    const getData = async (values: any) => {
        const { data, isSuccess }: APIResponse = await callApi
            .post("/chatAdmin/selectQuestion", values.question)
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            setGridData(data);
        }
    };

    // api 별 질문 조회
    const getApiData = async (values: any) => {
        setApiName(values);
        const { data, isSuccess }: APIResponse = await callApi
            .post("/chatAdmin/paging", values)
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            setGridData(data);
        }
    };

    // api 마다 answerCount
    const getApiCount = async () => {
        const { data, isSuccess }: APIResponse = await callApi
            .post("/chatAdmin/selectApiCount")
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            setApiCount(data);
        }
    };

    // 실시간 키워드
    const getKeyword = async () => {
        const { data, isSuccess }: APIResponse = await callApi
            .post("/chatAdmin/selectFrequency")
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            setKeywordCount(data);
        }
    };

    const toggleKeyword = () => {
        setShowHistory(!showKeyword);
    };

    const columns = [
        {
            title: "QUESTION",
            dataIndex: "question",
            key: "question"
        },
        {
            title: "ANSWER",
            dataIndex: "answer",
            key: "answer"
        },

        {
            title: "INSERT DATE",
            dataIndex: "inserttime",
            key: "inserttime"
        },
        {
            title: "CURRENT UPDATE DATE",
            dataIndex: "updatetime",
            key: "updatetime"
        }
    ];

    return (
        <>
            <div className="adminWrap">
                <div className="adminHeader">
                    <div className="chatLink">
                        <Button
                            type="link"
                            onClick={() => {
                                navigate("/pages/chatbot/ChatbotPage");
                            }}
                        >
                            챗봇
                        </Button>
                    </div>

                    <div className="searchFormWrap">
                        <Form
                            onFinish={getData}
                            style={{
                                width: "100%"
                            }}
                        >
                            <Form.Item name="question">
                                <Input className="searchInput" placeholder="Search" />
                            </Form.Item>
                        </Form>
                    </div>
                    <div className="keywordWrap">
                        <div className="keywordContainer">
                            <ul className="bestSearch">
                                {showKeyword ? (
                                    keywordCount.map((keyword, index) => (
                                        <li key={index} className="keywordItem">
                                            {keyword.count}위 : {keyword.keyword} ({keyword.frequency})
                                        </li>
                                    ))
                                ) : (
                                    <li key={0} className="keywordItem">
                                        실시간 키워드
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="keywordBtn">
                            <Button htmlType="button" onClick={toggleKeyword} style={{ marginLeft: "30px" }}></Button>
                        </div>
                    </div>
                </div>

                <div className="listFormWrap">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card
                                title="GPT ANSWERCOUNT"
                                bordered={false}
                                onClick={() => getApiData("ChatGPT")}
                                style={{ cursor: "pointer" }}
                            >
                                {apiCount.gptAnswerCnt}
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card
                                title="CLOVA ANSWERCOUNT"
                                bordered={false}
                                onClick={() => getApiData("Clova")}
                                style={{ cursor: "pointer" }}
                            >
                                {apiCount.clovaAnswerCnt}
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card
                                title="DB ANSWERCOUNT"
                                bordered={false}
                                onClick={() => getApiData("DB")}
                                style={{ cursor: "pointer" }}
                            >
                                {apiCount.dbAnswerCnt}
                            </Card>
                        </Col>
                    </Row>
                </div>

                <div className="questionContainer">
                    <Table
                        dataSource={gridData}
                        columns={columns}
                        onRow={(record, index) => {
                            return {
                                onClick: () => {
                                    handleRowClick(record);
                                }
                            };
                        }}
                    />
                </div>
                <Modal
                    title={"답변을 수정하세요"}
                    open={isModalOpen}
                    footer={null}
                    width="60%"
                    style={{ top: 100 }}
                    onCancel={() => setIsModalOpen(false)}
                >
                    <ChatbotAdminModal
                        onCancel={() => {
                            setIsModalOpen(false);
                            getApiData(apiName);
                            getApiCount();
                            getKeyword();
                        }}
                        data={selectedRow}
                    ></ChatbotAdminModal>
                </Modal>
            </div>
        </>
    );
};

export default ChatbotAdminPage;
