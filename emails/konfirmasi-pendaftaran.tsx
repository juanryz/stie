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
  Row,
  Column,
} from "@react-email/components";

interface KonfirmasiPendaftaranProps {
  nama: string;
  noPendaftaran: string;
  namaProdi: string;
  jenjang: string;
  jalurMasuk: string;
  periode: string;
  statusUrl: string;
}

export function KonfirmasiPendaftaran({
  nama,
  noPendaftaran,
  namaProdi,
  jenjang,
  jalurMasuk,
  periode,
  statusUrl,
}: KonfirmasiPendaftaranProps) {
  return (
    <Html lang="id">
      <Head />
      <Preview>Pendaftaran Anda telah diterima — No. {noPendaftaran}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>PMB STIE Anindyaguna</Heading>
            <Text style={headerSubtitle}>Penerimaan Mahasiswa Baru</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={greeting}>Yth. {nama},</Text>
            <Text style={paragraph}>
              Terima kasih telah mendaftar ke <strong>STIE Anindyaguna Semarang</strong>.
              Formulir pendaftaran Anda telah kami terima dan sedang dalam proses verifikasi oleh panitia.
            </Text>

            {/* No. Pendaftaran highlight */}
            <Section style={noBox}>
              <Text style={noLabel}>Nomor Pendaftaran Anda</Text>
              <Text style={noValue}>{noPendaftaran}</Text>
              <Text style={noHint}>Simpan nomor ini untuk memantau status pendaftaran Anda.</Text>
            </Section>

            {/* Detail pendaftaran */}
            <Text style={sectionTitle}>Detail Pendaftaran</Text>
            <Section style={detailBox}>
              <Row style={detailRow}>
                <Column style={detailLabel}>Program Studi</Column>
                <Column style={detailValue}>{namaProdi} ({jenjang})</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Jalur Masuk</Column>
                <Column style={detailValue}>{jalurMasuk}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Periode PMB</Column>
                <Column style={detailValue}>{periode}</Column>
              </Row>
              <Row style={detailRow}>
                <Column style={detailLabel}>Status</Column>
                <Column style={{ ...detailValue, color: "#B7950B", fontWeight: "600" }}>
                  Menunggu Verifikasi
                </Column>
              </Row>
            </Section>

            {/* Langkah selanjutnya */}
            <Text style={sectionTitle}>Langkah Selanjutnya</Text>
            <Text style={paragraph}>
              Panitia akan memverifikasi dokumen Anda dalam <strong>1-3 hari kerja</strong>.
              Anda akan menerima notifikasi email ketika status pendaftaran berubah.
            </Text>
            <Text style={paragraph}>
              Pantau status pendaftaran Anda secara real-time melalui portal PMB:
            </Text>

            <Button style={button} href={statusUrl}>
              Cek Status Pendaftaran
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

// Styles
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

const noBox: React.CSSProperties = {
  backgroundColor: "#EAF2F8",
  border: "1px solid #AED6F1",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "20px 0",
  textAlign: "center",
};

const noLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#1B4F72",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: "600",
  margin: "0 0 6px",
};

const noValue: React.CSSProperties = {
  fontSize: "22px",
  fontFamily: "monospace",
  fontWeight: "700",
  color: "#1B4F72",
  letterSpacing: "0.05em",
  margin: "0 0 6px",
};

const noHint: React.CSSProperties = {
  fontSize: "12px",
  color: "#5D8AA8",
  margin: "0",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "700",
  color: "#1B4F72",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "20px 0 8px",
};

const detailBox: React.CSSProperties = {
  border: "1px solid #E2E8F0",
  borderRadius: "6px",
  overflow: "hidden",
  marginBottom: "16px",
};

const detailRow: React.CSSProperties = {
  borderBottom: "1px solid #E2E8F0",
};

const detailLabel: React.CSSProperties = {
  fontSize: "13px",
  color: "#718096",
  padding: "8px 12px",
  width: "40%",
  backgroundColor: "#F7FAFC",
};

const detailValue: React.CSSProperties = {
  fontSize: "13px",
  color: "#2D3748",
  fontWeight: "500",
  padding: "8px 12px",
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

export default KonfirmasiPendaftaran;
