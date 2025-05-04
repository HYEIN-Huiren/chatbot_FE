import { Button, Input, Space, message } from "antd";
import React, { useState } from "react";
import axios, { createNewInstance } from "@/apis/callApi";
import { APIResponse } from "@/apis/ts";
import { Axios } from "axios";
// import { TfiAlignJustify } from "react-icons/tfi";
// import { PiNotePencilLight } from "react-icons/pi";
// import { BsSend } from "react-icons/bs";
// import { VscTrash } from "react-icons/vsc";
import "../../style/ChatbotMain.css";

interface ResponseEntity {
    regId: string;
    regDt: string;
    modId: string;
    modDt: string;
    qseq: number;
    question: string;
    date: string;
    id: string;
    use: boolean;
}

// 챗봇 질문 & 응답
const ChatbotPage = () => {
    // 관리자 페이지로 이동
    const navigate = useNavigate();

    const callApi = axios();
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<any>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [questions, setQuestions] = useState<any>([]);
    const [recommend, setRecommend] = useState([]);
    const [showRecommend, setShowRecommend] = useState(false);

    useEffect(() => {
        setShowRecommend(true);
    }, [messages]);

    // 이전 질문 목록 (select)
    const fncGetPrevData = async () => {
        const { data, isSuccess }: APIResponse = await callApi
            .post("/chat/selectquestion")
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            const prevQuestionList = data.map((item: ResponseEntity) => ({ question: item.question, qseq: item.qseq }));
            setQuestions(prevQuestionList);
        }
    };

    // 이전 질문 목록 (delete)
    const deletePrevData = async (qseq) => {
        const { data, isSuccess }: APIResponse = await callApi
            .post("/chat/updateuse", qseq)
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            fncGetPrevData();
        }
    };

    // 이전 질문 목록 (insert)
    const savePrevMessage = async (question) => {
        const { data, isSuccess }: APIResponse = await callApi
            .post("/chat/insertquestion", question)
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            fncGetPrevData();
        }
    };

    // chatbot 응답 (DB)
    const chatbotData = async (inputText) => {
        const { data, isSuccess }: APIResponse = await callApi
            .post("/chat/filter", inputText)
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            return data;
        }
    };

    // chatbot 응답 (chatGPT)
    const gptData = async (prompt) => {
        try {
            let language: string = "";
            const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
            if (isKorean.test(prompt)) {
                language = "ko";
            } else {
                language = "en";
            }
            const instance: Axios = createNewInstance("http://localhost:8090/");
            const { data, isSuccess }: APIResponse = await instance
                .post("sql", {
                    question: prompt,
                    language: language,
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Access-Control-Allow-Origin": "*",
                        "Accept-Language": "ko-KR"
                    },
                    timeout: 10000,
                    responseType: "json"
                })
                .then()
                .catch((error) => {
                    Promise.reject(error.response);
                })
                .then(function (response) {
                    return { data: response.data.message.answer, isSuccess: response.data.isSuccess };
                })
                .catch((error) => {
                    Promise.reject(error.response);
                });
            // if (!data) ""
            return data;

            // const response = await fetch(apiEndpoint, requestOptions);
            // const data = await response.json();
            // const aiResponse = data.choices[0].message.content;
            // return aiResponse;
        } catch (error) {
            console.error("OpenAI API 호출 중 오류 발생:", error);
            return "죄송합니다. 못들었어요. 다시 질문해줄래요?";
        }
    };

    //GPT답변을 DB에 저장
    const insertGPTResponse = async (inputText, gptResponse) => {
        const requestData = {
            inputText: inputText,
            gptResponse: gptResponse
        };

        const { data, isSuccess }: APIResponse = await callApi
            .post("/chat/insertgpt", requestData)
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            console.log("GPT 답변 DB 저장 성공");
        }
    };

    const addMessage = (sender, message) => {
        setMessages((prevMessages) => {
            return [{ sender: sender, message: message }, ...prevMessages];
        });
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    // 사용자가 input에 입력한 값 가져오기
    const handleInputMessage = (e) => {
        setInputText(e.target.value);
    };

    // 추천 검색어
    const addRecommend = async (question, message) => {
        console.log(question);
        console.log(message);
        const recommendData = {
            question: question,
            message: message
        };

        console.log(recommendData);

        const { data, isSuccess }: APIResponse = await callApi
            .post("/chat/selectRecommend", recommendData)
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            const recommendList = data.map((item) => item.question);
            setRecommend(recommendList);
        }
    };

    // 전송 버튼 클릭 시
    const handleSendMessage = async () => {
        // 사용자가 입력한 질문이 없다면
        if (inputText.length === 0) return;
        // 사용자가 입력한 질문
        addMessage("user", inputText);
        // 이전 질문 목록에 사용자 질문 추가
        savePrevMessage(inputText);
        setInputText("");
        let lastResponse = "";

        // 1. DB
        const dbResponse = await chatbotData(inputText);

        // DB에 응답이 있는지 확인
        if (dbResponse.length != 0) {
            // DB에서 가져온 답변 갯수만큼 출력
            for (let i = 0; i < dbResponse.length; i++) {
                addMessage("DB", dbResponse[i].answer);
                lastResponse = dbResponse[i].answer;
            }
            addRecommend(inputText, lastResponse);
        } else {
            // 3. chatGPT
            const gptResponse = await gptData(inputText);
            await insertGPTResponse(inputText, gptResponse);
            addMessage("ChatGPT", gptResponse);
        }
    };

    // 추천 검색어, 이전 질문 목록의 질문 클릭시
    const handleQuestionClick = async (inputText) => {
        let lastResponse = "";

        addMessage("user", inputText);
        savePrevMessage(inputText);
        const dbResponse = await chatbotData(inputText);

        for (let i = 0; i < dbResponse.length; i++) {
            addMessage("DB", dbResponse[i].answer);
            lastResponse = dbResponse[i].answer;
        }
        addRecommend(inputText, lastResponse);
    };

    return (
        <>
            <div className="wrap">
                <div className="header">
                    <Button
                        className="adminBtn"
                        type="link"
                        onClick={() => {
                            navigate("/pages/chatbot/ChatbotAdminPage");
                        }}
                    >
                        {/* <PiNotePencilLight style={{ fontSize: "30px", color: "#5E94EC" }} /> */}
                    </Button>

                    <Button
                        className="prevBtn"
                        type="link"
                        onClick={() => {
                            toggleHistory();
                            fncGetPrevData();
                        }}
                    >
                        {/* <TfiAlignJustify style={{ fontSize: "23px", color: "black" }} /> */}
                    </Button>
                </div>

                <div className="chatWrap">
                    <div className="chatContainer">
                        <div className="chatMessage">
                            {/* 추천 검색어 */}
                            {showRecommend && (
                                <div className="recommendWrap">
                                    <div className="recommendList">
                                        {recommend.map((recommendQuestion, index) => (
                                            <div className="suggestion" key={index}>
                                                <Button
                                                    className="recommendBtn"
                                                    type="primary"
                                                    onClick={() => handleQuestionClick(recommendQuestion)}
                                                >
                                                    {recommendQuestion}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((chat, index) => (
                                <div key={index} className={`${chat.sender}_message`}>
                                    {chat.sender === "user" ? chat.message : `${chat.sender} : ${chat.message}`}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="userInput">
                        <Space.Compact style={{ width: "100%" }}>
                            <Input
                                className="messageInput"
                                placeholder="메시지를 입력하세요."
                                value={inputText}
                                onChange={handleInputMessage}
                                onPressEnter={handleSendMessage}
                            />
                            <Button className="messageBtn" type="primary" onClick={handleSendMessage}>
                                {/* <BsSend
                                    style={{
                                        fontSize: "26px",
                                        paddingTop: "3px"
                                    }}
                                /> */}
                            </Button>
                        </Space.Compact>
                    </div>
                </div>
            </div>

            {showHistory && (
                <div className="navbar">
                    <div className="historyWrap">
                        <p className="historyTitle">이전 질문 목록</p>
                    </div>
                    <div className="historyContent">
                        <ul className="historyList">
                            {questions.map((prevQuestion, index) => (
                                <li key={index} className="historyItem">
                                    <span
                                        className="questionTxt"
                                        onClick={() => handleQuestionClick(prevQuestion.question)}
                                    >
                                        {prevQuestion.question}
                                    </span>
                                    <Button
                                        className="historyBtn"
                                        type="primary"
                                        onClick={() => deletePrevData(prevQuestion.qseq)}
                                    >
                                        {/* <VscTrash style={{ fontSize: "20px", color: "black" }} /> */}
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatbotPage;
