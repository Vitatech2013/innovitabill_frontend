import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexXAxis
} from 'ng-apexcharts';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { BillingService } from '../../Services/billing.service';

@Component({
  selector: 'app-sale-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  templateUrl: './sale-reports.component.html',
  styleUrls: ['./sale-reports.component.css']
})
export class SaleReportsComponent implements OnInit {

  activeTab: string = 'daily';

  dailyData: any[] = [];
  weeklyData: any[] = [];
  monthlyData: any[] = [];
  yearlyData: any[] = [];

  chartSeries: ApexAxisChartSeries = [];
  chartXAxis: ApexXAxis = {};

  chartOptions: any = {
    chart: { type: "area", height: 300, toolbar: { show: false } },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0
      }
    }
  };

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
      this.loadTab();
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.loadTab();
  }

  loadTab() {
    let data: any[] = [];

    switch (this.activeTab) {
      case 'daily': data = this.dailyData || []; break;
      case 'weekly': data = this.weeklyData || []; break;
      case 'monthly': data = this.monthlyData || []; break;
      case 'yearly': data = this.yearlyData || []; break;
      default: data = [];
    }

    this.chartSeries = [{
      name: `${this.activeTab} Sales`,
      data: data.map((x: any) => x.totalSales)
    }];

    this.chartXAxis = {
      categories: data.map((x: any) =>
        this.activeTab === 'weekly'
          ? `W${x._id.week}-${x._id.year}`
          : this.activeTab === 'monthly'
            ? `${x._id.month}-${x._id.year}`
            : x._id.year ?? x._id
      )
    };
  }

  
  downloadPDF() {
    const doc = new jsPDF();
    doc.text(`${this.activeTab.toUpperCase()} SALES REPORT`, 10, 10);

    const tableData = this.getCurrentTabData().map((item: any) => [
      item._id.month ?? item._id.week ?? item._id.year ?? item._id,
      item.totalSales
    ]);

    autoTable(doc, {
      head: [["Period", "Sales"]],
      body: tableData
    });

    doc.save(`${this.activeTab}-sales-report.pdf`);
  }

 
  downloadExcel() {
    const rows = this.getCurrentTabData().map((x: any) => ({
      Period: x._id.month ?? x._id.week ?? x._id.year ?? x._id,
      Sales: x.totalSales
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, 'Report');

    XLSX.writeFile(book, `${this.activeTab}-sales-report.xlsx`);
  }

  getCurrentTabData() {
    if (this.activeTab === 'daily') return this.dailyData;
    if (this.activeTab === 'weekly') return this.weeklyData;
    if (this.activeTab === 'monthly') return this.monthlyData;
    return this.yearlyData;
  }

}
