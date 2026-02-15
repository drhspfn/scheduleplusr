"use client";

import {
  Typography,
  Button,
  Space,
  Row,
  Col,
  Card,
  List,
  Tag,
  Badge,
} from "antd";
import {
  CalendarOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { FeedbackForm } from "@/components/shared/FeedbackForm";

const { Title, Text, Paragraph } = Typography;

export default function HomePage() {
  const { selectedStudentId, toggleModal, getCurUni } = useAppStore();
  const router = useRouter();
  const uni = getCurUni();

  const roadmap = [
    { title: "НУ «Запорізька політехніка»", status: "active" },
    { title: "ЗНУ (Запорізький національний)", status: "soon" },
    { title: "КПІ ім. Сікорського", status: "planned" },
    { title: "Львівська політехніка", status: "planned" },
  ];

  const getStatusTag = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Працює
          </Tag>
        );
      case "soon":
        return (
          <Tag color="processing" icon={<ClockCircleOutlined />}>
            Скоро
          </Tag>
        );
      default:
        return <Tag color="default">В планах</Tag>;
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <Badge
          count={<RocketOutlined style={{ color: "#f5222d" }} />}
          offset={[10, 0]}
        >
          <CalendarOutlined
            style={{
              fontSize: 64,
              color: "var(--ant-color-primary)",
              marginBottom: 24,
              display: "block",
            }}
          />
        </Badge>
        <Title level={1} style={{ marginBottom: 16 }}>
          Розклад занять
        </Title>

        <Paragraph
          type="secondary"
          style={{ fontSize: 18, maxWidth: 600, margin: "0 auto 32px auto" }}
        >
          Сучасний, швидкий та зручний перегляд пар для студентів
          <br />
          <Text strong style={{ color: "var(--ant-color-text-heading)" }}>
            {uni.name}
          </Text>
        </Paragraph>

        <div style={{ marginBottom: 40 }}>
          {selectedStudentId ? (
            <Space direction="vertical" size="large">
              <Button
                type="primary"
                size="large"
                shape="round"
                style={{ height: 50, padding: "0 40px", fontSize: 18 }}
                onClick={() => router.push("/schedule")}
              >
                Відкрити мій розклад
              </Button>
              <Button type="link" onClick={() => toggleModal("student", true)}>
                Змінити групу ({useAppStore.getState().selectedGroupName})
              </Button>
            </Space>
          ) : (
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{ height: 50, padding: "0 40px", fontSize: 18 }}
              onClick={() => toggleModal("student", true)}
            >
              Обрати свою групу
            </Button>
          )}
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <RocketOutlined /> Ми масштабуємось!
              </Space>
            }
            bordered={false}
            style={{
              height: "100%",
              boxShadow: "var(--ant-box-shadow-tertiary)",
            }}
          >
            <Paragraph type="secondary">
              Ми постійно працюємо над додаванням нових навчальних закладів. Ось
              поточний статус підтримки ВНЗ України:
            </Paragraph>
            <List
              itemLayout="horizontal"
              dataSource={roadmap}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={getStatusTag(item.status)}
                  />
                </List.Item>
              )}
            />
            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "var(--ant-color-fill-secondary)",
                borderRadius: 8,
              }}
            >
              <Text type="secondary" style={{ fontSize: 12 }}>
                * Якщо вашого університету немає у списку, ви можете залишити
                заявку через форму зворотнього зв'язку.
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <FeedbackForm />
        </Col>
      </Row>
    </div>
  );
}
