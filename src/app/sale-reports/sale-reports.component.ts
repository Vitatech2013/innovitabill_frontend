import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from '../billing.service';
import { NgApexchartsModule, ApexChart, ApexXAxis, ApexAxisChartSeries } from 'ng-apexcharts';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sale-reports',
  standalone: true,
  imports: [FormsModule, CommonModule, NgApexchartsModule],
  templateUrl: './sale-reports.component.html',
  styleUrls: ['./sale-reports.component.css'],
})
export class SaleReportsComponent implements OnInit {
  dailySeries: ApexAxisChartSeries = [];
  weeklySeries: ApexAxisChartSeries = [];
  monthlySeries: ApexAxisChartSeries = [];
  yearlySeries: ApexAxisChartSeries = [];

  dailyXAxis: ApexXAxis = {};
  weeklyXAxis: ApexXAxis = {};
  monthlyXAxis: ApexXAxis = {};
  yearlyXAxis: ApexXAxis = {};
 chartOptions: ApexChart = {
  type: "candlestick",
  height: 300
};
  dailyData: any[] = [];
  weeklyData: any[] = [];
  monthlyData: any[] = [];
  yearlyData: any[] = [];

  pdfDoc: jsPDF | null = null;
  pdfPreviewSrc: string | null = null;

  constructor(private service: BillingService) {}

  ngOnInit() {
    this.getReports();
  }

  getReports() {
    this.service.getSalesReport().subscribe((res: any) => {
      this.dailyData = res.daily || [];
      this.weeklyData = res.weekly || [];
      this.monthlyData = res.monthly || [];
      this.yearlyData = res.yearly || [];

      this.prepareDailyChart();
      this.prepareWeeklyChart();
      this.prepareMonthlyChart();
      this.prepareYearlyChart();
    });
  }

  // Convert simple sales data into candlestick 4-value format
  private convertToCandle(values: number[]) {
    return values.map((v, i) => ({
      x: i,
      y: [v - 20, v + 10, v + 5, v - 10], // fake OHLC based on single value
    }));
  }

  prepareDailyChart() {
    const values = this.dailyData.map((x) => x.totalSales);
    this.dailySeries = [{ data: this.convertToCandle(values) }];
    this.dailyXAxis = {
      categories: this.dailyData.map((x) => x._id),
    };
  }

  prepareWeeklyChart() {
    const values = this.weeklyData.map((x) => x.totalSales);
    this.weeklySeries = [{ data: this.convertToCandle(values) }];
    this.weeklyXAxis = {
      categories: this.weeklyData.map((x) => `W${x._id.week}-${x._id.year}`),
    };
  }

  prepareMonthlyChart() {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const values = this.monthlyData.map((x) => x.totalSales);
    this.monthlySeries = [{ data: this.convertToCandle(values) }];
    this.monthlyXAxis = {
      categories: this.monthlyData.map(
        (x) => monthNames[(x._id.month - 1) % 12]
      ),
    };
  }

  prepareYearlyChart() {
    const values = this.yearlyData.map((x) => x.totalSales);
    this.yearlySeries = [{ data: this.convertToCandle(values) }];
    this.yearlyXAxis = {
      categories: this.yearlyData.map((x) => x._id.year ?? x._id),
    };
  }

  preparePDFPreview() {
    const element = document.getElementById('report-content');
    if (!element) return;

    setTimeout(() => {
      html2canvas(element, { scale: 2 }).then((canvas) => {
        const img = canvas.toDataURL('image/png');
        this.pdfPreviewSrc = img;

        const pdf = new jsPDF('p', 'mm', 'a4');
        const w = 210;
        const h = (canvas.height * w) / canvas.width;

        pdf.addImage(img, 'PNG', 0, 0, w, h);
        pdf.save('Sales_Report.pdf');
      });
    }, 300);
  }

  downloadExcel() {
    const rows = [
      ...this.dailyData.map((x) => ({
        Period: x._id,
        Type: 'Daily',
        Sales: x.totalSales,
      })),
      ...this.weeklyData.map((x) => ({
        Period: `W${x._id.week}-${x._id.year}`,
        Type: 'Weekly',
        Sales: x.totalSales,
      })),
      ...this.monthlyData.map((x) => ({
        Period: `${x._id.month}-${x._id.year}`,
        Type: 'Monthly',
        Sales: x.totalSales,
      })),
      ...this.yearlyData.map((x) => ({
        Period: x._id.year ?? x._id,
        Type: 'Yearly',
        Sales: x.totalSales,
      })),
    ];

    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Sales');
    XLSX.writeFile(book, 'Sales_Report.xlsx');
  }
}
