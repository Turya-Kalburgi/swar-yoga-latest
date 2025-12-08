import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, Target, CheckSquare, Users, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFExport = () => {
  const [selectedExport, setSelectedExport] = useState('vision');
  const [selectedVision, setSelectedVision] = useState('all');
  const [dateRange, setDateRange] = useState('current-year');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const exportOptions = [
    { id: 'vision', name: 'Vision Board', icon: Target, description: 'Export your complete vision board with goals and progress' },
    { id: 'goals', name: 'Goals Report', icon: CheckSquare, description: 'Export detailed goals and task completion report' },
    { id: 'people', name: 'Diamond People', icon: Users, description: 'Export your complete contacts and relationships list' }
  ];

  const visions = [
    { id: 'all', name: 'All Visions' },
    { id: '1', name: 'Health & Fitness Transformation' },
    { id: '2', name: 'Spiritual Growth & Inner Peace' }
  ];

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleExport = async (format: string) => {
    setIsGenerating(true);
    
    try {
      // Fetch real data from backend APIs
      const exportData = await generateExportDataFromBackend();
      
      if (format === 'pdf') {
        generatePDF(exportData);
      } else if (format === 'excel') {
        generateExcel(exportData);
      } else if (format === 'print') {
        printReport(exportData);
      }
      
      alert(`${format.toUpperCase()} export completed successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExportDataFromBackend = async () => {
    const currentDate = new Date().toLocaleDateString();
    const exportType = exportOptions.find(opt => opt.id === selectedExport)?.name;
    
    try {
      let data = {};
      let visionsList: any[] = [];
      
      if (selectedExport === 'vision') {
        // Fetch visions from backend
        const apiUrl = (import.meta as any).env?.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api.swaryoga.online/api');
        const response = await fetch(`${apiUrl}/visions`);
        visionsList = await response.json();
        
        const filteredVisions = selectedVision === 'all' 
          ? visionsList 
          : visionsList.filter((v: any) => v.id === parseInt(selectedVision));
        
        data = {
          visions: filteredVisions.map((v: any) => ({
            name: v.title,
            progress: v.progress || 0,
            status: 'In Progress'
          }))
        };
      } else if (selectedExport === 'goals') {
        // Fetch goals from backend
        const apiUrl = (import.meta as any).env?.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://api.swaryoga.online/api');
        const response = await fetch(`${apiUrl}/goals`);
        const goals = await response.json();
        
        data = {
          goals: goals.map((g: any) => ({
            title: g.title,
            progress: g.progress || 0,
            status: 'In Progress'
          }))
        };
      } else if (selectedExport === 'people') {
        // Placeholder for diamond people
        data = {
          people: [
            { name: 'Sample Person', relationship: 'Professional', category: 'Mentor' }
          ]
        };
      } else {
        data = { message: 'Comprehensive life planning data' };
      }
      
      return {
        title: exportType,
        generatedDate: currentDate,
        dateRange: dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        selectedVision: selectedExport === 'vision' ? (visionsList.find((v: any) => v.id === parseInt(selectedVision))?.title || 'All Visions') : null,
        data
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      // Fallback to mock data
      return generateExportData();
    }
  };

  const generateExportData = () => {
    const currentDate = new Date().toLocaleDateString();
    const exportType = exportOptions.find(opt => opt.id === selectedExport)?.name;
    
    return {
      title: `${exportType} Report`,
      generatedDate: currentDate,
      dateRange: dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      selectedVision: selectedExport === 'vision' ? visions.find(v => v.id === selectedVision)?.name : null,
      data: getMockDataForExport()
    };
  };

  const getMockDataForExport = () => {
    switch (selectedExport) {
      case 'vision':
        return {
          visions: [
            { name: 'Health & Fitness Transformation', progress: 65, status: 'In Progress' },
            { name: 'Spiritual Growth & Inner Peace', progress: 75, status: 'In Progress' }
          ]
        };
      case 'goals':
        return {
          goals: [
            { title: 'Complete 100 Days of Meditation', progress: 85, status: 'In Progress' },
            { title: 'Lose 20 Pounds', progress: 60, status: 'In Progress' }
          ]
        };
      case 'people':
        return {
          people: [
            { name: 'Sarah Johnson', relationship: 'Professional', category: 'Spiritual Mentor' }
          ]
        };
      default:
        return { message: 'Comprehensive life planning data' };
    }
  };

  const generatePDF = (data: any) => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;
      
      // Helper function to add text with automatic page break
      const addText = (text: string, fontSize: number, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('Helvetica', isBold ? 'bold' : 'normal');
        const textWidth = pageWidth - (margin * 2);
        const splitText = pdf.splitTextToSize(text, textWidth);
        
        splitText.forEach((line: string) => {
          if (yPosition + 7 > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += 7;
        });
      };
      
      // Title
      pdf.setFillColor(100, 150, 255);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('Helvetica', 'bold');
      pdf.text(data.title, margin, 15);
      
      yPosition = 40;
      pdf.setTextColor(0, 0, 0);
      
      // Metadata
      addText(`Generated: ${data.generatedDate}`, 10);
      addText(`Date Range: ${data.dateRange}`, 10);
      
      if (data.selectedVision) {
        addText(`Vision: ${data.selectedVision}`, 10);
      }
      
      yPosition += 5;
      
      // Content based on export type
      if (selectedExport === 'vision') {
        addText('Vision Board Details', 12, true);
        yPosition += 3;
        
        if (data.data.visions && Array.isArray(data.data.visions)) {
          data.data.visions.forEach((vision: any, index: number) => {
            yPosition += 2;
            addText(`${index + 1}. ${vision.name}`, 11, true);
            addText(`Progress: ${vision.progress}%`, 10);
            addText(`Status: ${vision.status}`, 10);
            
            // Draw progress bar
            const barWidth = 100;
            const barHeight = 3;
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(margin, yPosition, barWidth, barHeight);
            
            const progressWidth = (vision.progress / 100) * barWidth;
            pdf.setFillColor(76, 175, 80);
            pdf.rect(margin, yPosition, progressWidth, barHeight, 'F');
            
            yPosition += 8;
          });
        }
      } else if (selectedExport === 'goals') {
        addText('Goals & Tasks Report', 12, true);
        yPosition += 3;
        
        if (data.data.goals && Array.isArray(data.data.goals)) {
          data.data.goals.forEach((goal: any, index: number) => {
            yPosition += 2;
            addText(`${index + 1}. ${goal.title}`, 11, true);
            addText(`Completion: ${goal.progress}%`, 10);
            addText(`Status: ${goal.status}`, 10);
            
            // Draw progress bar
            const barWidth = 100;
            const barHeight = 3;
            pdf.setDrawColor(200, 200, 200);
            pdf.rect(margin, yPosition, barWidth, barHeight);
            
            const progressWidth = (goal.progress / 100) * barWidth;
            pdf.setFillColor(33, 150, 243);
            pdf.rect(margin, yPosition, progressWidth, barHeight, 'F');
            
            yPosition += 8;
          });
        }
      } else if (selectedExport === 'people') {
        addText('Diamond People Directory', 12, true);
        yPosition += 3;
        
        if (data.data.people && Array.isArray(data.data.people)) {
          data.data.people.forEach((person: any, index: number) => {
            yPosition += 2;
            addText(`${index + 1}. ${person.name}`, 11, true);
            addText(`Relationship: ${person.relationship}`, 10);
            addText(`Category: ${person.category}`, 10);
            yPosition += 3;
          });
        }
      } else if (selectedExport === 'planner') {
        addText('Life Planner Summary', 12, true);
        yPosition += 3;
        addText('This comprehensive report contains your complete life planning data including visions, goals, tasks, and daily activities.', 10);
        yPosition += 5;
        addText('Key Sections:', 11, true);
        addText('• Vision Board: Your long-term aspirations and objectives', 10);
        addText('• Goals: Specific, measurable targets for achievement', 10);
        addText('• Tasks: Action items and daily activities', 10);
        addText('• Affirmations: Daily positive statements and reminders', 10);
      }
      
      // Footer
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      pdf.text(`Page ${pdf.internal.pages.length - 1} of ${pdf.internal.pages.length}`, pageWidth - margin - 20, pageHeight - 10);
      pdf.text('Swar Yoga Life Planner', margin, pageHeight - 10);
      
      // Download
      pdf.save(`${data.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const generateExcel = (data: any) => {
    // Create CSV content with proper formatting
    let csvContent = '';
    
    // Header
    csvContent += `${data.title}\n`;
    csvContent += `Generated,${data.generatedDate}\n`;
    csvContent += `Date Range,${data.dateRange}\n`;
    if (data.selectedVision) {
      csvContent += `Vision,${data.selectedVision}\n`;
    }
    csvContent += '\n';
    
    // Data based on export type
    if (selectedExport === 'vision' && data.data.visions) {
      csvContent += 'Vision Name,Progress (%),Status\n';
      data.data.visions.forEach((vision: any) => {
        csvContent += `"${vision.name}",${vision.progress},${vision.status}\n`;
      });
    } else if (selectedExport === 'goals' && data.data.goals) {
      csvContent += 'Goal Title,Completion (%),Status\n';
      data.data.goals.forEach((goal: any) => {
        csvContent += `"${goal.title}",${goal.progress},${goal.status}\n`;
      });
    } else if (selectedExport === 'people' && data.data.people) {
      csvContent += 'Name,Relationship,Category\n';
      data.data.people.forEach((person: any) => {
        csvContent += `"${person.name}","${person.relationship}","${person.category}"\n`;
      });
    } else {
      csvContent += JSON.stringify(data.data, null, 2);
    }
    
    // Create and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = (data: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${data.title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              .meta { color: #666; margin-bottom: 20px; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>${data.title}</h1>
            <div class="meta">
              <p>Generated: ${data.generatedDate}</p>
              <p>Date Range: ${data.dateRange}</p>
              ${data.selectedVision ? `<p>Vision: ${data.selectedVision}</p>` : ''}
            </div>
            <pre>${JSON.stringify(data.data, null, 2)}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF Export & Reports</h1>
        <p className="text-gray-600">Generate and export your life planning data in various formats</p>
      </div>

      {/* Export Options */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Select Export Type</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {exportOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.id}
                onClick={() => setSelectedExport(option.id)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  selectedExport === option.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className={`h-6 w-6 ${
                    selectedExport === option.id ? 'text-purple-600' : 'text-gray-600'
                  }`} />
                  <h3 className="font-semibold text-gray-800">{option.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{option.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Export Configuration */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Export Configuration</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Vision Selection (only for vision export) */}
          {selectedExport === 'vision' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Vision
              </label>
              <select
                value={selectedVision}
                onChange={(e) => setSelectedVision(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {visions.map(vision => (
                  <option key={vision.id} value={vision.id}>{vision.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="current-year">Current Year</option>
              <option value="last-6-months">Last 6 Months</option>
              <option value="last-3-months">Last 3 Months</option>
              <option value="current-month">Current Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        )}
      </div>

      {/* Export Preview */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Export Preview</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {exportOptions.find(opt => opt.id === selectedExport)?.name} Preview
          </h3>
          <p className="text-gray-600 mb-6">
            Click preview to see how your export will look
          </p>
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors mx-auto"
          >
            <Eye className="h-5 w-5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Export Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Export Options</h2>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => handleExport('pdf')}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5" />
            <span>{isGenerating ? 'Generating...' : 'Export as PDF'}</span>
          </button>
          
          <button
            onClick={() => handleExport('excel')}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-5 w-5" />
            <span>{isGenerating ? 'Generating...' : 'Export as Excel'}</span>
          </button>
          
          <button
            onClick={() => handleExport('print')}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="h-5 w-5" />
            <span>{isGenerating ? 'Generating...' : 'Print Friendly'}</span>
          </button>
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Export Details</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Export Type: {exportOptions.find(opt => opt.id === selectedExport)?.name}</li>
            {selectedExport === 'vision' && <li>• Vision: {visions.find(v => v.id === selectedVision)?.name}</li>}
            <li>• Date Range: {dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</li>
            <li>• Generated: {new Date().toLocaleDateString()}</li>
          </ul>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Export Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {exportOptions.find(opt => opt.id === selectedExport)?.name} Report
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Generated: {new Date().toLocaleDateString()}</div>
                  <div>Date Range: {dateRange.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                  {selectedExport === 'vision' && (
                    <div>Vision: {visions.find(v => v.id === selectedVision)?.name}</div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Sample Data Preview:</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(getMockDataForExport(), null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFExport;