class LogAnalyzer {
  constructor() {
    // This will hold the detailed stats for each day after parsing the file.
    // e.g., { "2023-10-27": { stats for this day }, "2023-10-28": { ... } }
    this.dailyStats = {};

    // This will hold the aggregated analysis for the currently displayed range.
    this.currentAnalysis = null;

    // This will store the analysis for the *entire* log file to easily reset filters.
    this.fullFileAnalysis = null;

    this.charts = {};
    this.botPatterns = this.initializeBotPatterns();
    this.initializeEventListeners();
  }

  /**
   * Creates a fresh, zeroed-out statistics object.
   * Used for initializing daily stats and aggregate results.
   */
  getNewStatBlock() {
    return {
      totalEntries: 0,
      uniqueUrls: new Set(),
      statusCodes: {},
      totalBytes: 0,
      botRequests: 0,
      humanRequests: 0,
      uniqueBots: new Set(),
      botsByType: {},
      botStats: {},
      urlCounts: {},
      ipCounts: {},
      minDate: null,
      maxDate: null,
      botUrlHits: {}, // Format: { "url": { "botName": count } }
    };
  }

  initializeBotPatterns() {
    return {
      seo: [
        { name: "Googlebot", pattern: /googlebot|^google$/i, company: "Google" },
        { name: "Bingbot", pattern: /bingbot/i, company: "Microsoft" },
        { name: "Slurp", pattern: /slurp/i, company: "Yahoo" },
        { name: "DuckDuckBot", pattern: /duckduckbot/i, company: "DuckDuckGo" },
        { name: "Baiduspider", pattern: /baiduspider/i, company: "Baidu" },
        { name: "YandexBot", pattern: /yandexbot/i, company: "Yandex" },
        { name: "Sogou", pattern: /sogou/i, company: "Sogou" },
        { name: "Exabot", pattern: /exabot/i, company: "Exalead" },
        { name: "facebookexternalhit", pattern: /facebookexternalhit/i, company: "Facebook" },
        { name: "Twitterbot", pattern: /twitterbot/i, company: "Twitter" },
        { name: "LinkedInBot", pattern: /linkedinbot/i, company: "LinkedIn" },
        { name: "WhatsApp", pattern: /whatsapp/i, company: "WhatsApp" },
        { name: "Applebot", pattern: /applebot/i, company: "Apple" },
        { name: "MJ12bot", pattern: /mj12bot/i, company: "Majestic" },
        { name: "AhrefsBot", pattern: /ahrefsbot/i, company: "Ahrefs" },
        { name: "SemrushBot", pattern: /semrushbot/i, company: "Semrush" },
        { name: "MozBot", pattern: /rogerbot|dotbot/i, company: "Moz" },
      ],
      ai: [
        { name: "GPTBot", pattern: /gptbot/i, company: "OpenAI" },
        { name: "ChatGPT-User", pattern: /chatgpt-user/i, company: "OpenAI" },
        { name: "CCBot", pattern: /ccbot/i, company: "Common Crawl" },
        { name: "Claude-Web", pattern: /claude-web/i, company: "Anthropic" },
        { name: "PerplexityBot", pattern: /perplexitybot/i, company: "Perplexity" },
        { name: "YouBot", pattern: /youbot/i, company: "You.com" },
        { name: "AI2Bot", pattern: /ai2bot/i, company: "AI2" },
        { name: "ImagesiftBot", pattern: /imagesiftbot/i, company: "ImageSift" },
        { name: "Omgilibot", pattern: /omgilibot/i, company: "Omgili" },
        { name: "Bytespider", pattern: /bytespider/i, company: "ByteDance" },
        { name: "MetaExternalAgent ", pattern: /meta-externalagent/i, company: "Meta" },
      ],
      social: [
        { name: "FacebookBot", pattern: /facebookbot/i, company: "Facebook" },
        { name: "TelegramBot", pattern: /telegrambot/i, company: "Telegram" },
        { name: "SkypeUriPreview", pattern: /skypeuripreview/i, company: "Skype" },
        { name: "SlackBot", pattern: /slackbot/i, company: "Slack" },
        { name: "DiscordBot", pattern: /discordbot/i, company: "Discord" },
        { name: "RedditBot", pattern: /redditbot/i, company: "Reddit" },
        { name: "PinterestBot", pattern: /pinterestbot/i, company: "Pinterest" },
      ],
      monitoring: [
        { name: "UptimeRobot", pattern: /uptimerobot/i, company: "UptimeRobot" },
        { name: "Pingdom", pattern: /pingdom/i, company: "Pingdom" },
        { name: "StatusCake", pattern: /statuscake/i, company: "StatusCake" },
        { name: "Site24x7", pattern: /site24x7/i, company: "Site24x7" },
        { name: "GTmetrix", pattern: /gtmetrix/i, company: "GTmetrix" },
        { name: "PageSpeed", pattern: /pagespeed/i, company: "Google PageSpeed" },
      ],
      security: [
        { name: "Nessus", pattern: /nessus/i, company: "Tenable" },
        { name: "Nikto", pattern: /nikto/i, company: "Nikto" },
        { name: "Nmap", pattern: /nmap/i, company: "Nmap" },
        { name: "Qualys", pattern: /qualys/i, company: "Qualys" },
        { name: "OpenVAS", pattern: /openvas/i, company: "OpenVAS" },
        { name: "ZAP", pattern: /zap/i, company: "OWASP ZAP" },
      ],
      other: [
        { name: "Wget", pattern: /wget/i, company: "GNU Wget" },
        { name: "Curl", pattern: /curl/i, company: "cURL" },
        { name: "Python-requests", pattern: /python-requests/i, company: "Python" },
        { name: "Go-http-client", pattern: /go-http-client/i, company: "Go" },
        { name: "Java", pattern: /java/i, company: "Java" },
        { name: "Node.js", pattern: /node/i, company: "Node.js" },
        { name: "Scrapy", pattern: /scrapy/i, company: "Scrapy" },
        { name: "Headless Chrome", pattern: /headlesschrome/i, company: "Chrome" },
        { name: "DownNotifier", pattern: /downnotifier/i, company: "DownNotifier" },
        { name: "BetterUptime", pattern: /betteruptime|better uptime/i, company: "Better Uptime" },
        { name: "HubSpotPageFetcher", pattern: /hubspotpagefetcher|HubSpot Page Fetcher/i, company: "HubSpot" },
        { name: "AdsBot Google Mobile", pattern: /adsbot-google-mobile/i, company: "Google" },
        { name: "AdsBot Google", pattern: /adsbot-google/i, company: "Google" },
        { name: "Google-Adwords-Instant", pattern: /google-adwords-instant/i, company: "Google" },
      ],
    };
  }

  initializeEventListeners() {
    const fileInput = document.getElementById("logFile");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const dropbox = document.getElementById("dropbox");
    const removeFileBtn = document.getElementById("removeFile");
    const clearDataBtn = document.getElementById("clearData");
    const exportReportBtn = document.getElementById("exportReport");
    const applyDateRangeBtn = document.getElementById("applyDateRange");
    const resetDateRangeBtn = document.getElementById("resetDateRange");
    const quickFilterBtns = document.querySelectorAll(".quick-filter-btn");
    // START: New dropdown event listeners
    const botUrlFilterDropdown = document.getElementById("botUrlFilterDropdown");
    const botUrlFilterDisplay = document.getElementById("botUrlFilterDisplay");
    const botUrlFilterOptions = document.getElementById("botUrlFilterOptions");
    // END: New dropdown event listeners

    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) this.handleFileSelection(e.target.files[0]);
    });
    dropbox.addEventListener("click", (e) => {
      if (!e.target.closest(".remove-file")) fileInput.click();
    });
    dropbox.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropbox.classList.add("dragover");
    });
    dropbox.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropbox.classList.remove("dragover");
    });
    dropbox.addEventListener("drop", (e) => {
      e.preventDefault();
      dropbox.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file && (file.type === "text/plain" || file.name.endsWith(".log") || file.name.endsWith(".txt"))) {
        fileInput.files = e.dataTransfer.files;
        this.handleFileSelection(file);
      } else {
        alert("Please select a valid log file (.log or .txt)");
      }
    });
    removeFileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.clearFileSelection();
    });
    analyzeBtn.addEventListener("click", () => this.analyzeLogFile());
    clearDataBtn.addEventListener("click", () => this.clearAllData());
    exportReportBtn.addEventListener("click", () => this.exportFullReport());
    applyDateRangeBtn.addEventListener("click", () => this.applyDateFilter());
    resetDateRangeBtn.addEventListener("click", () => this.resetDateFilter());
    quickFilterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const days = Number.parseInt(e.target.dataset.days);
        this.applyQuickFilter(days);
      });
    });

    // START: New dropdown logic
    botUrlFilterDisplay.addEventListener("click", () => {
        botUrlFilterOptions.classList.toggle('visible');
    });

    botUrlFilterOptions.addEventListener("change", (e) => {
        if (e.target.type === 'checkbox') {
            this.updateMultiSelectDisplayText();
            this.createBotUrlHitsTable(this.currentAnalysis.botUrlHits);
        }
    });

    botUrlFilterOptions.addEventListener("click", (e) => {
        const checkboxes = botUrlFilterOptions.querySelectorAll('input[type="checkbox"]');
        if (e.target.matches('[data-action="select-all"]')) {
            checkboxes.forEach(cb => cb.checked = true);
            this.updateMultiSelectDisplayText();
            this.createBotUrlHitsTable(this.currentAnalysis.botUrlHits);
        }
        if (e.target.matches('[data-action="deselect-all"]')) {
            checkboxes.forEach(cb => cb.checked = false);
            this.updateMultiSelectDisplayText();
            this.createBotUrlHitsTable(this.currentAnalysis.botUrlHits);
        }
    });

    window.addEventListener('click', (e) => {
        if (!botUrlFilterDropdown.contains(e.target)) {
            botUrlFilterOptions.classList.remove('visible');
        }
    });
    // END: New dropdown logic
  }

  handleFileSelection(file) {
    document.querySelector(".dropbox-content").classList.add("hidden");
    document.getElementById("fileInfo").classList.remove("hidden");
    document.getElementById("fileName").textContent = file.name;
    document.getElementById("fileSize").textContent = this.formatFileSize(file.size);

    const fileSizeMB = file.size / (1024 * 1024);
    document.getElementById("fileSizeWarning").classList.toggle("hidden", fileSizeMB <= 25);
    document.getElementById("analyzeBtn").disabled = false;
  }

  clearFileSelection() {
    document.getElementById("logFile").value = "";
    document.querySelector(".dropbox-content").classList.remove("hidden");
    document.getElementById("fileInfo").classList.add("hidden");
    document.getElementById("fileSizeWarning").classList.add("hidden");
    document.getElementById("analyzeBtn").disabled = true;
  }

  clearAllData() {
    this.dailyStats = {};
    this.currentAnalysis = null;
    this.fullFileAnalysis = null;
    this.destroyExistingCharts();
    document.getElementById("results").classList.add("hidden");
    document.getElementById("filteredInfo").classList.add("hidden");
    this.clearFileSelection();
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("botUrlFilterCheckboxes").innerHTML = "";
    document.querySelector("#botUrlHitsTable tbody").innerHTML = "";
    document.querySelector("#botUrlHitsTable thead").innerHTML = "";
    this.updateMultiSelectDisplayText();
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  async analyzeLogFile() {
    const file = document.getElementById("logFile").files[0];
    if (!file) return;

    this.showLoading(true);
    this.dailyStats = {}; // Reset data for new analysis

    try {
      await this.processFileLineByLine(file);

      const dateKeys = Object.keys(this.dailyStats).sort();
      if(dateKeys.length === 0) {
        alert("No valid log entries found. Please check the file format.");
        return;
      }
      const minDate = new Date(dateKeys[0]);
      const maxDate = new Date(dateKeys[dateKeys.length - 1]);

      this.fullFileAnalysis = this.aggregateStatsForRange(minDate, maxDate);
      this.currentAnalysis = this.fullFileAnalysis;

      document.getElementById("loadingStatus").textContent = "Generating analysis...";
      this.updateProgress(90);
      await new Promise((resolve) => setTimeout(resolve, 100));

      this.setupDateRangeControls(minDate, maxDate);
      this.displayResults(this.currentAnalysis);
      this.updateProgress(100);

    } catch (error) {
      console.error("Error analyzing log file:", error);
      alert(`Error analyzing log file: ${error.message}.`);
    } finally {
      this.showLoading(false);
    }
  }

  async processFileLineByLine(file) {
    const chunkSize = 64 * 1024;
    let offset = 0;
    let buffer = "";
    let processedLines = 0;
    const logRegex = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) ([^"]*) HTTP\/[\d.]+" (\d+) (\d+|-) "([^"]*)" "([^"]*)"/;

    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(chunk);
      });
      buffer += text;
      offset += chunkSize;

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          this.processLogLine(line.trim(), logRegex);
          processedLines++;
          if (processedLines % 1000 === 0) {
            const progress = Math.min((offset / file.size) * 80, 80);
            this.updateProgress(progress);
            document.getElementById("loadingStatus").textContent = `Processed ${processedLines.toLocaleString()} entries...`;
            await new Promise((resolve) => setTimeout(resolve, 1));
          }
        }
      }
    }
    if (buffer.trim()) this.processLogLine(buffer.trim(), logRegex);
    this.updateProgress(80);
  }

  processLogLine(line, logRegex) {
    const match = logRegex.exec(line);
    if (!match) return;

    const [, ip, timestamp, method, url, status, size, referer, userAgent] = match;

    try {
      const timestampStr = timestamp.replace(/(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2}) ([+-]\d{4})/, "$1 $2 $3 $4:$5:$6");
      const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
      const [day, monthStr, year, time] = timestampStr.split(" ");
      const [hour, minute, second] = time.split(":");
      const parsedDate = new Date(Date.UTC(Number.parseInt(year), months[monthStr], Number.parseInt(day), Number.parseInt(hour), Number.parseInt(minute), Number.parseInt(second)));
      
      if (isNaN(parsedDate)) return; // Skip if date is invalid

      const entry = {
        ip,
        timestamp: parsedDate,
        method,
        url: url || "/",
        status: Number.parseInt(status),
        size: size === "-" ? 0 : Number.parseInt(size),
        referer,
        userAgent,
      };
      this.updateDailyStats(entry);

    } catch (error) {
      // Ignore lines with invalid dates
    }
  }

  updateDailyStats(entry) {
    const dateKey = entry.timestamp.toISOString().split("T")[0];

    if (!this.dailyStats[dateKey]) {
      this.dailyStats[dateKey] = this.getNewStatBlock();
    }
    const dayStats = this.dailyStats[dateKey];

    dayStats.totalEntries++;
    dayStats.totalBytes += entry.size;
    dayStats.uniqueUrls.add(entry.url);
    dayStats.urlCounts[entry.url] = (dayStats.urlCounts[entry.url] || 0) + 1;
    dayStats.ipCounts[entry.ip] = (dayStats.ipCounts[entry.ip] || 0) + 1;

    const statusClass = Math.floor(entry.status / 100);
    dayStats.statusCodes[statusClass] = (dayStats.statusCodes[statusClass] || 0) + 1;

    const botInfo = this.detectBot(entry.userAgent);
    if (botInfo.isBot) {
      dayStats.botRequests++;
      dayStats.uniqueBots.add(botInfo.name);
      dayStats.botsByType[botInfo.type] = (dayStats.botsByType[botInfo.type] || 0) + 1;

      if (!dayStats.botStats[botInfo.name]) {
        dayStats.botStats[botInfo.name] = { ...botInfo, count: 0, lastSeen: entry.timestamp };
      }
      dayStats.botStats[botInfo.name].count++;
      dayStats.botStats[botInfo.name].lastSeen = entry.timestamp;

      if (!dayStats.botUrlHits[entry.url]) {
          dayStats.botUrlHits[entry.url] = {};
      }
      dayStats.botUrlHits[entry.url][botInfo.name] = (dayStats.botUrlHits[entry.url][botInfo.name] || 0) + 1;
    } else {
      dayStats.humanRequests++;
    }
  }

  aggregateStatsForRange(startDate, endDate) {
    const result = this.getNewStatBlock();
    result.minDate = startDate;
    result.maxDate = endDate;

    const dateKeys = Object.keys(this.dailyStats).sort();

    for (const dateKey of dateKeys) {
      const dayDate = new Date(dateKey + 'T00:00:00.000Z');
      if (dayDate >= startDate && dayDate <= endDate) {
        const dayStats = this.dailyStats[dateKey];

        result.totalEntries += dayStats.totalEntries;
        result.totalBytes += dayStats.totalBytes;
        result.botRequests += dayStats.botRequests;
        result.humanRequests += dayStats.humanRequests;

        for (const [code, count] of Object.entries(dayStats.statusCodes)) {
          result.statusCodes[code] = (result.statusCodes[code] || 0) + count;
        }
        for (const [url, count] of Object.entries(dayStats.urlCounts)) {
          result.urlCounts[url] = (result.urlCounts[url] || 0) + count;
        }
        for (const [ip, count] of Object.entries(dayStats.ipCounts)) {
          result.ipCounts[ip] = (result.ipCounts[ip] || 0) + count;
        }
        for (const [type, count] of Object.entries(dayStats.botsByType)) {
          result.botsByType[type] = (result.botsByType[type] || 0) + count;
        }

        dayStats.uniqueUrls.forEach(url => result.uniqueUrls.add(url));
        dayStats.uniqueBots.forEach(botName => result.uniqueBots.add(botName));

        for (const [botName, botData] of Object.entries(dayStats.botStats)) {
          if (!result.botStats[botName]) {
            result.botStats[botName] = { ...botData };
          } else {
            result.botStats[botName].count += botData.count;
            if (botData.lastSeen > result.botStats[botName].lastSeen) {
              result.botStats[botName].lastSeen = botData.lastSeen;
            }
          }
        }
        for (const [url, bots] of Object.entries(dayStats.botUrlHits)) {
            if (!result.botUrlHits[url]) {
                result.botUrlHits[url] = {};
            }
            for (const [botName, count] of Object.entries(bots)) {
                result.botUrlHits[url][botName] = (result.botUrlHits[url][botName] || 0) + count;
            }
        }
      }
    }
    return result;
  }

  updateProgress(percentage) {
    const progressBar = document.getElementById("progressBar");
    if (progressBar) progressBar.style.width = `${percentage}%`;
  }

  detectBot(userAgent) {
    for (const [type, bots] of Object.entries(this.botPatterns)) {
      for (const bot of bots) {
        if (bot.pattern.test(userAgent)) {
          return { isBot: true, name: bot.name, type: type, company: bot.company };
        }
      }
    }
    const genericBotPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i, /fetcher/i, /monitor/i, /checker/i, /validator/i, /indexer/i];
    for (const pattern of genericBotPatterns) {
      if (pattern.test(userAgent)) {
        const botNameMatch = userAgent.match(/(\w+bot|\w+spider|\w+crawler)/i);
        const botName = botNameMatch ? botNameMatch[1] : "Unknown Bot";
        return { isBot: true, name: botName, type: "other", company: "Unknown" };
      }
    }
    return { isBot: false, name: null, type: null, company: null };
  }

  displayResults(analysisData) {
    this.destroyExistingCharts();
    this.displayStatistics(analysisData);
    this.displayBotAnalysis(analysisData);
    this.createAllCharts(analysisData);
    this.populateBotFilterControls(analysisData.botStats);
    this.createAllTables(analysisData);
    document.getElementById("results").classList.remove("hidden");
  }

  displayStatistics(data) {
    const daysDiff = data.minDate && data.maxDate ? Math.max(1, Math.ceil((data.maxDate - data.minDate) / (1000 * 60 * 60 * 24))) : 1;
    document.getElementById("uniqueUrls").textContent = data.uniqueUrls.size.toLocaleString();
    document.getElementById("uniqueUrlsPerDay").textContent = Math.round(data.uniqueUrls.size / daysDiff).toLocaleString();
    document.getElementById("totalEvents").textContent = data.totalEntries.toLocaleString();
    document.getElementById("eventsPerDay").textContent = Math.round(data.totalEntries / daysDiff).toLocaleString();
    document.getElementById("totalBytes").textContent = this.formatBytes(data.totalBytes);
    document.getElementById("avgBytes").textContent = this.formatBytes(data.totalEntries > 0 ? Math.round(data.totalBytes / data.totalEntries) : 0);
    document.getElementById("bytesPerDay").textContent = this.formatBytes(Math.round(data.totalBytes / daysDiff));
    document.getElementById("successCount").textContent = (data.statusCodes[2] || 0).toLocaleString();
    document.getElementById("redirectionCount").textContent = (data.statusCodes[3] || 0).toLocaleString();
    document.getElementById("clientErrorCount").textContent = (data.statusCodes[4] || 0).toLocaleString();
    document.getElementById("serverErrorCount").textContent = (data.statusCodes[5] || 0).toLocaleString();
    document.getElementById("errorCount").textContent = ((data.statusCodes[4] || 0) + (data.statusCodes[5] || 0)).toLocaleString();

    // Bot stats
    document.getElementById("totalBotRequests").textContent = data.botRequests.toLocaleString();
    document.getElementById("botTrafficPercentage").textContent = data.totalEntries > 0 ? `${((data.botRequests / data.totalEntries) * 100).toFixed(1)}%` : "0%";
    document.getElementById("uniqueBots").textContent = data.uniqueBots.size.toLocaleString();
    document.getElementById("humanTrafficPercentage").textContent = data.totalEntries > 0 ? `${((data.humanRequests / data.totalEntries) * 100).toFixed(1)}%` : "0%";
  }

  displayBotAnalysis(data) {
    const botTypes = ["seo", "ai", "social", "monitoring", "security", "other"];
    botTypes.forEach(type => {
      document.getElementById(`${type}BotsCount`).textContent = `${(data.botsByType[type] || 0).toLocaleString()} requests`;
      this.populateBotList(type, data.botStats, data.totalEntries);
    });
  }

  populateBotList(type, botStats, totalRequests) {
    const listElement = document.getElementById(`${type}BotsList`);
    listElement.innerHTML = "";
    const botsOfType = Object.values(botStats).filter(bot => bot.type === type).sort((a, b) => b.count - a.count);

    if (botsOfType.length === 0) {
      listElement.innerHTML = '<div class="empty-category">No bots detected in this category</div>';
      return;
    }

    botsOfType.forEach(bot => {
      const percentage = totalRequests > 0 ? ((bot.count / totalRequests) * 100).toFixed(2) : 0;
      const botItem = document.createElement("div");
      botItem.className = "bot-item";
      botItem.innerHTML = `
        <div class="bot-info">
          <div class="bot-name">${bot.name}</div>
          <div class="bot-company">${bot.company}</div>
        </div>
        <div class="bot-stats">
          <div class="bot-requests">${bot.count.toLocaleString()} requests</div>
          <div class="bot-percentage">${percentage}%</div>
        </div>`;
      listElement.appendChild(botItem);
    });
  }

  destroyExistingCharts() {
    Object.values(this.charts).forEach(chart => chart.destroy());
    this.charts = {};
  }

  createAllCharts(data) {
    const dailyDataForRange = {};
    const dateKeys = Object.keys(this.dailyStats).sort();
    for (const dateKey of dateKeys) {
        const dayDate = new Date(dateKey + 'T00:00:00.000Z');
        if (dayDate >= data.minDate && dayDate <= data.maxDate) {
            dailyDataForRange[dateKey] = this.dailyStats[dateKey];
        }
    }
    this.createResponseCodesChart(dailyDataForRange);
    this.createEventsChart(dailyDataForRange);
    this.createBotActivityChart(dailyDataForRange);
    this.createUrlsChart(data.urlCounts);
    this.createBotDistributionChart(data.botStats);
  }
  
  createResponseCodesChart(dailyData) {
    const ctx = document.getElementById("responseCodesChart").getContext("2d");
    const dates = Object.keys(dailyData).sort();
    const datasets = [
        { label: "Success (2xx)", data: dates.map(date => dailyData[date].statusCodes[2] || 0), borderColor: "#27ae60", tension: 0.1 },
        { label: "Redirection (3xx)", data: dates.map(date => dailyData[date].statusCodes[3] || 0), borderColor: "#f39c12", tension: 0.1 },
        { label: "Client Error (4xx)", data: dates.map(date => dailyData[date].statusCodes[4] || 0), borderColor: "#e74c3c", tension: 0.1 },
        { label: "Server Error (5xx)", data: dates.map(date => dailyData[date].statusCodes[5] || 0), borderColor: "#8e44ad", tension: 0.1 },
    ];
    this.charts.responseCodes = new Chart(ctx, {
        type: "line",
        data: { labels: dates, datasets },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  }

  createEventsChart(dailyData) {
    const ctx = document.getElementById("eventsChart").getContext("2d");
    const dates = Object.keys(dailyData).sort();
    this.charts.events = new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: [{ label: "Total Events", data: dates.map(date => dailyData[date].totalEntries), borderColor: "#3498db", tension: 0.1, fill: true }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  }

  createBotActivityChart(dailyData) {
    const ctx = document.getElementById("botActivityChart").getContext("2d");
    const dates = Object.keys(dailyData).sort();
    const datasets = [
        { label: "Human Traffic", data: dates.map(date => dailyData[date].humanRequests), borderColor: "#27ae60", tension: 0.1 },
        { label: "Bot Traffic", data: dates.map(date => dailyData[date].botRequests), borderColor: "#e74c3c", tension: 0.1 }
    ];
    this.charts.botActivity = new Chart(ctx, {
        type: "line",
        data: { labels: dates, datasets },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  }

  createUrlsChart(urlCounts) {
    const ctx = document.getElementById("urlsChart").getContext("2d");
    const topUrls = Object.entries(urlCounts).sort(([, a], [, b]) => b - a).slice(0, 10);
    this.charts.urls = new Chart(ctx, {
        type: "bar",
        data: {
            labels: topUrls.map(([url]) => (url.length > 30 ? `${url.substring(0, 30)}...` : url)),
            datasets: [{ label: "Requests", data: topUrls.map(([, count]) => count), backgroundColor: "rgba(52, 152, 219, 0.8)" }]
        },
        options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
    });
  }

  createBotDistributionChart(botStats) {
    const ctx = document.getElementById("botDistributionChart").getContext("2d");
    const topBots = Object.values(botStats).sort((a, b) => b.count - a.count).slice(0, 10);
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40", "#c8a2c8", "#fd7f6f", "#7eb0d5", "#b2e061"];
    this.charts.botDistribution = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: topBots.map(bot => bot.name),
            datasets: [{ data: topBots.map(bot => bot.count), backgroundColor: colors }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "right" } } }
    });
  }

  createAllTables(data) {
    this.createTopUrlsTable(data.urlCounts, data.totalEntries);
    this.createTopIpsTable(data.ipCounts, data.totalEntries);
    this.createBotTable(data.botStats, data.totalEntries);
    this.createBotUrlHitsTable(data.botUrlHits);
  }

  createTopUrlsTable(urlCounts, totalEntries) {
    const topUrls = Object.entries(urlCounts).sort(([, a], [, b]) => b - a).slice(0, 20);
    const tbody = document.querySelector("#topUrlsTable tbody");
    tbody.innerHTML = "";
    topUrls.forEach(([url, count]) => {
      const percentage = totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(2) : 0;
      const row = tbody.insertRow();
      row.innerHTML = `
        <td title="${url}">${url.length > 50 ? `${url.substring(0, 50)}...` : url}</td>
        <td>${count.toLocaleString()}</td>
        <td class="percentage">${percentage}%</td>`;
    });
  }

  createTopIpsTable(ipCounts, totalEntries) {
    const topIps = Object.entries(ipCounts).sort(([, a], [, b]) => b - a).slice(0, 20);
    const tbody = document.querySelector("#topIpsTable tbody");
    tbody.innerHTML = "";
    topIps.forEach(([ip, count]) => {
      const percentage = totalEntries > 0 ? ((count / totalEntries) * 100).toFixed(2) : 0;
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${ip}</td>
        <td>${count.toLocaleString()}</td>
        <td class="percentage">${percentage}%</td>`;
    });
  }

  createBotTable(botStats, totalEntries) {
    const sortedBots = Object.values(botStats).sort((a, b) => b.count - a.count).slice(0, 50);
    const tbody = document.querySelector("#botDetailsTable tbody");
    tbody.innerHTML = "";
    sortedBots.forEach(bot => {
      const percentage = totalEntries > 0 ? ((bot.count / totalEntries) * 100).toFixed(2) : 0;
      const row = tbody.insertRow();
      row.innerHTML = `
        <td><strong>${bot.name}</strong><br><small>${bot.company}</small></td>
        <td><span class="bot-type-${bot.type}">${bot.type.toUpperCase()}</span></td>
        <td>${bot.count.toLocaleString()}</td>
        <td class="percentage">${percentage}%</td>
        <td>${new Date(bot.lastSeen).toLocaleString()}</td>`;
    });
  }

  // START: Modified methods for bot URL hits table and dropdown
  updateMultiSelectDisplayText() {
      const display = document.getElementById('botUrlFilterDisplay');
      const checkboxContainer = document.getElementById('botUrlFilterCheckboxes');
      if (!checkboxContainer) return;

      const selectedCount = checkboxContainer.querySelectorAll('input:checked').length;
      const totalCount = checkboxContainer.querySelectorAll('input').length;

      if (totalCount === 0) {
          display.textContent = 'No bots detected';
      } else if (selectedCount === 0) {
          display.textContent = 'Select Bots';
      } else if (selectedCount === totalCount) {
          display.textContent = 'All bots selected';
      } else {
          display.textContent = `${selectedCount} of ${totalCount} bots selected`;
      }
  }

  populateBotFilterControls(botStats) {
      const container = document.getElementById("botUrlFilterCheckboxes");
      container.innerHTML = "";
      const sortedBots = Object.values(botStats).sort((a, b) => b.count - a.count);

      if (sortedBots.length === 0) {
          this.updateMultiSelectDisplayText();
          return;
      }
      
      const top10Bots = sortedBots.slice(0, 10).map(b => b.name);

      sortedBots.forEach(bot => {
          const label = document.createElement('label');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = bot.name;
          checkbox.checked = top10Bots.includes(bot.name);
          label.appendChild(checkbox);
          label.appendChild(document.createTextNode(bot.name));
          container.appendChild(label);
      });
      this.updateMultiSelectDisplayText();
  }

  createBotUrlHitsTable(botUrlHits) {
      const thead = document.querySelector("#botUrlHitsTable thead");
      const tbody = document.querySelector("#botUrlHitsTable tbody");
      thead.innerHTML = "";
      tbody.innerHTML = "";
      
      const selectedBots = Array.from(document.querySelectorAll('#botUrlFilterCheckboxes input:checked')).map(cb => cb.value);

      // This is the key logic change
      if (selectedBots.length === 0) {
          const row = tbody.insertRow();
          row.className = 'table-placeholder';
          const cell = row.insertCell();
          cell.colSpan = 1; // It will expand anyway
          cell.textContent = 'Select one or more bots to display data.';
          return;
      }

      const headerRow = thead.insertRow();
      headerRow.innerHTML = `<th>URL</th>`;
      selectedBots.forEach(botName => {
          headerRow.innerHTML += `<th>${botName}</th>`;
      });
      headerRow.innerHTML += `<th>Total</th>`;

      let dataForTable = [];
      for (const [url, hitsByBot] of Object.entries(botUrlHits)) {
          let totalHitsForSelectedBots = 0;
          let hasHitsFromSelected = false;
          const botCounts = {};

          for(const botName of selectedBots) {
              const count = hitsByBot[botName] || 0;
              if (count > 0) {
                  hasHitsFromSelected = true;
                  totalHitsForSelectedBots += count;
                  botCounts[botName] = count;
              }
          }

          if(hasHitsFromSelected) {
              dataForTable.push({
                  url,
                  totalHits: totalHitsForSelectedBots,
                  botCounts
              });
          }
      }

      dataForTable.sort((a,b) => b.totalHits - a.totalHits);
      const top100 = dataForTable.slice(0, 100);

      if (top100.length === 0) {
        const row = tbody.insertRow();
        row.className = 'table-placeholder';
        const cell = row.insertCell();
        cell.colSpan = selectedBots.length + 2;
        cell.textContent = 'No hits found for the selected bots in this period.';
        return;
      }

      top100.forEach(rowData => {
          const row = tbody.insertRow();
          row.innerHTML = `<td title="${rowData.url}">${rowData.url.length > 70 ? `${rowData.url.substring(0, 70)}...` : rowData.url}</td>`;
          
          selectedBots.forEach(botName => {
              row.innerHTML += `<td>${(rowData.botCounts[botName] || 0).toLocaleString()}</td>`;
          });
          row.innerHTML += `<td><strong>${rowData.totalHits.toLocaleString()}</strong></td>`;
      });
  }
  // END: Modified methods

  formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  showLoading(show) {
    document.getElementById("loadingIndicator").classList.toggle("hidden", !show);
    document.getElementById("results").classList.toggle("hidden", show);
    if (show) this.destroyExistingCharts();
  }

  setupDateRangeControls(minDate, maxDate) {
    const startDateInput = document.getElementById("startDate");
    const endDateInput = document.getElementById("endDate");
    const minDateStr = minDate.toISOString().split("T")[0];
    const maxDateStr = maxDate.toISOString().split("T")[0];

    startDateInput.min = minDateStr;
    startDateInput.max = maxDateStr;
    endDateInput.min = minDateStr;
    endDateInput.max = maxDateStr;

    startDateInput.value = minDateStr;
    endDateInput.value = maxDateStr;

    document.getElementById("totalLogEntries").textContent = `${this.fullFileAnalysis.totalEntries.toLocaleString()} total entries`;
    document.getElementById("dateRangeSpan").textContent = `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
  }

  applyDateFilter() {
    if (!this.fullFileAnalysis) return;
    const startDate = new Date(document.getElementById("startDate").value + 'T00:00:00.000Z');
    const endDate = new Date(document.getElementById("endDate").value + 'T00:00:00.000Z');
    
    if (endDate < startDate) {
        alert("End date cannot be earlier than start date.");
        return;
    }

    this.currentAnalysis = this.aggregateStatsForRange(startDate, endDate);
    this.displayResults(this.currentAnalysis);
    this.showFilteredInfo(this.currentAnalysis);
  }

  applyQuickFilter(days) {
    if (!this.fullFileAnalysis) return;
    const maxDate = new Date(this.fullFileAnalysis.maxDate);
    const startDate = new Date(maxDate);
    startDate.setUTCDate(startDate.getUTCDate() - (days - 1));

    document.getElementById("startDate").value = startDate.toISOString().split("T")[0];
    document.getElementById("endDate").value = maxDate.toISOString().split("T")[0];

    this.currentAnalysis = this.aggregateStatsForRange(startDate, maxDate);
    this.displayResults(this.currentAnalysis);
    this.showFilteredInfo(this.currentAnalysis);
  }

  resetDateFilter() {
    if (!this.fullFileAnalysis) return;
    this.currentAnalysis = this.fullFileAnalysis;
    this.setupDateRangeControls(this.fullFileAnalysis.minDate, this.fullFileAnalysis.maxDate);
    this.displayResults(this.currentAnalysis);
    document.getElementById("filteredInfo").classList.add("hidden");
  }

  showFilteredInfo(data) {
    const filteredInfo = document.getElementById("filteredInfo");
    document.getElementById("filteredEntries").textContent = `${data.totalEntries.toLocaleString()} entries`;
    document.getElementById("filteredDateRange").textContent = `${data.minDate.toLocaleDateString()} - ${data.maxDate.toLocaleDateString()}`;
    filteredInfo.classList.remove("hidden");
  }

  exportFullReport() {
    if (!this.currentAnalysis) {
        alert("Please analyze a file first.");
        return;
    }
    const reportData = {
        summary: {
            totalRequests: this.currentAnalysis.totalEntries,
            botTraffic: this.currentAnalysis.totalEntries > 0 ? `${((this.currentAnalysis.botRequests / this.currentAnalysis.totalEntries) * 100).toFixed(1)}%` : "0%",
            uniqueIPs: Object.keys(this.currentAnalysis.ipCounts).length,
            dateRange: {
                start: this.currentAnalysis.minDate.toISOString(),
                end: this.currentAnalysis.maxDate.toISOString(),
            },
        },
        botAnalysis: Object.values(this.currentAnalysis.botStats).sort((a, b) => b.count - a.count),
        topUrls: Object.entries(this.currentAnalysis.urlCounts).sort(([, a], [, b]) => b - a).slice(0, 50).map(([url, count]) => ({ url, count })),
        topIPs: Object.entries(this.currentAnalysis.ipCounts).sort(([, a], [, b]) => b - a).slice(0, 50).map(([ip, count]) => ({ ip, count })),
        generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `access-log-analysis-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new LogAnalyzer();
});