import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { CSSProperties } from "react";

const LOGO_SRC = "https://gccadmin.jeffsegovia.dev/gcc-logo.png";

interface CellReportReminderEmailProps {
  name: string;
}

export default function CellReportReminderEmail({
  name,
}: CellReportReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Cell Report Reminder</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={imageSection}>
              <Img
                src={LOGO_SRC}
                width="40"
                height="40"
                alt="Grace City Church - Morong, Rizal"
              />
            </Section>
            <Section style={upperSection}>
              <Heading style={h1}>Create Your Cell Reports</Heading>
              <Text style={mainText}>
                Hi {name}!
                <br />
                <br /> This is a reminder that you must not forget to encode all
                your Cell Reports for this week. Being responsible enough to do
                even the smallest of tasks glorifies the Lord.
              </Text>
              <Text style={text}>
                <strong>Remember:</strong>
              </Text>
              <Text style={quoteBodyText}>
                He who is faithful in what is least is faithful also in much.
                <br />
                <strong>Luke 16:10</strong>
              </Text>
            </Section>
            <Section style={lowerSection}>
              <Text style={text}>
                Click the button below to create your Cell Reports:
              </Text>
              <Link
                href="https://gccadmin.jeffsegovia.dev/cell-reports"
                target="_blank"
                style={{
                  ...text,
                  color: "#fff",
                  lineHeight: 1.5,
                  borderRadius: "0.5em",
                  padding: "12px 24px",
                  backgroundColor: "#741FE6",
                }}
              >
                Create Cell Report
              </Link>
              <br />
              <br />
              <Text style={text}>
                With grace,
                <br />
                GCC Admin Team
              </Text>
            </Section>
            <Hr />
            <Section style={lowerSection}>
              <Text style={footerText}>
                This message was produced and distributed by GCC Admin ©{" "}
                {new Date().getFullYear()}.
              </Text>
              <Text style={{ textAlign: "center" }}>
                <Link
                  href="https://gccadmin.jeffsegovia.dev"
                  target="_blank"
                  style={link}
                >
                  GCC Admin Portal
                </Link>
                ・{" "}
                <Link
                  href="https://gccadmin.jeffsegovia.dev/gcc-resources"
                  target="_blank"
                  style={link}
                >
                  GCC Resources
                </Link>
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

CellReportReminderEmail.PreviewProps = {
  name: "Jeff Segovia",
};

const main = {
  backgroundColor: "#fff",
  color: "#212121",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
};

const h1 = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
};

const link = {
  color: "#2754C5",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "12px",
  textDecoration: "underline",
};

const text = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
};

const imageSection: CSSProperties = {
  backgroundColor: "#09090B",
  display: "flex",
  padding: "20px",
  alignItems: "center",
  justifyContent: "center",
};

const coverSection = { backgroundColor: "#fff" };

const upperSection = { padding: "10px 30px" };

const lowerSection = { padding: "30px", paddingTop: "0" };

const footerText = {
  ...text,
  fontSize: "12px",
  padding: "0 20px",
};

const quoteBodyText: CSSProperties = {
  color: "#333",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  fontStyle: "italic",
  marginBottom: 0,
};

const mainText = { ...text, marginBottom: "14px" };
