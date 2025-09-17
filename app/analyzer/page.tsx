'use client';

import { useEffect } from 'react';
import './analyzer.css';
import { initializeLogAnalyzer } from './logAnalyzer';
import type { LogAnalyzer } from './logAnalyzer';

const AnalyzerPage = () => {
    useEffect(() => {
        const analyzer: LogAnalyzer = initializeLogAnalyzer();
        return () => {
            if (typeof analyzer.destroy === 'function') {
                analyzer.destroy();
            }
        };
    }, []);

    return (
        <main className="analyzer-page">
            <div className="analyzer-app">
                <div className="container">
                <header className="header">
                    <div className="header-content">
                        <div className="logo-section">
                            <h1>Access Log Analyzer</h1>
                        </div>
                        <div className="header-actions">
                            <button id="clearData" className="header-btn secondary">Clear Data</button>
                        </div>
                    </div>
                </header>
                <div className="upload-section">
                    <div className="upload-container">
                        <div className="dropbox" id="dropbox">
                            <div className="dropbox-content">
                                <div className="upload-icon">📁</div>
                                <p className="dropbox-text">Drag & drop your log file(s) here</p>
                                <p className="dropbox-subtext">or click to browse (.log, .txt files)</p>
                                <input type="file" id="logFile" accept=".log,.txt" className="file-input" multiple />
                            </div>
                            <div id="fileListContainer" className="hidden">
                            </div>
                        </div>
                        <div id="fileSizeWarning" className="file-size-warning hidden">
                            <strong>Large File(s) Detected:</strong> Processing may take several minutes.
                        </div>
                        <button id="analyzeBtn" className="analyze-btn" disabled>Analyze Log File(s)</button>
                    </div>
                </div>
                <div id="loadingIndicator" className="loading hidden">
                    <div className="spinner"></div>
                    <p>Analyzing log file(s)...</p>
                    <div className="loading-details">
                        <span id="loadingStatus">Processing...</span>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar" id="progressBar"></div>
                    </div>
                    <div className="performance-tip">
                        <strong>Tip:</strong> Large files may take several minutes. This runs in your browser.
                    </div>
                </div>
                <div id="results" className="results hidden">
                    <div id="dateRangeSection" className="date-range-section">
                        <div className="date-range-header">
                            <h3>📅 Date Range Filter</h3>
                            <div className="date-range-info">
                                <span id="totalLogEntries">0 total entries</span>
                                <span id="dateRangeSpan">No data</span>
                            </div>
                        </div>
                        <div className="date-range-controls">
                            <div className="date-input-group">
                                <label htmlFor="startDate">From:</label>
                                <input type="date" id="startDate" className="date-input" />
                            </div>
                            <div className="date-input-group">
                                <label htmlFor="endDate">To:</label>
                                <input type="date" id="endDate" className="date-input" />
                            </div>
                            <div className="date-range-buttons">
                                <button id="applyDateRange" className="apply-btn">Apply Filter</button>
                                <button id="resetDateRange" className="reset-btn">Reset</button>
                                <button id="showComparison" className="comparison-btn">📊 Compare Periods</button>
                            </div>
                            <div className="quick-filters">
                                <button className="quick-filter-btn" data-days="1">Today</button>
                                <button className="quick-filter-btn" data-days="7">Last 7 Days</button>
                                <button className="quick-filter-btn" data-days="30">Last 30 Days</button>
                                <button className="quick-filter-btn" data-days="90">Last 90 Days</button>
                            </div>
                        </div>
                        <div className="filtered-info hidden" id="filteredInfo">
                            <span id="filteredEntries">0 entries</span> shown from
                            <span id="filteredDateRange">date range</span>
                        </div>
                    </div>
                    <div id="comparisonSection" className="comparison-section hidden">
                        <div className="comparison-header">
                            <h3>📈 Period Comparison</h3>
                            <button id="hideComparison" className="close-comparison-btn">✕</button>
                        </div>
                        <div className="comparison-controls">
                            <div className="comparison-periods">
                                <div className="period-selector">
                                    <h4>Period A</h4>
                                    <div className="period-inputs">
                                        <input type="date" id="periodAStart" className="date-input" />
                                        <span>to</span>
                                        <input type="date" id="periodAEnd" className="date-input" />
                                    </div>
                                    <div className="period-presets">
                                        <button className="preset-btn" data-period="A" data-days="7">Last 7 days</button>
                                        <button className="preset-btn" data-period="A" data-days="30">Last 30 days</button>
                                    </div>
                                </div>
                                <div className="period-selector">
                                    <h4>Period B (Compare to)</h4>
                                    <div className="period-inputs">
                                        <input type="date" id="periodBStart" className="date-input" />
                                        <span>to</span>
                                        <input type="date" id="periodBEnd" className="date-input" />
                                    </div>
                                    <div className="period-presets">
                                        <button className="preset-btn" data-period="B" data-days="7">Previous 7 days</button>
                                        <button className="preset-btn" data-period="B" data-days="30">Previous 30 days</button>
                                    </div>
                                </div>
                            </div>
                            <button id="runComparison" className="run-comparison-btn">Run Comparison</button>
                        </div>
                        <div id="comparisonResults" className="comparison-results hidden">
                            <div className="comparison-summary">
                                <div className="period-info">
                                    <div className="period-card period-a">
                                        <h4>Period A</h4>
                                        <div className="period-dates" id="periodADates"></div>
                                        <div className="period-duration" id="periodADuration"></div>
                                    </div>
                                    <div className="period-card period-b">
                                        <h4>Period B</h4>
                                        <div className="period-dates" id="periodBDates"></div>
                                        <div className="period-duration" id="periodBDuration"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="comparison-metrics">
                                <div className="metric-card">
                                    <div className="metric-label">Total Requests</div>
                                    <div className="metric-values">
                                        <span className="metric-a" id="compTotalRequestsA">0</span>
                                        <span className="metric-b" id="compTotalRequestsB">0</span>
                                    </div>
                                    <div className="metric-change" id="compTotalRequestsChange">0%</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-label">Unique URLs</div>
                                    <div className="metric-values">
                                        <span className="metric-a" id="compUniqueUrlsA">0</span>
                                        <span className="metric-b" id="compUniqueUrlsB">0</span>
                                    </div>
                                    <div className="metric-change" id="compUniqueUrlsChange">0%</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-label">Bot Traffic</div>
                                    <div className="metric-values">
                                        <span className="metric-a" id="compBotTrafficA">0</span>
                                        <span className="metric-b" id="compBotTrafficB">0</span>
                                    </div>
                                    <div className="metric-change" id="compBotTrafficChange">0%</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-label">Human Traffic</div>
                                    <div className="metric-values">
                                        <span className="metric-a" id="compHumanTrafficA">0</span>
                                        <span className="metric-b" id="compHumanTrafficB">0</span>
                                    </div>
                                    <div className="metric-change" id="compHumanTrafficChange">0%</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-label">Total Bytes</div>
                                    <div className="metric-values">
                                        <span className="metric-a" id="compTotalBytesA">0</span>
                                        <span className="metric-b" id="compTotalBytesB">0</span>
                                    </div>
                                    <div className="metric-change" id="compTotalBytesChange">0%</div>
                                </div>
                                <div className="metric-card">
                                    <div className="metric-label">Error Rate</div>
                                    <div className="metric-values">
                                        <span className="metric-a" id="compErrorRateA">0%</span>
                                        <span className="metric-b" id="compErrorRateB">0%</span>
                                    </div>
                                    <div className="metric-change" id="compErrorRateChange">0%</div>
                                </div>
                            </div>
                            <div className="comparison-charts">
                                <div className="chart-container">
                                    <div className="chart-header">
                                        <h3>Daily Traffic Comparison</h3>
                                    </div>
                                    <canvas id="comparisonTrafficChart"></canvas>
                                </div>
                                <div className="chart-container">
                                    <div className="chart-header">
                                        <h3>Bot vs Human Traffic Comparison</h3>
                                    </div>
                                    <canvas id="comparisonBotChart"></canvas>
                                </div>
                            </div>
                            <div className="comparison-tables">
                                <div className="comparison-table-container">
                                    <div className="chart-header">
                                        <h3>🤖 Bot Hits per URL - Comparison</h3>
                                        <div className="comparison-table-controls">
                                            <div className="multiselect-dropdown" id="compBotFilterDropdown">
                                                <div className="multiselect-display" id="compBotFilterDisplay">Select Bots</div>
                                                <div className="multiselect-options" id="compBotFilterOptions">
                                                    <div className="multiselect-actions">
                                                        <button className="filter-action-btn" data-action="select-all">Select All</button>
                                                        <button className="filter-action-btn" data-action="deselect-all">Deselect All</button>
                                                    </div>
                                                    <div className="multiselect-search-container">
                                                        <input type="text" id="compBotFilterSearch" className="multiselect-search-input" placeholder="Search bots..." />
                                                    </div>
                                                    <div className="multiselect-checkboxes" id="compBotFilterCheckboxes">
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="export-btn" data-table="comparison-bot-hits">Export CSV</button>
                                        </div>
                                    </div>
                                    <div className="table-wrapper">
                                        <table id="comparisonBotHitsTable">
                                            <thead></thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="comparison-table-container">
                                    <div className="chart-header">
                                        <h3>👥 Human Traffic Sources - Comparison</h3>
                                        <div className="comparison-table-controls">
                                            <div className="multiselect-dropdown" id="compReferrerFilterDropdown">
                                                <div className="multiselect-display" id="compReferrerFilterDisplay">Select Referrers</div>
                                                <div className="multiselect-options" id="compReferrerFilterOptions">
                                                    <div className="multiselect-actions">
                                                        <button className="filter-action-btn" data-action="select-all">Select All</button>
                                                        <button className="filter-action-btn" data-action="deselect-all">Deselect All</button>
                                                    </div>
                                                    <div className="multiselect-search-container">
                                                        <input type="text" id="compReferrerFilterSearch" className="multiselect-search-input" placeholder="Search referrers..." />
                                                    </div>
                                                    <div className="multiselect-checkboxes" id="compReferrerFilterCheckboxes">
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="export-btn" data-table="comparison-traffic-sources">Export CSV</button>
                                        </div>
                                    </div>
                                    <div className="table-wrapper">
                                        <table id="comparisonTrafficSourcesTable">
                                            <thead></thead>
                                            <tbody></tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3>Unique URLs</h3>
                            <div className="stat-value" id="uniqueUrls">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Unique URLs / day</h3>
                            <div className="stat-value" id="uniqueUrlsPerDay">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Total events</h3>
                            <div className="stat-value" id="totalEvents">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Events / day</h3>
                            <div className="stat-value" id="eventsPerDay">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Total bytes</h3>
                            <div className="stat-value" id="totalBytes">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Average bytes</h3>
                            <div className="stat-value" id="avgBytes">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Bytes per day</h3>
                            <div className="stat-value" id="bytesPerDay">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Success (2xx)</h3>
                            <div className="stat-value" id="successCount">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Redirection (3xx)</h3>
                            <div className="stat-value" id="redirectionCount">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Client Error (4xx)</h3>
                            <div className="stat-value" id="clientErrorCount">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Server Error (5xx)</h3>
                            <div className="stat-value" id="serverErrorCount">0</div>
                        </div>
                        <div className="stat-card">
                            <h3>Errors</h3>
                            <div className="stat-value" id="errorCount">0</div>
                        </div>
                    </div>
                    <div className="bot-analysis-section">
                        <h2>🤖 Bot & Crawler Analysis</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Total Bot Requests</h3>
                                <div className="stat-value" id="totalBotRequests">0</div>
                            </div>
                            <div className="stat-card">
                                <h3>Bot Traffic %</h3>
                                <div className="stat-value" id="botTrafficPercentage">0%</div>
                            </div>
                            <div className="stat-card">
                                <h3>Unique Bots</h3>
                                <div className="stat-value" id="uniqueBots">0</div>
                            </div>
                            <div className="stat-card">
                                <h3>Human Traffic %</h3>
                                <div className="stat-value" id="humanTrafficPercentage">0%</div>
                            </div>
                        </div>
                        <div className="bot-categories">
                            <div className="bot-category">
                                <div className="bot-category-header">
                                    <h3 className="bot-category-title">🔍 SEO & Search Engine Bots</h3>
                                    <span className="bot-category-count" id="seoBotsCount">0 requests</span>
                                </div>
                                <div className="bot-list" id="seoBotsList">
                                </div>
                            </div>
                            <div className="bot-category">
                                <div className="bot-category-header">
                                    <h3 className="bot-category-title">🧠 AI & Machine Learning Bots</h3>
                                    <span className="bot-category-count" id="aiBotsCount">0 requests</span>
                                </div>
                                <div className="bot-list" id="aiBotsList">
                                </div>
                            </div>
                            <div className="bot-category">
                                <div className="bot-category-header">
                                    <h3 className="bot-category-title">📱 Social Media Bots</h3>
                                    <span className="bot-category-count" id="socialBotsCount">0 requests</span>
                                </div>
                                <div className="bot-list" id="socialBotsList">
                                </div>
                            </div>
                            <div className="bot-category">
                                <div className="bot-category-header">
                                    <h3 className="bot-category-title">📊 Monitoring & Analytics Bots</h3>
                                    <span className="bot-category-count" id="monitoringBotsCount">0 requests</span>
                                </div>
                                <div className="bot-list" id="monitoringBotsList">
                                </div>
                            </div>
                            <div className="bot-category">
                                <div className="bot-category-header">
                                    <h3 className="bot-category-title">🔒 Security & Vulnerability Scanners</h3>
                                    <span className="bot-category-count" id="securityBotsCount">0 requests</span>
                                </div>
                                <div className="bot-list" id="securityBotsList">
                                </div>
                            </div>
                            <div className="bot-category">
                                <div className="bot-category-header">
                                    <h3 className="bot-category-title">🔧 Other Bots & Tools</h3>
                                    <span className="bot-category-count" id="otherBotsCount">0 requests</span>
                                </div>
                                <div className="bot-list" id="otherBotsList">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="charts-section">
                        <div className="chart-container">
                            <div className="chart-header">
                                <h3>Response Codes Over Time</h3>
                                <button className="export-btn" data-chart="responseCodes">Export</button>
                            </div>
                            <canvas id="responseCodesChart"></canvas>
                        </div>
                        <div className="chart-container">
                            <div className="chart-header">
                                <h3>Daily Events</h3>
                                <button className="export-btn" data-chart="events">Export</button>
                            </div>
                            <canvas id="eventsChart"></canvas>
                        </div>
                        <div className="chart-container">
                            <div className="chart-header">
                                <h3>Top URLs</h3>
                                <button className="export-btn" data-chart="urls">Export</button>
                            </div>
                            <canvas id="urlsChart"></canvas>
                        </div>
                        <div className="chart-container">
                            <div className="chart-header">
                                <h3>Bot Activity Over Time</h3>
                                <button className="export-btn" data-chart="botActivity">Export</button>
                            </div>
                            <canvas id="botActivityChart"></canvas>
                        </div>
                        <div className="chart-container">
                            <div className="chart-header">
                                <h3>Top Bots Distribution</h3>
                                <button className="export-btn" data-chart="botDistribution">Export</button>
                            </div>
                            <canvas id="botDistributionChart"></canvas>
                        </div>
                        <div className="table-container">
                            <div className="chart-header">
                                <h3>Top URLs</h3>
                                <button className="export-btn" data-table="urls">Export CSV</button>
                            </div>
                            <div className="table-wrapper">
                                <table id="topUrlsTable">
                                    <thead>
                                        <tr>
                                            <th>URL</th>
                                            <th>Hits</th>
                                            <th>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="chart-header">
                                <h3>Top IP Addresses</h3>
                                <button className="export-btn" data-table="ips">Export CSV</button>
                            </div>
                            <div className="table-wrapper">
                                <table id="topIpsTable">
                                    <thead>
                                        <tr>
                                            <th>IP Address</th>
                                            <th>Hits</th>
                                            <th>Percentage</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="chart-header">
                                <h3>Bot Details</h3>
                                <button className="export-btn" data-table="bots">Export CSV</button>
                            </div>
                            <div className="table-wrapper">
                                <table id="botDetailsTable">
                                    <thead>
                                        <tr>
                                            <th>Bot Name</th>
                                            <th>Type</th>
                                            <th>Requests</th>
                                            <th>Percentage</th>
                                            <th>Last Seen</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div className="interactive-table-card full-width">
                            <div className="chart-header">
                                <h3>Bot Hits per URL</h3>
                                <button className="export-btn" data-table="bot-url-hits">Export CSV</button>
                            </div>
                            <div className="bot-filter-controls">
                                <div className="multiselect-dropdown" id="botUrlFilterDropdown">
                                    <div className="multiselect-display" id="botUrlFilterDisplay">Select Bots</div>
                                    <div className="multiselect-options" id="botUrlFilterOptions">
                                        <div className="multiselect-actions">
                                            <button className="filter-action-btn" data-action="select-all">Select All</button>
                                            <button className="filter-action-btn" data-action="deselect-all">Deselect All</button>
                                        </div>
                                        <div className="multiselect-search-container">
                                            <input type="text" id="botFilterSearch" className="multiselect-search-input"
                                                placeholder="Search bots..." />
                                        </div>
                                        <div className="multiselect-checkboxes" id="botUrlFilterCheckboxes">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table-wrapper">
                                <table id="botUrlHitsTable">
                                    <thead></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div className="interactive-table-card full-width">
                            <div className="chart-header">
                                <h3>Human Traffic Sources</h3>
                                <button className="export-btn" data-table="traffic-sources">Export CSV</button>
                            </div>
                            <div className="bot-filter-controls">
                                <div className="multiselect-dropdown" id="referrerFilterDropdown">
                                    <div className="multiselect-display" id="referrerFilterDisplay">Select Referrers</div>
                                    <div className="multiselect-options" id="referrerFilterOptions">
                                        <div className="multiselect-actions">
                                            <button className="filter-action-btn" data-action="select-all">Select All</button>
                                            <button className="filter-action-btn" data-action="deselect-all">Deselect All</button>
                                        </div>
                                        <div className="multiselect-search-container">
                                            <input type="text" id="referrerFilterSearch" className="multiselect-search-input"
                                                placeholder="Search referrers..." />
                                        </div>
                                        <div className="multiselect-checkboxes" id="referrerFilterCheckboxes">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="table-wrapper">
                                <table id="trafficSourceTable">
                                    <thead></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="rejectionModal" className="modal-overlay hidden">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Exclude URL Prefixes</h3>
                            <button id="closeRejectionModal" className="modal-close-btn">×</button>
                        </div>
                        <div className="modal-body">
                            <p>Enter any URL prefixes you wish to exclude from the analysis. For example, entering
                                <code>/wp-json/</code> will ignore all requests to that path.
                            </p>
                            <div id="rejectionRulesContainer">
                                <div className="rejection-rule-row">
                                    <input type="text" placeholder="/path/to/exclude/" defaultValue="/wp-" />
                                    <button className="remove-rule-btn">−</button>
                                </div>
                                <div className="rejection-rule-row">
                                    <input type="text" placeholder="/path/to/exclude/" defaultValue="/robots.txt" />
                                    <button className="remove-rule-btn">−</button>
                                </div>
                                <div className="rejection-rule-row">
                                    <input type="text" placeholder="/path/to/exclude/" defaultValue="/sitemaps.xml" />
                                    <button className="remove-rule-btn">−</button>
                                </div>
                            </div>
                            <button id="addRejectionRule" className="add-rule-btn">+ Add Rule</button>
                        </div>
                        <div className="modal-footer">
                            <button id="analyzeWithoutRejection" className="modal-btn secondary">Analyze Without Filtering</button>
                            <button id="confirmRejectionAndAnalyze" className="modal-btn primary">Apply Filters & Analyze</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </main>
    );
};

export default AnalyzerPage;
