import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  EmploymentStats,
  EngagementStats,
  UpdatedAlumniData,
} from "@/types";

export function exportEmploymentStatsToPDF(data: EmploymentStats) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Employment Statistics Report", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 15;

  // Overview Section
  doc.setFontSize(14);
  doc.text("Overview", 14, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const overviewData = [
    ["Total Alumni", data.totalAlumni.toString()],
    ["Employment Rate", `${data.employmentRate.toFixed(1)}%`],
    [
      "Total Employed",
      (data.employedCount + data.selfEmployedCount).toString(),
    ],
    ["Employed", data.employedCount.toString()],
    ["Self-Employed", data.selfEmployedCount.toString()],
    ["Job Seeking", data.unemployedCount.toString()],
    ["Post-Grad Students", data.postGradStudentCount.toString()],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: overviewData,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Employment Status Distribution
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Employment Status Distribution", 14, yPosition);
  yPosition += 10;

  const statusData = [
    [
      "Employed",
      data.employedCount.toString(),
      `${((data.employedCount / data.totalAlumni) * 100).toFixed(1)}%`,
    ],
    [
      "Self-Employed",
      data.selfEmployedCount.toString(),
      `${((data.selfEmployedCount / data.totalAlumni) * 100).toFixed(1)}%`,
    ],
    [
      "Unemployed",
      data.unemployedCount.toString(),
      `${((data.unemployedCount / data.totalAlumni) * 100).toFixed(1)}%`,
    ],
    [
      "Post-Grad Student",
      data.postGradStudentCount.toString(),
      `${((data.postGradStudentCount / data.totalAlumni) * 100).toFixed(1)}%`,
    ],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [["Status", "Count", "Percentage"]],
    body: statusData,
    theme: "striped",
    headStyles: { fillColor: [52, 152, 219] },
    margin: { left: 14, right: 14 },
  });

  // New page for Industry Distribution
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(14);
  doc.text("Industry Distribution", 14, yPosition);
  yPosition += 10;

  const industryData = data.industryDistribution.map((item) => [
    item.industry,
    item.count.toString(),
    `${item.percentage.toFixed(1)}%`,
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [["Industry", "Count", "Percentage"]],
    body: industryData,
    theme: "striped",
    headStyles: { fillColor: [46, 204, 113] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Check if we need a new page
  if (yPosition > 250) {
    doc.addPage();
    yPosition = 20;
  }

  // Batch Employment Statistics
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Employment Rate by Batch", 14, yPosition);
  yPosition += 10;

  const batchData = data.batchEmploymentStats.map((item) => [
    item.batch.toString(),
    item.employed.toString(),
    item.total.toString(),
    `${item.rate.toFixed(1)}%`,
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [["Batch", "Employed", "Total", "Employment Rate"]],
    body: batchData,
    theme: "grid",
    headStyles: { fillColor: [155, 89, 182] },
    margin: { left: 14, right: 14 },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    );
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      14,
      doc.internal.pageSize.getHeight() - 10,
    );
  }

  // Save the PDF
  // doc.save(
  //   `employment-statistics-${new Date().toISOString().split("T")[0]}.pdf`,
  // );
  doc.output("dataurlnewwindow");
}

export function generateAlumniPDF(alumniData: UpdatedAlumniData[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Alumni Information Report", pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );

  yPosition += 15;

  // Summary Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text("Summary", 14, yPosition);

  yPosition += 7;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Alumni: ${alumniData.length}`, 14, yPosition);

  yPosition += 6;
  const uniqueBatches = new Set(alumniData.map((a) => a.batch)).size;
  doc.text(`Total Batches: ${uniqueBatches}`, 14, yPosition);

  yPosition += 6;
  const uniqueIndustries = new Set(alumniData.map((a) => a.industry)).size;
  doc.text(`Total Industries: ${uniqueIndustries}`, 14, yPosition);

  yPosition += 12;

  // Table Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Alumni Details", 14, yPosition);

  yPosition += 5;

  // Create table data
  const tableData = alumniData.map((alumni) => [
    alumni.name,
    alumni.batch,
    alumni.course,
    alumni.company,
    alumni.jobTitle,
    alumni.industry,
    `${alumni.years} yrs`,
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [
      [
        "Name",
        "Batch",
        "Course",
        "Company",
        "Job Title",
        "Industry",
        "Yrs(To get the job)",
      ],
    ],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: 50,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 10, left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 18 },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 25 },
      6: { cellWidth: 15 },
    },
  });

  // Add new page for detailed information
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Alumni Information", 14, yPosition);

  yPosition += 10;

  // Detailed information for each alumni
  alumniData.forEach((alumni, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}. ${alumni.name}`, 14, yPosition);

    yPosition += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    const details = [
      `Batch: ${alumni.batch}`,
      `Course: ${alumni.course}`,
      `Current Occupation: ${alumni.currentOccupation}`,
      `Job Title: ${alumni.jobTitle}`,
      `Company: ${alumni.company}`,
      `Industry: ${alumni.industry}`,
      `Post-Study University: ${alumni.postStudyUniversity}`,
      `Years of Experience: ${alumni.years}`,
    ];

    details.forEach((detail) => {
      doc.text(detail, 20, yPosition);
      yPosition += 5;
    });

    yPosition += 5;
  });

  // Add page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
  }

  // Save the PDF
  // doc.save(`Alumni_Report_${new Date().toISOString().split("T")[0]}.pdf`);
  doc.output("dataurlnewwindow");
}

export function exportEngagementToPDF(data: EngagementStats) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Helper function to add page numbers
  const addPageNumber = () => {
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${pageCount}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });
  };

  // Title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text("Alumni Engagement Report", pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 15;

  // Date
  doc.setFontSize(10);
  doc.setTextColor(128, 128, 128);
  doc.text(
    `Generated on ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );
  yPosition += 15;

  // Overview Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Overview", 14, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [["Metric", "Value"]],
    body: [
      ["Total Events", data.totalEvents.toString()],
      ["Active Alumni", data.totalAttendees.toString()],
      ["Average Attendance Rate", `${data.averageAttendanceRate.toFixed(1)}%`],
      ["Recent Events", data.eventParticipation.slice(0, 3).length.toString()],
    ],
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Event Participation Section
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.text("Recent Event Participation", 14, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [["Event Name", "Date", "Attendees", "Interested"]],
    body: data.eventParticipation
      .slice(0, 10)
      .map((event) => [
        event.eventName,
        event.date,
        event.attendees.toString(),
        event.interested.toString(),
      ]),
    theme: "striped",
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Batch Engagement Section
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.text("Engagement by Batch", 14, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [["Batch", "Events Attended", "Total Events", "Engagement Rate"]],
    body: data.batchEngagement.map((batch) => [
      batch.batch.toString(),
      batch.eventsAttended.toString(),
      batch.totalEvents.toString(),
      `${batch.engagementRate.toFixed(1)}%`,
    ]),
    theme: "striped",
    headStyles: { fillColor: [16, 185, 129] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Monthly Engagement Section
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.text("Monthly Engagement Trend", 14, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [["Month", "Events", "Total Attendees"]],
    body: data.monthlyEngagement.map((month) => [
      month.month,
      month.events.toString(),
      month.attendees.toString(),
    ]),
    theme: "striped",
    headStyles: { fillColor: [139, 92, 246] },
    margin: { left: 14, right: 14 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Top Engaged Alumni Section
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = 20;
  }

  doc.setFontSize(14);
  doc.text("Most Engaged Alumni", 14, yPosition);
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [["Name", "Batch", "Events Attended"]],
    body: data.topEngagedAlumni
      .slice(0, 10)
      .map((alumni) => [
        alumni.name,
        alumni.batch.toString(),
        alumni.eventsAttended.toString(),
      ]),
    theme: "striped",
    headStyles: { fillColor: [236, 72, 153] },
    margin: { left: 14, right: 14 },
  });

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addPageNumber();
  }

  // Save the PDF
  // doc.save(`engagement-report-${new Date().toISOString().split("T")[0]}.pdf`);
  doc.output("dataurlnewwindow");
}
