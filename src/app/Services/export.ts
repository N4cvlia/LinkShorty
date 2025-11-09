import { Injectable } from '@angular/core';
import { ExportData } from '../Interfaces/export-data';
import { format } from 'date-fns';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  async exportToPDF(data: ExportData): Promise<void> {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setTextColor(95, 66, 240);
      doc.text('Link Analytics Report', 14,20);

      // Summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Summary', 14, 35);

      doc.setFontSize(10);
      doc.text(`Short URL: ${data.shortUrl}`, 14, 45);
      doc.text(`Original URL: ${data.originalUrl.substring(0, 80)}${data.originalUrl.length > 80 ? '...' : ''}`, 14, 52);
      doc.text(`Total Clicks: ${data.clicks}`, 14, 59);
      doc.text(`Average Clicks/Day: ${data.avgClicksPerDay}`, 14, 66);
      doc.text(`Created Date: ${data.createdDate}`, 14, 73);

      let yPos = 85;

      // Click trend table
      if (data.chartData.length > 0) {
        this.addTableSection(doc, 'Click Trend (Last 7 Days)', ['Date', 'Clicks'],
          data.chartData.map(item => [item.date, item.clicks.toString()]),
          yPos
        )
        yPos = (doc as any).lastAutoTable.finalY + 10;
      }

      // Top Countries table
      if (data.topCountries.length > 0 && yPos < 250) {
        this.addTableSection(doc, 'Top Countries', ['Country', 'Clicks'],
          data.topCountries.map(item => [item.country, item.count.toString()]),
          yPos
        )
        yPos = (doc as any).lastAutoTable.finalY + 10;
      }

      // New page if needed
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      // Device Stats table
      if (data.deviceStats.length > 0) {
        this.addTableSection(doc, 'Device Types', ['Device', 'Clicks'],
          data.deviceStats.map(item => [item.name, item.value.toString()]),
          yPos
        )
        yPos = (doc as any).lastAutoTable.finalY + 10;
      }

      // Browser Stats table
      if (data.browserStats.length > 0 && yPos < 250) {
        this.addTableSection(doc, 'Top Browsers', ['Browser', 'Clicks'],
          data.browserStats.map(item => [item.name, item.value.toString()]),
          yPos
        )
      }

      
      doc.save(`Analytics-${data.shortCode}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw new Error('Failed to export data to PDF.');
    }
  }

  exportToCSV(data: ExportData): void {
    try {
      let csvContent = "Link Analytics Report\n\n";

      // Summary
      csvContent += "Summary\n";
      csvContent += `Short URL,${data.shortUrl}\n`;
      csvContent += `Original URL,${data.originalUrl}\n`;
      csvContent += `Total Clicks,${data.clicks}\n`;
      csvContent += `Average Clicks/Day,${data.avgClicksPerDay}\n`;
      csvContent += `Created Date,${data.createdDate}\n\n`;

      // Click Trend
      if (data.chartData.length > 0) {
        csvContent += "Click Trend (Last 7 Days)\nDate,Clicks\n";
        data.chartData.forEach(item => {
          csvContent += `${item.date},${item.clicks}\n`;
        });
        csvContent += '\n';
      }

      // Top Countries
      if (data.topCountries.length > 0) {
        csvContent += "Top Countries\nCountry,Clicks\n";
        data.topCountries.forEach(item => {
          csvContent += `${item.country},${item.count}\n`;
        });
        csvContent += '\n';
      }

      // Device Stats
      if (data.deviceStats.length > 0) {
        csvContent += "Device Types\nDevice,Clicks\n";
        data.deviceStats.forEach(item => {
          csvContent += `${item.name},${item.value}\n`;
        });
        csvContent += '\n';
      }

      // Browser Stats
      if (data.browserStats.length > 0) {
        csvContent += "Top Browsers\nBrowser,Clicks\n";
        data.browserStats.forEach(item => {
          csvContent += `${item.name},${item.value}\n`;
        });
        csvContent += '\n';
      }

      // Recent clicks
      if (data.recentClicks.length > 0) {
        csvContent += "Recent Clicks\nTime,Country,City,Device,Browser,OS\n";
        data.recentClicks.forEach(click => {
          const time = new Date(click.clicked_at).toISOString();
          const country = click.country || 'Unknown';
          const city = click.city || 'Unknown';
          const device = click.device || 'Unknown';
          const browser = click.browser || 'Unknown';
          const os = click.os || 'Unknown';
          csvContent += `${time} || ${country} || ${city} || ${device} || ${browser} || ${os}\n`;
        });
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = `Analytics-${data.shortCode}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw new Error('Failed to export data to CSV.');
    }
  }

  private addTableSection(doc: any, title: string, headers: string[], data: string[][], yPos: number): void {
    doc.setFontSize(14);
    doc.text(title, 14, yPos);

    autoTable(doc,{
      startY: yPos + 5,
      head: [headers],
      body: data,
      theme: 'striped',
      headStyles: { fillColor: [95, 66, 240]},
    });
  }
}
