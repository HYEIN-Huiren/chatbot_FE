import { Button, Form, Input } from "antd";
import axios from "@/apis/callApi";
import { APIResponse } from "@/apis/ts";

const ChatbotAdminModal = ({ onCancel, data }) => {
    const callApi = axios();
    const [form] = Form.useForm();

    form.setFieldsValue({
        answer: data.answer,
        chatbotDataSeq: data.chatbot_data_seq,
        question: data.question
    });

    const updateData = async (values) => {
        //update 날짜 설정
        const d = new Date();
        const month = d.getMonth();
        const y = d.getFullYear() + "-" + (month + 1) + "-" + d.getDate();

        const h = String(d.getHours()).padStart(2, "0");
        const m = String(d.getMinutes()).padStart(2, "0");
        const s = String(d.getSeconds()).padStart(2, "0");

        var updateDate = y + " " + h + ":" + m + ":" + s;
        values = {
            answer: values.answer,
            chatbotDataSeq: values.chatbotDataSeq,
            question: values.question,
            updateDate: updateDate
        };
        console.log(values);

        const { data, isSuccess }: APIResponse = await callApi
            .post("/chatAdmin/updateAnswer", values)
            .then(function (response) {
                return response.data;
            })
            .catch((error) => {
                Promise.reject(error.response);
            });
        if (isSuccess) {
            onCancel(false);
        }
    };

    return (
        <>
            <Form className="mt-4" labelCol={{ span: 6 }} name="control-hooks" form={form} onFinish={updateData}>
                <Form.Item name="answer" rules={[{ required: true }]}>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="chatbotDataSeq" style={{ display: "none" }}>
                    <Input></Input>
                </Form.Item>
                <Form.Item name="question" style={{ display: "none" }}>
                    <Input></Input>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button
                        htmlType="submit"
                        onClick={() => {
                            onCancel(false);
                        }}
                    >
                        Save changes
                    </Button>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button
                        htmlType="button"
                        onClick={() => {
                            onCancel(false);
                        }}
                    >
                        Close
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default ChatbotAdminModal;
