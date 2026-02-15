"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  App,
  Card,
  Typography,
  Row,
  Col,
} from "antd";
import { SendOutlined } from "@ant-design/icons";

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScNB-Tw03jE8XnPpEw-lv759GgoY_Bx3nkabiaoFZwDjjBO6w/formResponse";

const FIELD_IDS = {
  TYPE: "entry.1179844622",
  NAME: "entry.2057793369",
  CONTACT: "entry.1794317327",
  MESSAGE: "entry.39965230",
};

export const FeedbackForm = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: any) => {
    setLoading(true);

    const formData = new FormData();
    formData.append(FIELD_IDS.TYPE, values.type);
    formData.append(FIELD_IDS.NAME, values.name);
    formData.append(FIELD_IDS.CONTACT, values.contact);
    formData.append(FIELD_IDS.MESSAGE, values.message);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });

      message.success("Дякуємо! Ваше повідомлення відправлено.");
      form.resetFields();
    } catch (error) {
      message.error("Щось пішло не так. Спробуйте пізніше.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Зворотній зв'язок"
      bordered={false}
      style={{
        boxShadow: "var(--ant-box-shadow-tertiary)",
        borderRadius: 16,
      }}
    >
      <Typography.Paragraph
        type="secondary"
        style={{ fontSize: 13, marginBottom: 20 }}
      >
        Знайшли помилку? Хочете додати свій університет? Напишіть нам, ми
        читаємо все!
      </Typography.Paragraph>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[12, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="name"
              label="Як вас звати?"
              rules={[{ required: true, message: "Вкажіть ім'я" }]}
            >
              <Input placeholder="Іван" size="large" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="contact"
              label="Зв'язок (TG/Email)"
              rules={[
                { required: true, message: "Вкажіть контакт для відповіді" },
                {
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();

                    const emailRegex =
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                    const tgRegex = /^@?[a-zA-Z0-9_]{5,32}$/;

                    if (emailRegex.test(value) || tgRegex.test(value)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(
                      new Error(
                        "Введіть коректний Email або Telegram нікнейм (мін. 5 симв.)",
                      ),
                    );
                  },
                },
              ]}
            >
              <Input
                placeholder="@username або email@example.com"
                size="large"
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="type"
          label="Тема звернення"
          initialValue="Пропозиція"
          rules={[{ required: true }]}
        >
          <Select
            size="large"
            options={[
              { value: "Додати університет", label: "🏫 Додати університет" },
              { value: "Помилка", label: "🐛 Повідомити про помилку" },
              { value: "Пропозиція", label: "💡 Пропозиція" },
              { value: "Інше", label: "📝 Інше" },
            ]}
          />
        </Form.Item>

        <Form.Item
          name="message"
          label="Повідомлення"
          rules={[{ required: true, message: "Напишіть щось..." }]}
        >
          <Input.TextArea rows={4} placeholder="Опишіть деталі..." />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
          size="large"
          icon={<SendOutlined />}
          loading={loading}
          style={{ height: 48, borderRadius: 8 }}
        >
          Надіслати
        </Button>
      </Form>
    </Card>
  );
};
