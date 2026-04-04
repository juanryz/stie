import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface UpdateStatusProps {
  nama: string;
  noPendaftaran: string;
  statusBaru: string;
  catatan?: string | null;
  statusUrl: string;
}

export function UpdateStatus({
  nama,
  noPendaftaran,
  statusBaru,
  catatan,
  statusUrl,
}: UpdateStatusProps) {
  return (
    <Html lang="id">
      <Head />
      <Preview>Update status pendaftaran Anda: {statusBaru}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>PMB STIE Anindyaguna</Heading>
            <Text style={headerSubtitle}>Update Status Pendaftaran</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Yth. {nama},</Text>
            <Text style={paragraph}>
              Status pendaftaran Anda telah diperbarui oleh panitia PMB.
            </Text>

            {/* No. Pendaftaran */}
            <Text style={noText}>
              No. Pendaftaran: <strong style={{ fontFamily: "monospace" }}>{noPendaftaran}</strong>
            </Text>

            {/* Status baru */}
            <Section style={statusBox}>
              <Text style={statusLabel}>Status Terbaru</Text>
              <Text style={statusValue}>{statusBaru}</Text>
            </Section>

            {/* Catatan */}
            {catatan && (
              <Section style={catatanBox}>
                <Text style={catatanLabel}>Catatan dari Panitia</Text>
                <Text style={catatanText}>{catatan}</Text>
              </Section>
            )}

            <Text style={paragraph}>
              Kunjungi portal PMB untuk informasi selengkapnya dan langkah-langkah selanjutnya.
            </Text>

            <Button style={button} href={statusUrl}>
              Lihat Detail Status
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Email ini dikirim otomatis oleh sistem PMB STIE Anindyaguna.
              Jangan membalas email ini. Untuk pertanyaan, hubungi panitia di{" "}
              <a href="mailto:pmb@anindyaguna.ac.id" style={link}>
                pmb@anindyaguna.ac.id
              </a>
            </Text>
            <Text style={footerText}>
              © {new Date().getFullYear()} STIE Anindyaguna Semarang. Semua hak dilindungi.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main: React.CSSProperties = {
  backgroundColor: "#F8FAFC",
  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "560px",
};

const header: React.CSSProperties = {
  backgroundColor: "#1B4F72",
  borderRadius: "8px 8px 0 0",
  padding: "28px 32px",
  textAlign: "center",
};

const headerTitle: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0",
};

const headerSubtitle: React.CSSProperties = {
  color: "rgba(255,255,255,0.75)",
  fontSize: "13px",
  margin: "4px 0 0",
};

const content: React.CSSProperties = {
  backgroundColor: "#ffffff",
  padding: "28px 32px",
};

const greeting: React.CSSProperties = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "0 0 12px",
};

const paragraph: React.CSSProperties = {
  fontSize: "14px",
  color: "#4a5568",
  lineHeight: "1.6",
  margin: "0 0 16px",
};

const noText: React.CSSProperties = {
  fontSize: "13px",
  color: "#718096",
  margin: "0 0 16px",
};

const statusBox: React.CSSProperties = {
  backgroundColor: "#EAF2F8",
  border: "1px solid #AED6F1",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0 0 16px",
  textAlign: "center",
};

const statusLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#1B4F72",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: "600",
  margin: "0 0 6px",
};

const statusValue: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#1B4F72",
  margin: "0",
};

const catatanBox: React.CSSProperties = {
  backgroundColor: "#FFFBEB",
  border: "1px solid #FCD34D",
  borderRadius: "6px",
  padding: "12px 16px",
  margin: "0 0 16px",
};

const catatanLabel: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: "700",
  color: "#92400E",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 6px",
};

const catatanText: React.CSSProperties = {
  fontSize: "13px",
  color: "#78350F",
  margin: "0",
  lineHeight: "1.5",
};

const button: React.CSSProperties = {
  backgroundColor: "#1B4F72",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center",
  display: "block",
  padding: "12px 24px",
  margin: "16px 0 0",
};

const hr: React.CSSProperties = {
  borderColor: "#E2E8F0",
  margin: "0",
};

const footer: React.CSSProperties = {
  backgroundColor: "#F7FAFC",
  borderRadius: "0 0 8px 8px",
  padding: "16px 32px",
};

const footerText: React.CSSProperties = {
  fontSize: "11px",
  color: "#A0AEC0",
  textAlign: "center",
  margin: "0 0 4px",
  lineHeight: "1.5",
};

const link: React.CSSProperties = {
  color: "#1B4F72",
};

export default UpdateStatus;
