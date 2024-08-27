'use client'

import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, notification } from 'antd';
import { SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { useHasMounted } from '@/utils/customHook';
import { useForm } from 'antd/es/form/Form';
import { sendRequest } from '@/utils/api';

const ModelReactive = (props: any) => {
    const { isModalOpen, setIsModalOpen, userEmail } = props;
    const [current, setCurrent] = useState(0)
    const [form] = useForm();
    const hasMounted = useHasMounted();
    const [userId, setUserId] = useState(""); ``

    useEffect(() => {
        if (userEmail) {
            form.setFieldValue('email', userEmail);
        }
    }, [userEmail])
    if (!hasMounted) return <></>

    const onFinishStep0 = async (value: any) => {
        const { email } = value;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/retry-active`,
            method: "POST",
            body: {
                email,
            }
        })

        if (res?.statusCode === 201) {
            notification.info(res?.data?.message)
            setUserId(res?.data?._id)
            setCurrent(1);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }
    }

    const onFinishStep1 = async (value: any) => {
        const { code } = value;
        const res = await sendRequest<IBackendRes<any>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/check-code`,
            method: "POST",
            body: {
                code, _id: userId
            }
        })

        if (res?.data) {
            setCurrent(2);
        } else {
            notification.error({
                message: "Call APIs error",
                description: res?.message
            })
        }
    }
    return (
        <>
            <Modal title="Active Account" footer={null} maskClosable={false} onCancel={() => setIsModalOpen(false)} open={isModalOpen} onOk={() => setIsModalOpen(false)}>
                <Steps
                    current={current}
                    items={[
                        {
                            title: 'Login',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            icon: <SolutionOutlined />,
                        },
                        {
                            title: 'Done',
                            icon: <SmileOutlined />,
                        },
                    ]}
                />
                {current == 0 && (
                    <>
                        <p style={{ margin: "20px 0" }}> Account is not active</p>
                        <Form
                            name="verify1"
                            form={form}
                            onFinish={onFinishStep0}
                            autoComplete="off"
                            layout='vertical'
                        >
                            <Form.Item
                                label=""
                                name="email"

                            >
                                <Input disabled value={userEmail} />
                            </Form.Item>

                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Resend
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}
                {current == 1 && (
                    <>
                        <p style={{ margin: "20px 0" }}> Enter your active code</p>
                        <Form
                            name="verify2"
                            form={form}
                            onFinish={onFinishStep1}
                            autoComplete="off"
                            layout='vertical'
                        >
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Enter your code active!!!"
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                            >
                                <Button type="primary" htmlType="submit">
                                    Active
                                </Button>
                            </Form.Item>
                        </Form>
                    </>
                )}

                {current == 2 && (
                    <>
                        <div style={{ margin: "20px 0" }}>

                            <p> Your account is active successfully. Login again, please</p>
                        </div>

                    </>
                )}
            </Modal >
        </>
    );
};

export default ModelReactive;