import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BillingService } from '../billing.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  TimeScale,
  Title,
} from 'chart.js';

Chart.register(
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  ArcElement,
  PieController,
  Tooltip,
  Legend,
  Title,
  ChartDataLabels
);

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-sale-reports',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './sale-reports.component.html',
  styleUrl: './sale-reports.component.css',
})
export class SaleReportsComponent implements OnInit {
  dailyData: any[] = [];
  monthlyData: any[] = [];
  yearlyData: any[] = [];
  weeklyData: any[] = [];

  dailyChart: any;
  weeklyChart: any;
  monthlyChart: any;
  yearlyChart: any;

  private primaryLineColor = '#ff6b5f';
  private accentColor = '#f6f6f6';
  private gridColor = '#2a2a2a';
  private fontColor = '#e9e9e9';

  constructor(private service: BillingService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport() {
    this.service.getSalesReport().subscribe((res: any) => {
      this.dailyData = res.daily || [];
      this.weeklyData = res.weekly || [];
      this.monthlyData = res.monthly || [];
      this.yearlyData = res.yearly || [];

      this.dailyData = [...this.dailyData];
      this.weeklyData = [...this.weeklyData];
      this.monthlyData = [...this.monthlyData];
      this.yearlyData = [...this.yearlyData];

      this.loadDailyChart(this.dailyData);
      this.loadWeeklyChart(this.weeklyData);
      this.loadMonthlyChart(this.monthlyData);
      this.loadYearlyChart(this.yearlyData);
    });
  }

  private sharedLineOptions() {
    return {
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: '#1f1f1f',
          titleColor: this.fontColor,
          bodyColor: this.fontColor,
          callbacks: {
            label: (ctx: any) =>
              `${ctx.dataset.label ? ctx.dataset.label + ': ' : ''}${ctx.raw}`,
          },
        },
        datalabels: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { color: this.gridColor, display: false },
          ticks: {
            color: this.fontColor,
            maxRotation: 45,
            minRotation: 45,
            autoSkip: true,
            padding: 6,
          },
          border: { display: false },
        },
        y: {
          grid: { color: this.gridColor },
          ticks: { color: this.fontColor, padding: 6 },
          beginAtZero: false,
          border: { display: false },
        },
      },
      elements: {
        line: {
          tension: 0.35,
          borderWidth: 2.5,
        },
        point: {
          radius: 5,
          hoverRadius: 7,
          backgroundColor: this.primaryLineColor,
          borderWidth: 0,
        },
      },
    };
  }

  loadDailyChart(data: any[]) {
    if (this.dailyChart) this.dailyChart.destroy();

    const labels = data.map((x) => x._id);
    const values = data.map((x) => x.totalSales);

    this.dailyChart = new Chart('dailyChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Daily Sales',
            data: values,
            backgroundColor: this.primaryLineColor,
            borderRadius: 6,
            barThickness: 18,
          },
        ],
      },
      options: {
        ...this.sharedLineOptions(),
        plugins: {
          ...this.sharedLineOptions().plugins,
          datalabels: { display: false },
        },
        scales: {
          x: { ...this.sharedLineOptions().scales.x },
          y: { ...this.sharedLineOptions().scales.y },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  loadWeeklyChart(data: any[]) {
    if (this.weeklyChart) this.weeklyChart.destroy();

    const labels = data.map((x) => `W${x._id.week}-${x._id.year}`);
    const values = data.map((x) => x.totalSales);

    this.weeklyChart = new Chart('weeklyChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Weekly Sales',
            data: values,
            borderColor: this.primaryLineColor,
            backgroundColor: 'transparent',
            pointBackgroundColor: this.primaryLineColor,
            pointBorderColor: this.primaryLineColor,
            fill: false,
          },
        ],
      },
      options: this.sharedLineOptions(),
      plugins: [ChartDataLabels],
    });
  }

  loadMonthlyChart(data: any[]) {
    if (this.monthlyChart) this.monthlyChart.destroy();

    const monthLabels = data.map((x) => {
      const m = x._id?.month ?? x._id;

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
      if (typeof m === 'number') return monthNames[(m - 1 + 12) % 12];
      if (typeof m === 'string' && /^\d+$/.test(m))
        return monthNames[(parseInt(m, 10) - 1 + 12) % 12];
      return String(m);
    });

    const values = data.map((x) => x.totalSales);

    this.monthlyChart = new Chart('monthlyChart', {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [
          {
            label: 'Monthly Sales',
            data: values,
            borderColor: this.primaryLineColor,
            backgroundColor: 'transparent',
            pointBackgroundColor: this.primaryLineColor,
            pointBorderColor: this.primaryLineColor,
            fill: false,
          },
        ],
      },
      options: this.sharedLineOptions(),
      plugins: [ChartDataLabels],
    });
  }

  loadYearlyChart(data: any[]) {
    if (this.yearlyChart) this.yearlyChart.destroy();

    const labels = data.map((x) => x._id.year ?? x._id);
    const values = data.map((x) => x.totalSales);

    this.yearlyChart = new Chart('yearlyChart', {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Yearly Sales',
            data: values,
            borderColor: this.primaryLineColor,
            backgroundColor: 'transparent',
            pointBackgroundColor: this.primaryLineColor,
            pointBorderColor: this.primaryLineColor,
            fill: false,
          },
        ],
      },
      options: this.sharedLineOptions(),
      plugins: [ChartDataLabels],
    });
  }

  downloadPDF() {
    const element: any = document.querySelector('.container');

    if (!element) {
      console.warn('Report container not found for PDF capture');
      return;
    }

    html2canvas(element, { scale: 2, backgroundColor: '#171717' }).then(
      (canvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const img = canvas.toDataURL('image/png');

        const pageWidth = 210;
        const pageHeight = 297;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('Sales_Report.pdf');
      }
    );
  }

  downloadExcel() {
    const exportData = [
      ...this.dailyData.map((d) => ({
        Period: d._id,
        Type: 'Daily',
        Sales: d.totalSales,
      })),
      ...this.weeklyData.map((w) => ({
        Period: `W${w._id.week}-${w._id.year}`,
        Type: 'Weekly',
        Sales: w.totalSales,
      })),
      ...this.monthlyData.map((m) => ({
        Period: `${m._id.month ?? m._id}-${m._id.year ?? ''}`.replace(/-$/, ''),
        Type: 'Monthly',
        Sales: m.totalSales,
      })),
      ...this.yearlyData.map((y) => ({
        Period: y._id.year ?? y._id,
        Type: 'Yearly',
        Sales: y.totalSales,
      })),
    ];

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    XLSX.writeFile(wb, 'Sales_Report.xlsx');
  }
}
