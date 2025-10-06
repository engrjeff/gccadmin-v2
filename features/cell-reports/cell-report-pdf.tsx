"use client";

import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  usePDF,
  View,
} from "@react-pdf/renderer/lib/react-pdf.browser";
import { StickyNoteIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatDate, removeUnderscores } from "@/lib/utils";
import type { CellReportRecord } from "@/types/globals";

const DOCUMENT_TITLE = "Cell Reports";
const LOGO_SRC =
  "https://res.cloudinary.com/dxo593xsn/image/upload/v1758533287/gcc%20admin/gcc-logo_rvh1db.png";

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
  },
  logoSrc: {
    width: 32,
    height: 32,
    color: "black",
    marginBottom: 5,
  },
  heading: {
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "black",
    color: "white",
  },
  headingText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  subheadingText: {
    fontSize: 8,
    textAlign: "center",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  detailRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 5,
  },
  detailRowTitle: {
    fontWeight: "bold",
    fontSize: 9,
  },
  detailRowValue: {
    fontSize: 9,
    textTransform: "capitalize",
  },
  line: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
});

const CellReportPDFTemplate = ({
  cellReport,
}: {
  cellReport: CellReportRecord;
}) => {
  return (
    <Page size="A5" style={styles.page}>
      <View style={styles.heading}>
        <Image src={LOGO_SRC} style={styles.logoSrc} />
        <View
          style={{ justifyContent: "center", height: "100%", marginTop: 5 }}
        >
          <Text style={styles.headingText}>
            Abundant Grace City Church International Ministries
          </Text>
          <Text style={[styles.subheadingText, { marginBottom: 10 }]}>
            Morong, Rizal, Philippines
          </Text>
        </View>
      </View>
      <View style={{ flexGrow: 1, paddingVertical: 10, paddingHorizontal: 20 }}>
        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 12,
              textAlign: "center",
            }}
          >
            Cell Report
          </Text>
          <Text
            style={{ fontSize: 7, fontStyle: "italic", textAlign: "center" }}
          >
            Date Reported: {formatDate(cellReport.createdAt.toISOString())}
          </Text>
        </View>
        <View style={styles.line}></View>
        <View style={styles.detailRow}>
          <Text style={styles.detailRowTitle}>Type: </Text>
          <Text style={styles.detailRowValue}>
            {removeUnderscores(cellReport.type)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.detailRow}>
            <Text style={styles.detailRowTitle}>Network Leader: </Text>
            <Text style={styles.detailRowValue}>{cellReport.leader.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailRowTitle}>Handled By: </Text>
            <Text style={styles.detailRowValue}>
              {cellReport.assistantId
                ? cellReport.assistant?.name
                : cellReport.leader.name}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.detailRow}>
            <Text style={styles.detailRowTitle}>Venue: </Text>
            <Text style={styles.detailRowValue}>{cellReport.venue}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailRowTitle}>Date: </Text>
            <Text style={styles.detailRowValue}>{cellReport.date}</Text>
          </View>
        </View>
        <View style={{ height: 10 }}></View>
        <View style={styles.detailRow}>
          <Text style={styles.detailRowTitle}>Lesson: </Text>
          <Text style={styles.detailRowValue}>
            {cellReport.lessonTitle
              ? cellReport.lessonTitle
              : cellReport.lesson?.title}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailRowTitle}>Scripture References: </Text>
          <Text style={styles.detailRowValue}>
            {cellReport.hasCustomLesson
              ? cellReport.scriptureReferences?.slice(0, 4)?.join(", ")
              : cellReport.lesson?.scriptureReferences.join(", ")}
          </Text>
        </View>
        <View style={{ height: 10 }}></View>
        <View style={styles.detailRow}>
          <Text style={styles.detailRowTitle}>Attendees </Text>
          <Text style={styles.detailRowValue}>
            ({cellReport.cellReportAttendeeSnapshots.length})
          </Text>
        </View>
        <View style={{ height: 5 }}></View>
        <View>
          <View
            style={[
              styles.detailRow,
              {
                gap: 10,
                paddingBottom: 5,
                borderBottom: 1,
                borderBottomColor: "#ddd",
              },
            ]}
          >
            <Text style={[styles.detailRowValue, { width: 16 }]}>#</Text>
            <Text style={[styles.detailRowTitle, { width: 150 }]}>Name</Text>
            <Text
              style={[
                styles.detailRowTitle,
                { width: 75, textAlign: "center" },
              ]}
            >
              Cell Status
            </Text>
            <Text
              style={[
                styles.detailRowTitle,
                { width: 75, textAlign: "center" },
              ]}
            >
              Church Status
            </Text>
          </View>
          {cellReport.cellReportAttendeeSnapshots.map(
            (attendee, attendeeIndex) => (
              <View
                key={attendee.id}
                style={[
                  styles.detailRow,
                  {
                    gap: 10,
                    paddingBottom: 5,
                    borderBottom: 1,
                    borderBottomColor: "#ddd",
                  },
                ]}
              >
                <Text style={[styles.detailRowValue, { width: 16 }]}>
                  {attendeeIndex + 1}.
                </Text>
                <Text style={[styles.detailRowValue, { width: 150 }]}>
                  {attendee.name}
                </Text>
                <Text
                  style={[
                    styles.detailRowValue,
                    { width: 75, textAlign: "center" },
                  ]}
                >
                  {removeUnderscores(attendee.status)}
                </Text>
                <Text
                  style={[
                    styles.detailRowValue,
                    { width: 75, textAlign: "center" },
                  ]}
                >
                  {removeUnderscores(attendee.churchStatus)}
                </Text>
              </View>
            ),
          )}
        </View>
        <View style={{ height: 10 }}></View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.detailRowTitle, { marginBottom: 5 }]}>
              Worship:{" "}
            </Text>
            {cellReport.worship?.length === 0 ? (
              <Text style={styles.detailRowValue}>None provided</Text>
            ) : (
              <View style={{ gap: 3 }}>
                {cellReport.worship.map((worship) => (
                  <Text key={worship} style={styles.detailRowValue}>
                    {worship}
                  </Text>
                ))}
              </View>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.detailRowTitle, { marginBottom: 5 }]}>
              Work:{" "}
            </Text>
            {cellReport.work?.length === 0 ? (
              <Text style={styles.detailRowValue}>None provided</Text>
            ) : (
              <View style={{ gap: 3 }}>
                {cellReport.work.map((work) => (
                  <Text key={work} style={styles.detailRowValue}>
                    {work}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={{ position: "absolute", bottom: 10, right: 20 }}>
          <Text style={{ fontSize: 7, fontStyle: "italic" }}>
            Generated on {new Date().toLocaleString()}
          </Text>
        </View>
      </View>
    </Page>
  );
};

export const CellReportPDF = ({
  cellReports,
}: {
  cellReports: CellReportRecord[];
}) => {
  return (
    <PDFViewer className="absolute inset-0 size-full overflow-hidden">
      <Document
        pageLayout="singlePage"
        pageMode="fullScreen"
        title={DOCUMENT_TITLE}
      >
        {cellReports.map((report) => (
          <CellReportPDFTemplate key={report.id} cellReport={report} />
        ))}
      </Document>
    </PDFViewer>
  );
};

export const GeneratePDFButton = ({
  cellReport,
}: {
  cellReport: CellReportRecord;
}) => {
  const [instance] = usePDF({
    document: (
      <Document
        pageLayout="singlePage"
        pageMode="fullScreen"
        title={DOCUMENT_TITLE}
      >
        <CellReportPDFTemplate cellReport={cellReport} />
      </Document>
    ),
  });

  if (instance.loading)
    return (
      <DropdownMenuItem disabled>
        <StickyNoteIcon />
        Generate PDF
      </DropdownMenuItem>
    );

  if (instance.error) return <div>Something went wrong: {instance.error}</div>;

  return (
    <DropdownMenuItem asChild>
      <a
        href={instance.url as string}
        download={`cg-${new Date(cellReport.date).toISOString()}.pdf`}
        onClick={() => toast.info("PDF generated!")}
      >
        <StickyNoteIcon />
        Generate PDF
      </a>
    </DropdownMenuItem>
  );
};

export const GeneratePDFButtonWide = ({
  cellReport,
}: {
  cellReport: CellReportRecord;
}) => {
  const [instance] = usePDF({
    document: (
      <Document
        pageLayout="singlePage"
        pageMode="fullScreen"
        title={DOCUMENT_TITLE}
        author={cellReport.leader.name}
        creationDate={new Date()}
        subject="GCC Cell Report"
      >
        <CellReportPDFTemplate cellReport={cellReport} />
      </Document>
    ),
  });

  if (instance.loading)
    return (
      <Button type="button" size="sm" disabled>
        <StickyNoteIcon />
        Generate PDF
      </Button>
    );

  if (instance.error) return <div>Something went wrong: {instance.error}</div>;

  return (
    <Button type="button" size="sm" asChild>
      <a
        href={instance.url as string}
        download={`cg-${new Date(cellReport.date).toISOString()}.pdf`}
        onClick={() => toast.info("PDF generated!")}
      >
        <StickyNoteIcon />
        Generate PDF
      </a>
    </Button>
  );
};
